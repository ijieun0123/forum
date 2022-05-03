const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const heartSchema = new Schema({
    forumId: {
        type: String,
        required:true
    },
    commentId: {
        type: String,
        required:false
    },
    heartCount: {
        type: Number,
        default:0
    },
    heartClickUsers: {
        type: Array,
        default: []
    }
})

const Heart = mongoose.model('Heart', heartSchema);

module.exports = Heart;