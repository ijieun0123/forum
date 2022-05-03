const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    forumId: {
        type: String,
        required: true,
    },
    commentText: {
        type: String,
        required: true,
    },
    author: {
        nickname : {
            type: String,
            required: true,
        },
        profileImage: {
            type: String,
            required: true,
        },
    },
    children: [{
        commentText: {
            type: String,
            required: true,
        },
        author: {
            nickname : {
                type: String,
                required: true,
            },
            profileImage: {
                type: String,
                required: true,
            },
        }
    }]
}, {
    timestamps: true,
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;