const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const forumSchema = new Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attachImagePath: {
        type: String,
        required: false,
    },
    attachImageName: {
        type: String,
        required: false,
    },
    titleText: {
        type: String,
        required: true
    },
    mainText: {
        type: String,
        required: true
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