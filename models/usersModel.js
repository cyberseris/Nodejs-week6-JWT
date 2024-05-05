const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, '請輸入您的暱稱']
    },
    photo: {
        type: String,
        default: ''
    },
    sex: {
        type: String,
        default: ''
        //enum: ["male", "female"]
    },
    email: {
        type: String,
        required: [true, '請輸入您的 Email'],
        unique: true,
        lowercase: true,
        select: false
    },
    password: {
        type: String,
        required: [true, '請輸入密碼'],
        minlength: 8,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    versionKey: false
}
);

const User = mongoose.model('user', userSchema);

module.exports = User;