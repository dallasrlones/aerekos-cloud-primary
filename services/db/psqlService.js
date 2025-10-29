const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

// PostgreSQL connection details
const pool = new Pool({
    connectionString: process.env.PSQL_DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mydb',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Enable pgcrypto for uuid_generate_v4()
pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`).catch(() => { });

// Utility: Escape identifier (table/column names)
const escapeIdentifier = (str) => `"${str.replace(/"/g, '""')}"`;

// Utility: Escape literal (string values)
const escapeLiteral = (str) => `'${str.replace(/'/g, "''")}'`;

// Convert object to SQL SET clause: "col1" = $1, "col2" = $2
const objToSet = (obj, paramOffset = 1) => {
    const keys = Object.keys(obj);
    const values = keys.map((key, i) => `$${paramOffset + i}`);
    const setClause = keys.map((key, i) => `${escapeIdentifier(key)} = ${values[i]}`).join(', ');
    return { setClause, params: Object.values(obj) };
};

// Convert object to SQL WHERE AND clause: "col1" = $1 AND "col2" = $2
const objToWhereAnd = (obj, paramOffset = 1) => {
    const keys = Object.keys(obj);
    const values = keys.map((key, i) => `$${paramOffset + i}`);
    const whereClause = keys.map((key, i) => `${escapeIdentifier(key)} = ${values[i]}`).join(' AND ');
    return { whereClause, params: Object.values(obj) };
};

// Generate UUID
function uuid() {
    return uuidv4();
}

// Execute raw SQL with parameters
async function runQuery(query, params = []) {
    const client = await pool.connect();
    try {
        const res = await client.query(query, params);
        return res.rows;
    } catch (err) {
        console.error('runQuery - Error:', err.message);
        throw err;
    } finally {
        client.release();
    }
}

// Setup table constraints (UNIQUE, NOT NULL)
async function setupConstraints(table, options) {
    const tableName = escapeIdentifier(table.toLowerCase());

    if (options?.required) {
        for (const col of options.required) {
            const colName = escapeIdentifier(col);
            await runQuery(`ALTER TABLE ${tableName} ALTER COLUMN ${colName} SET NOT NULL;`).catch(() => { });
        }
    }

    if (options?.unique) {
        for (const col of options.unique) {
            const colName = escapeIdentifier(col);
            const indexName = `${table}_${col}_unique_idx`;
            await runQuery(`
        ALTER TABLE ${tableName}
        ADD CONSTRAINT ${escapeIdentifier(indexName)} UNIQUE (${colName});
      `).catch(() => { });
        }
    }
}

// Create index
async function createIndex(table, columns, options = {}) {
    const tableName = escapeIdentifier(table.toLowerCase());
    const cols = Array.isArray(columns) ? columns : [columns];
    const colNames = cols.map(escapeIdentifier).join(', ');
    const indexName = options.name || `${table}_${cols.join('_')}_idx`;
    const unique = options.unique ? 'UNIQUE' : '';
    const method = options.method || 'btree';

    const query = `
    CREATE ${unique} INDEX IF NOT EXISTS ${escapeIdentifier(indexName)}
    ON ${tableName} USING ${method} (${colNames});
  `;

    await runQuery(query);
}

// Check if index exists
async function checkIndexExists(indexName) {
    const query = `
    SELECT 1 FROM pg_indexes
    WHERE indexname = $1
  `;
    const result = await runQuery(query, [indexName]);
    return result.length > 0;
}

async function checkConnectionsAlive() {
    try {
        // Check PostgreSQL connection
        await pool.query('SELECT 1;');
        return true;
    } catch (err) {
        console.error('Database connection check failed:', err);
        return false;
    }
}

