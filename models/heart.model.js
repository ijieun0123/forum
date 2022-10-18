const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const heartSchema = new Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _forum: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Forum',
        required: true
    },
    _comment: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
    },
})

const Heart = mongoose.model('Heart', heartSchema);

module.exports = Heart;