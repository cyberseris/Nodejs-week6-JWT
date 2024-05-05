const User = require('../models/usersModel');
const validator = require('validator');
const appError = require('../service/appError')
const { hashPassword, comparePassword, generateSendJWT } = require('../helpers/authHelper');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' })

//OK
const registerController = async function (req, res, next) {
    const userName = req.body.userName || '';
    const password = req.body.password || '';
    const email = req.body.email || '';
    /*     const pwdOptions = {
            minLength: 8,      //最小長度
            minLowercase: 1,   //至少一個小寫字母
            minUppercase: 1,   //至少一個大寫字母
            minNumbers: 1,     //至少一個數字
            minSymbols: 1,     //至少一個特殊字符
            returnStore: false //是否返回詳細分數
        } */

    if (!userName.trim() || !email.trim() || !password.trim()) {
        return next(appError("400", "暱稱或 email 或密碼不可為空，請重新輸入", next))
    }

    /*     if (!isStrongPassword(password, pwdOptions)) {
            return next(appError("400", "請輸入包含數字、大小寫字母及符號的密碼", next))
        } */

    if (!validator.isEmail(email)) {
        return next(appError("400", "Email 格式不正確", next))
    }

    //handleErrorAsync
    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
        userName: userName,
        email: email,
        password: hashedPassword,
    });

    generateSendJWT(newUser, 201, res);
};

//OK
const loginController = async function (req, res, next) {
    const email = req.body.email || '';
    const password = req.body.password || '';

    if (!email.trim() || !password.trim()) {
        return next(appError("400", "email 或 密碼不可為空", next));
    }

    const user = await User.findOne({ email }).select('+password');
    console.log(user.password)
    const auth = await comparePassword(password, user.password);

    if (!auth) {
        return next(appError(400, '您的密碼不正確', next));
    }
    generateSendJWT(user, 200, res);
};

//OK
const getUserController = async function (req, res, next) {
    res.status(200).json({
        success: 'success',
        user: req.user
    });
};

const updateUserController = async function (req, res, next) {
    const userName = req.body.userName || '';
    const password = req.body.password || '';
    const email = req.body.email || '';
    const photo = req.body.photo || '';
    const sex = req.body.sex || '';

    if (!userName.trim() || !email.trim() || !password.trim()) {
        return next(appError("400", "暱稱或 email 或密碼不可為空，請重新輸入", next))
    }

    if (!validator.isEmail(email)) {
        return next(appError("400", "Email 格式不正確", next))
    }

    //handleErrorAsync
    const newPassword = await hashPassword(password);
    const user = await User.findByIdAndUpdate(req.user.id, { userName: userName, email: email, password: newPassword, photo: photo, sex: sex });
    generateSendJWT(user, 200, res);
};

const updatePasswordController = async function (req, res, next) {
    const password = req.body.password || '';
    const confirmPassword = req.body.confirmPassword || '';

    if (!password.trim() || !confirmPassword.trim()) {
        return next(appError("400", "密碼不可為空，請重新輸入", next))
    }

    if (password !== confirmPassword) {
        return next(appError("400", '密碼不一致!', next));
    }

    const newPassword = await hashPassword(password);
    const user = await User.findByIdAndUpdate(req.user.id, { password: newPassword });
    generateSendJWT(user, 200, res);
};

module.exports = {
    getUserController: getUserController,
    updateUserController: updateUserController,
    registerController: registerController,
    loginController: loginController,
    updatePasswordController: updatePasswordController
}