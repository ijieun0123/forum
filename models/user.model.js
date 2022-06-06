const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    profileImagePath: { 
        type: String, 
        default: '/img/profile_default.png' // 기본 프로필사진
    },
    profileImageName: { 
        type: String, 
        default: '' 
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
