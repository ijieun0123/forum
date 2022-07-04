const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const imageSchema = new Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    _forum: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Forum'
    },
    imagePath: {
        type: String,
        required: true,
    },
    imageName: {
        type: String,
        required: true,
    },
})

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;