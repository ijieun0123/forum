const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    _user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 30 * 86400
    }
}, {
    timestamps: true,
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
