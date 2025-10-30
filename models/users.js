const bcrypt = require('bcryptjs');
const { generateCreate, generateFindById, generateFindBy, generateFindOneBy, generateUpdate } = require('../services/db/neo4jService');

const LABEL = 'USER';
const REQUIRED_FIELDS = ['email', 'password'];
const UNIQUE_FIELDS = ['email'];
const LOCKED_FIELDS = ['id'];

const hashUserPassword = async (user) => {
    if (user.password !== undefined) {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(user.password, salt);
        user.password = hashedPass;
    }
    return user;
};

const verifyPassword = async (user, plainTextPassword) => {
    return bcrypt.compare(plainTextPassword, user.password);
};

const userModel = {};

userModel.findById = generateFindById(LABEL);

userModel.findBy = generateFindBy(LABEL);

userModel.findOneBy = generateFindOneBy(LABEL);

userModel.create = generateCreate(LABEL, { 
    required: REQUIRED_FIELDS,
    unique: UNIQUE_FIELDS,
    before: hashUserPassword
});

userModel.update = generateUpdate(LABEL, { locked: LOCKED_FIELDS, before: hashUserPassword });
userModel.verifyPassword = verifyPassword;

module.exports = userModel;