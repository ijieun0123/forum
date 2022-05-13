const { default: mongoose } = require('mongoose');

const Schema = mongoose.Schema;

const forumSchema = new Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    _comment: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Comment'
    }],
    heart: {
        count: {
            type: Number,
            default:0
        },
        user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
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

forumSchema.index({ titleText: 'text' });

const Forum = mongoose.model('Forum', forumSchema);

Forum.createIndexes();

module.exports = Forum;