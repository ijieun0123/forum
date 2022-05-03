const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const forumSchema = new Schema({
    profileImage: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    attachImage: {
        type: String,
        required: false,
    },
    attachImageValue: {
        type: String,
        required: false,
    },
    titleText: {
        type: String,
        required: true,
    },
    mainText: {
        type: String,
        required: true,
    },
    viewCount: {
        type: Number,
        default:0
    },
}, {
    timestamps: true,
})

const Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;