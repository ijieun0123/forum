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

module.exports.updateComment = async (req, res) => {
    const id = req.params.id;
    const commentText = req.body.commentText;
    const _forum = req.body._forum;

    const comment = await Comment.findByIdAndUpdate(id, { $set:{ commentText: commentText } })
    if(Array.isArray(comment)) comment.save()
    
    Comment.find({_forum: _forum})
    .populate('_user', 'profileImage nickname')
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateCommentHeart = async (req, res) => {
    const commentId = req.params.id;
    const userId = req.body.userId;
    const heartClickUsers = req.body.heartClickUsers;
    const forumId = req.body.forumId;

    const comment = await Comment.findByIdAndUpdate(commentId,
        (
            heartClickUsers.includes(userId)
            ? { $pull: {'heart.user':userId}, $inc: { 'heart.count': -1 } }
            : { $push: {'heart.user':userId}, $inc: { 'heart.count': +1 } }
        ),
        {new: true}
    )
    if(Array.isArray(comment)) comment.save()

    Comment.find({_forum: forumId})
    .populate('_user', 'profileImage nickname')
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteComment = async (req, res) => {
    const _comment = req.params.id;
    const _forum = req.query._forum

    const comment = await Comment.findByIdAndDelete(_comment)
    if(Array.isArray(comment)) comment.save()
    
    const forum = await Forum.findById(_forum)
    if(Array.isArray(forum._comment)) forum._comment.pull(_comment);
    forum.save()
    
    Comment.find({_forum: _forum})
    .populate('_user', 'profileImage nickname')
    .then(comments => res.json(comments))
    .catch(err => res.status(400).json('Error: ' + err));
}
