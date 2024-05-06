const User = require('../models/usersModel');
const JWT = require('jsonwebtoken');
const handleErrorAsync = require('../service/handleErrorAsync');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const requireSignIn = handleErrorAsync(async (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(appError("401", "您尚未登入", next));
    }

    const decoded = await JWT.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    req.user = currentUser;
    next();

});

module.exports = {
    requireSignIn: requireSignIn
};
