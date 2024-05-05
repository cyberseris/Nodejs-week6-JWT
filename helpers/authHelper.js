const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const hashPassword = async (password) => {
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

const generateSendJWT = (user, statusCode, res) => {
    //產生 JWT token
    const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_DAY
    });

    user.password = 'undefined';
    res.status(statusCode).json({
        status: 'success',
        user: {
            token,
            name: user.name
        }
    })
}

module.exports = {
    hashPassword: hashPassword,
    comparePassword: comparePassword,
    generateSendJWT: generateSendJWT
}

