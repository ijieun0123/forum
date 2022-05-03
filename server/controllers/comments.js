let Comment = require('../models/comment.model');

module.exports.getComments = (req, res) => {
    const id = req.params.id;

    Comment.find({forumId: id})
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.postComment = (req, res) => {
    const body = req.body;
    const newComment = new Comment(body);

    newComment.save()
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateComment = (req, res) => {
    const body = req.body;
    const id = req.params.id;
    
    Comment.findByIdAndUpdate(id, body)
    .then(() => res.json(`Comment updated`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteComment = (req, res) => {
    const id = req.params.id;

    Comment.findByIdAndDelete(id)
    .then(() => res.json(`Comment deleted`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteForumComments = (req, res) => {
    const forumId = req.params.id;

    Comment.deleteMany({forumId: forumId})
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err));
}