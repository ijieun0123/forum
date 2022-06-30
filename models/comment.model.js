const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _forum: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Forum'
    },
    commentText: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;