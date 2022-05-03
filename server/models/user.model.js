const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    profileImage: { 
        type: String, 
        default: '/static/images/default_thumbnail.png' // 기본 프로필사진
    },
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
        unique: true,
        dropDups:true,
        sparse: true
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
        dropDups:true,
        sparse: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;