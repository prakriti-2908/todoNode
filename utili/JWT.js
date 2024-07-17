const jwt = require('jsonwebtoken');

const generateToken = (email) => {
    const token = jwt.sign(email,process.env.SECRET_KEY);
    return token;
}

module.exports = generateToken;