// Generate CRUD operations
function generateCrud(label, { required = [], unique = [], locked = [] } = {}) {
    const table = label.toLowerCase();
    const tableName = escapeIdentifier(table);

    // Ensure base columns exist
    (async () => {
        await runQuery(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        deleted_at TIMESTAMPTZ
      );
    `);

        // Add trigger for updated_at
        await runQuery(`
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_trigger
          WHERE tgname = 'trigger_update_${table}_updated_at'
        ) THEN
          CREATE TRIGGER trigger_update_${table}_updated_at
          BEFORE UPDATE ON ${tableName}
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at();
        END IF;
      END $$;
    `).catch(() => { });

        await setupConstraints(table, { required, unique });
    })().catch(console.error);

    return {
        LABEL: label,

        // CREATE
        create: (options = {}) => {
            return async (createObj) => {
                try {
                    if (options.before) createObj = await options.before(createObj);

                    createObj.id = createObj.id || uuid();
                    createObj.created_at = createObj.created_at || new Date();
                    createObj.updated_at = createObj.updated_at || createObj.created_at;

                    const keys = Object.keys(createObj);
                    const values = keys.map((_, i) => `$${i + 1}`);
                    const columns = keys.map(escapeIdentifier).join(', ');
                    const query = `
            INSERT INTO ${tableName} (${columns})
            VALUES (${values})
            RETURNING *
          `;
                    const params = Object.values(createObj);

                    let [result] = await runQuery(query, params);
                    if (!result) return null;

                    if (options.after) {
                        result = await options.after(result);
                    }

                    return result;
                } catch (error) {
                    if (error.code === '23505') { // Unique violation
                        return { error: 'Constraint violation', details: error.detail };
                    }
                    return { error: 'Unknown error', details: error.message };
                }
            };
        },

        // FIND BY ID
        findById: (options = {}) => {
            return async (id) => {
                const query = `SELECT * FROM ${tableName} WHERE id = $1 AND deleted_at IS NULL`;
                const [result] = await runQuery(query, [id]);
                if (!result) return null;
                return options.after ? await options.after(result) : result;
            };
        },

        // FIND BY
        findBy: (options = {}) => {
            return async (findObj, sortBy) => {
                const { whereClause, params } = objToWhereAnd(findObj, 1);
                const orderBy = sortBy ? `ORDER BY ${escapeIdentifier(sortBy)} DESC` : 'ORDER BY created_at DESC';
                const query = `
          SELECT * FROM ${tableName}
          WHERE ${whereClause} AND deleted_at IS NULL
          ${orderBy}
        `;
                let results = await runQuery(query, params);
                if (options.after) results = await Promise.all(results.map(options.after));
                return results;
            };
        },

        // FIND ONE BY
        findOneBy: (options = {}) => {
            return async (findObj, sortBy) => {
                const { whereClause, params } = objToWhereAnd(findObj, 1);
                const orderBy = sortBy ? `ORDER BY ${escapeIdentifier(sortBy)} DESC` : '';
                const query = `
          SELECT * FROM ${tableName}
          WHERE ${whereClause} AND deleted_at IS NULL
          ${orderBy} LIMIT 1
        `;
                const [result] = await runQuery(query, params);
                if (!result) return null;
                return options.after ? await options.after(result) : result;
            };
        },

        // UPDATE
        update: (options = {}) => {
            return async (id, updateObj) => {
                const lockedProps = locked.filter(prop => updateObj[prop] !== undefined);
                if (lockedProps.length > 0) {
                    return { error: 'Locked properties cannot be updated', locked: lockedProps };
                }

                if (options.before) updateObj = await options.before(updateObj);

                updateObj.updated_at = new Date();

                const setData = objToSet(updateObj, 2); // $1 = id, $2+ = values
                const query = `
          UPDATE ${tableName}
          SET ${setData.setClause}
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING *
        `;
                const params = [id, ...setData.params];

                try {
                    const [result] = await runQuery(query, params);
                    if (!result) return null;

                    if (options.after) await options.after(result);
                    return result;
                } catch (error) {
                    if (error.code === '23505') {
                        return { error: 'Constraint violation', details: error.detail };
                    }
                    return { error: 'Unknown error', details: error.message };
                }
            };
        },

        // DELETE BY ID (Soft delete)
        deleteById: () => {
            return async (id) => {
                const query = `
          UPDATE ${tableName}
          SET deleted_at = NOW()
          WHERE id = $1 AND deleted_at IS NULL
          RETURNING *
        `;
                const [result] = await runQuery(query, [id]);
                return result || null;
            };
        },

        // DELETE BY (Soft delete multiple)
        deleteBy: () => {
            return async (matchObj) => {
                const { whereClause, params } = objToWhereAnd(matchObj);
                const query = `
          UPDATE ${tableName}
          SET deleted_at = NOW()
          WHERE ${whereClause} AND deleted_at IS NULL
          RETURNING *
        `;
                return await runQuery(query, params);
            };
        },
    };
}

// Export
module.exports = {
    runQuery,
    uuid,
    checkConnectionsAlive,
    generateCrud,
    createIndex,
    checkIndexExists,
    objToSet,
    objToWhereAnd,
    escapeIdentifier,
    escapeLiteral,
    pool,
};

// Graceful shutdown
process.on('exit', async () => {
    await pool.end();
});