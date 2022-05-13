let Comment = require('../models/comment.model');
let User = require('../models/user.model');
let Forum = require('../models/forum.model');

module.exports.postComment = async (req, res) => {
    const body = req.body;
    const newComment = new Comment(body);
    newComment.save()
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err));

    const forum = await Forum.findById(body._forum)
    if(Array.isArray(forum._comment)) forum._comment.push(newComment);
    forum.save()
    /*
    const user = await User.findById(body._user)
    if(Array.isArray(user._comment)) user._comment.push(newComment);
    user.save()
    */
}

module.exports.getComment = (req, res) => {
    const _forum = req.params.id;

    Comment.find({_forum: _forum})
    .populate('_user', 'profileImage nickname')
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getMyComment = (req, res) => {
    const _user = req.body._user;

    Comment.find({_user: _user})
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateCommentHeart = (req, res) => {
    const commentId = req.params.id;
    const userId = req.body.userId;
    const heartClickUsers = req.body.heartClickUsers;

    Comment.findByIdAndUpdate(commentId,
        (
            heartClickUsers.includes(userId)
            ? { $pull: {'heart.user':userId}, $inc: { 'heart.count': -1 } }
            : { $push: {'heart.user':userId}, $inc: { 'heart.count': +1 } }
        )
    )
    .then((comment) => res.json(comment))
    .catch(err => res.status(400).json('Error: ' + err))
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
