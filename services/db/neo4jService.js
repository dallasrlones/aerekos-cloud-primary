const neo4j = require('neo4j-driver');
const uuidv4 = require('uuid').v4;

// Neo4j connection details
const uri = process.env.NEO_URL || 'bolt://host.docker.internal:7687'; // Replace with your Neo4j server URI
const user = process.env.NEO_USER || 'neo4j'; // Replace with your Neo4j username
const password = process.env.NEO_PASSWORD || '1hlg461l426lh4glhg6lg624hl3g64lh264g2'; // Replace with your Neo4j password

try {
    // Create a Neo4j driver instance
    const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

    // Function to execute a Cypher query
    async function runCypherQuery(query, params = {}) {
        const session = driver.session();
        try {
            const result = await session.run(query, params);
            // console.log(result)
            return result.records.map(record => record.toObject());
        } catch (err) {
            console.log('runCypherQuery - Error', err)
            throw err;
        } finally {
            session.close();
        }
    }

    const convertTypes = (returnObj) => {
        const formattedObj = {};
        // console.log('Original Object:', returnObj); // Log the original object

        Object.entries(returnObj).forEach(([key, value]) => {
            // Check if the value is an object and has both 'high' and 'low' properties
            if (typeof value === 'object' && value !== null && 'high' in value && 'low' in value) {
                // Reconstruct the integer from high and low values
                const low = value.low >>> 0; // Ensure low is treated as unsigned
                const high = value.high;
                formattedObj[key] = high * 2 ** 32 + low;
                // console.log(`Converted ${key}:`, formattedObj[key]); // Log the conversion
            } else {
                // Copy the value as it is (handles numbers, strings, booleans, etc.)
                formattedObj[key] = value;
            }
        });

        // console.log('Formatted Object:', formattedObj); // Log the formatted object
        return formattedObj;
    };

    function uuid() {
        return uuidv4();
    }
    const objToString = (obj) => {
        let properties = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'number' || typeof value === 'boolean') {
                    properties.push(`${key}: ${value}`);
                } else if (typeof value === 'string') {
                    let escapedValue = value.replace(/'/g, "\\'"); // Escape single quotes
                    properties.push(`${key}: '${escapedValue}'`);
                } else if (value instanceof Date) {
                    properties.push(`${key}: datetime("${value.toISOString()}")`);
                } else if (Array.isArray(value)) {
                    properties.push(`${key}: ${JSON.stringify(value)}`);
                } else if (value === null || value === undefined) {
                    properties.push(`${key}: null`);
                } else if (typeof value === 'object') {
                    properties.push(`${key}: ${objToString(value)}`);
                }
            }
        }
        return `{ ${properties.join(', ')} }`;
    };

    const objToSet = (label, updateObj) => {
        const setStatements = Object.entries(updateObj).map(([key, value]) => {
            if (typeof value === 'number' || typeof value === 'boolean') {
                return `${label}.${key} = ${value}`;
            } else if (typeof value === 'string') {
                let escapedValue = value.replace(/'/g, "\\'");
                return `${label}.${key} = '${escapedValue}'`;
            } else if (value instanceof Date) {
                return `${label}.${key} = datetime("${value.toISOString()}")`;
            } else if (Array.isArray(value)) {
                return `${label}.${key} = ${JSON.stringify(value)}`;
            } else if (value === null || value === undefined) {
                return `${label}.${key} = null`;
            } else if (typeof value === 'object') {
                return `${label}.${key} = ${objToString(value)}`;
            } else {
                return `${label}.${key} = '${value}'`; // Fallback for any other types
            }
        }).join(', ');
        return setStatements;
    };    

    const objToAnd = (label, updateObj) => {
        const setStatements = Object.entries(updateObj).map(([key, value]) => {
            if (typeof value === 'number' || typeof value === 'boolean') {
                return `${label}.${key} = ${value}`;
            } else if (typeof value === 'string') {
                let escapedValue = value.replace(/'/g, "\\'");
                return `${label}.${key} = '${escapedValue}'`;
            } else if (value instanceof Date) {
                return `${label}.${key} = datetime("${value.toISOString()}")`;
            } else if (Array.isArray(value)) {
                return `${label}.${key} = ${JSON.stringify(value)}`;
            } else if (value === null || value === undefined) {
                return `${label}.${key} = null`;
            } else if (typeof value === 'object') {
                return `${label}.${key} = ${objToString(value)}`;
            } else {
                return `${label}.${key} = '${value}'`; // Fallback for any other types
            }
        }).join(' AND ');
        return setStatements;
    };    

    const checkLockedProps = (lockedProps, obj) => {
        const presentLockedProps = lockedProps.filter(prop => obj[prop] !== undefined);

        if (presentLockedProps.length > 0) {
            return presentLockedProps;
        }

        return false;
    };

    async function setupConstraints(label, options) {
        if (options && options.required) {
            for (const prop of options.required) {
                await runCypherQuery(`CREATE CONSTRAINT IF NOT EXISTS FOR (${label.toLowerCase()}:${label}) REQUIRE ${label.toLowerCase()}.${prop} IS NOT NULL`);
            }
        }

        if (options && options.unique) {
            for (const prop of options.unique) {
                await runCypherQuery(`CREATE CONSTRAINT IF NOT EXISTS FOR (${label.toLowerCase()}:${label}) REQUIRE ${label.toLowerCase()}.${prop} IS UNIQUE`);
            }
        }
    }

    // options: { unique: [], required: [], before: (obj)=>{ return obj } }
    function generateCreate(label, options) {
        // setupConstraints(label, options).catch(console.error);

        return async (createObj) => {
            try {
                if (options && options.before !== undefined) {
                    console.log(`[${label}] Executing before hook`);
                    // Await the execution of the before hook
                    createObj = await options.before(createObj);
                }

                createObj.id = uuid();
                createObj.created_at = Date.now();
                createObj.updated_at = createObj.created_at;

                // console.log('createObj', createObj)

                const timestamp = Date.now();
                // console.log('Timestamp (milliseconds since Unix epoch):', timestamp);

                const date = new Date(timestamp);
                // console.log('Date in UTC:', date.toUTCString());
                // console.log('Date in local time:', date.toString());

                const query = `CREATE (${label.toLowerCase()}:${label} ${objToString(createObj)}) RETURN ${label.toLowerCase()}`;

                let results = await runCypherQuery(query);

                if (results != false && options.after !== undefined) {
                    results = await options.after(convertTypes(results[0][label.toLowerCase()].properties));
                }

                if (results) {
                    if (results !== false) {
                        return options.after != undefined ? results : convertTypes(results[0][label.toLowerCase()].properties);
                    } else {
                        return { error: 'Constraints' };
                    }
                } else {
                    console.log(query, results)
                    return null; // No node was created
                }
            } catch (error) {
                console.log(error)
                // Analyze the error to determine the cause
                if (error.message.includes('ConstraintValidationFailed')) {
                    return { error: 'Constraint violation', details: error.message };
                } else {
                    // Handle other types of errors
                    return { error: 'Unknown error', details: error.message };
                }
            }
        };
    }

    function generateFindById(label, options) {
        return async (id) => {
            const query = `MATCH (${label[0].toLowerCase()}:${label} { id: '${id}' }) RETURN ${label[0].toLowerCase()}`;
            let results = await runCypherQuery(query);
            results = results.map(result => {
                return convertTypes(result[label[0].toLowerCase()].properties);
            })[0];

            if (results != false && options && options.after !== undefined) {
                results = await options.after(results);
            }

            return results;
        }
    }

    function generateFindBy(label, options) {
        return async (findObj, paginationOptions = {}) => {
            const { index = 0, limit } = paginationOptions;
            
            let query = `MATCH (${label[0].toLowerCase()}:${label}) WHERE ${objToAnd(label[0].toLowerCase(), findObj)} RETURN ${label[0].toLowerCase()} ORDER BY ${label[0].toLowerCase()}.created_at DESC`;
            
            // Add SKIP clause if index is provided
            if (index > 0) {
                query += ` SKIP ${index}`;
            }
            
            // Add LIMIT clause if limit is provided
            if (limit !== undefined && limit > 0) {
                query += ` LIMIT ${limit}`;
            }
            
            let results = await runCypherQuery(query);
            results = results.map(result => {
                return convertTypes(result[label[0].toLowerCase()].properties);
            });

            if (results != false && options && options.after !== undefined) {
                results = await options.after(results);
                return results;
            }

            return results || null;
        }
    }

    function generateFindOneBy(label, options) {
        return async (findObj) => {
            const query = `MATCH (${label[0].toLowerCase()}:${label}) WHERE ${objToAnd(label[0].toLowerCase(), findObj)} RETURN ${label[0].toLowerCase()} ORDER BY ${label[0].toLowerCase()}.created_at DESC LIMIT 1`;

            let results = await runCypherQuery(query);

            if (results.length > 0) {
                results = convertTypes(results[0][label[0].toLowerCase()].properties);
            }

            if (results && options && options.after !== undefined) {
                results = await options.after(results);
                return results;
            }

            if (results.length == 0) {
                return null;
            }

            return results;
        }
    }

    function generateFindBySortBy(label) {
        return async (findObj, orderByKey) => {
            const nodeAlias = label[0].toLowerCase(); // Alias for the node based on the label
            const whereClause = objToAnd(nodeAlias, findObj); // Generating WHERE clause from findObj

            // Constructing ORDER BY clause dynamically based on orderByKey
            const orderByClause = orderByKey ? ` ORDER BY ${nodeAlias}.${orderByKey}` : '';

            // Building the query with optional ORDER BY clause
            const query = `MATCH (${nodeAlias}:${label}) WHERE ${whereClause} RETURN ${nodeAlias}${orderByClause}`;
            let results = await runCypherQuery(query);

            // Converting the types of the properties in the results
            results = results.map(result => convertTypes(result[nodeAlias].properties));

            return results;
        }
    }

    function generateFindOneBySortBy(label) {
        return async (findObj, orderByKey) => {
            const nodeAlias = label[0].toLowerCase(); // Alias for the node based on the label
            const whereClause = objToAnd(nodeAlias, findObj); // Generating WHERE clause from findObj

            // Constructing ORDER BY clause dynamically based on orderByKey
            const orderByClause = orderByKey ? ` ORDER BY ${nodeAlias}.${orderByKey} DESC` : '';

            // Building the query with optional ORDER BY clause and LIMIT 1 to return only the first result
            const query = `MATCH (${nodeAlias}:${label}) WHERE ${whereClause} RETURN ${nodeAlias}${orderByClause} LIMIT 1`;
            let results = await runCypherQuery(query);

            // Checking if results array is not empty and converting the types of the properties in the first result
            if (results.length > 0) {
                results = convertTypes(results[0][nodeAlias].properties);
                return results;
            } else {
                return null; // Return null if no results are found
            }
        }
    }

    function generateUpdate(label, options) {
        return async (id, updateObj) => {
            const lockedPropertiesResult = checkLockedProps(options.locked || [], updateObj);
            if (lockedPropertiesResult) {
                console.log(`Locked properties present for ${label}: ${lockedPropertiesResult.join(', ')}`);
                return { error: 'Locked properties cannot be updated', lockedPropertiesResult };
            }
    
            updateObj.updated_at = Date.now();
    
            if (options.before !== undefined) {
                // Await the execution of the before hook
                updateObj = await options.before(updateObj);
            }
    
            try {
                const query = `MATCH (${label[0].toLowerCase()}:${label} { id: '${id}' }) SET ${objToSet(label[0].toLowerCase(), updateObj)} RETURN ${label[0].toLowerCase()}`;
                let results = await runCypherQuery(query);
    
                if (options.after !== undefined) {
                    await options.after(results);
                }
    
                if (results && results.length > 0) {
                    const record = results[0];
                    const formattedResult = {
                        ...convertTypes(record[label[0].toLowerCase()].properties)
                    };
                    return formattedResult;
                } else {
                    return null; // Node not found or no properties updated
                }
            } catch (error) {
                console.log(error);
    
                // Analyze the error to determine the cause
                if (error.message.includes('ConstraintValidationFailed')) {
                    return { error: 'Constraint violation', details: error.message };
                } else {
                    // Handle other types of errors
                    return { error: 'Unknown error', details: error.message };
                }
            }
        };
    }
    
    function generateDeleteById(label) {
        const nodeAlias = 'n'; // Define a node alias
        return async (id) => {
            const query = `MATCH (${nodeAlias}:${label} { id: $id }) DETACH DELETE ${nodeAlias}`;
            const params = { id };
            const results = await runCypherQuery(query, params);
    
            // If results are returned, process them (this part may need adjustment based on actual query execution)
            if (results.records.length > 0) {
                const deletedNode = results.records[0].get(nodeAlias);
                return convertTypes(deletedNode.properties);
            } else {
                return null; // Return null if no results are found
            }
        };
    }

    function generateDeleteBy(label) {
        const nodeAlias = 'n';

        return async (matchFields) => {
            const fieldKeys = Object.keys(matchFields);
            const matchConditions = fieldKeys.map(key => `${key}: $${key}`).join(', ');

            const query = `
                MATCH (${nodeAlias}:${label} { ${matchConditions} })
                OPTIONAL MATCH (${nodeAlias})-[r]-()
                DETACH DELETE ${nodeAlias}, r
            `;

            const params = matchFields;
            const results = await runCypherQuery(query, params);

            return results.records.length > 0 ? results.records : null;
        };
    }

    function generateDeleteAllForUser(label) {
        const nodeAlias = 'n'; // Define a node alias
        return async (value) => {
            const query = `
                MATCH (${nodeAlias}:${label} { user_id: $value })
                OPTIONAL MATCH (${nodeAlias})-[r]-()
                DETACH DELETE ${nodeAlias}, r
            `;
            const params = { value };
            const results = await runCypherQuery(query, params);
    
            // If results are returned, process them (this part may need adjustment based on actual query execution)
            if (results.records.length > 0) {
                return results.records; // Adjust this if you need to process results further
            } else {
                return null; // Return null if no results are found
            }
        };
    }
    
    function generateCrud(label, { required=[], unique=[], locked=[], before, after }) {
        const tmp = {
            LABEL: label,
            create: generateCreate(label, { required, unique, before, after }),
            findById: generateFindById(label, { after }),
            findBy: generateFindBy(label, { after }),
            findOneBy: generateFindOneBy(label, { after }),
            findBySortBy: generateFindBySortBy(label),
            findOneBySortBy: generateFindOneBySortBy(label),
            update: generateUpdate(label, { locked, before, after }),
            deleteById: generateDeleteById(label),
            deleteBy: generateDeleteBy(label)
        }
        return tmp;
    }

    async function checkConnectionsAlive() {
        try {
            const session = driver.session();
            await session.run('RETURN 1');
            await session.close();
            console.log('Neo4j connection is alive.');
            return true;
        } catch (err) {
            console.error('Neo4j connection check failed:', err);
            return false;
        }
    }

    // Export the CRUD functions
    module.exports = {
        runCypherQuery,
        uuid,
        toInt: (val) => (neo4j.int(val).toNumber()),
        generateCreate,
        generateFindById,
        generateFindBy,
        generateFindOneBy,
        generateFindBySortBy,
        generateFindOneBySortBy,
        generateUpdate,
        generateDeleteById,
        generateDeleteAllForUser,
        objToSet,
        objToString,
        convertTypes,
        generateCrud,
        checkConnectionsAlive
    };

    // Close the Neo4j driver on process exit
    process.on('exit', () => {
        driver.close();
    });
} catch (err) {
    console.log(err)
}