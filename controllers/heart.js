let Comment = require('../models/comment.model');
let User = require('../models/user.model');
let Forum = require('../models/forum.model');
let Heart = require('../models/heart.model');

module.exports.postHeart = async (req, res) => {
    const body = req.body;
    const newHeart = new Heart(body);

    newHeart.save()
    .then(() => res.json('Post Heart success'))
    .catch(err => res.status(400).json('Error: ' + err));

    const forum = await Forum.findById(body._forum)
    if(Array.isArray(forum._heart)) forum._heart.push(newHeart);
    forum.save()

    const comment = await Comment.findById(body._comment)
    if(Array.isArray(comment._heart)) comment._heart.push(newHeart);
    comment.save()

    const user = await User.findById(body._user)
    if(Array.isArray(user._heart)) user._heart.push(newHeart);
    user.save()
}
/*
module.exports.getForumHearts = (req, res) => {
    Heart.find({commentId:{ $exists: false }})
    .then(heart => res.json(heart))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getForumHeart = (req, res) => {
    const forumId = req.params.id;

    Heart.find({commentId:{ $exists: false }}).findOne({forumId:forumId})
    .then(heart => res.json(heart))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getCommentHearts = (req, res) => {
    const forumId = req.params.id;

    Heart.find({commentId:{ $exists: true }}).find({forumId:forumId})
    .then(heart => res.json(heart))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateHeart = (req, res) => {
    const forumId = req.body.forumId;
    const commentId = req.body.commentId;
    const nickname = req.body.nickname;
    const heartClickUsers = req.body.heartClickUsers;

    Heart.findOneAndUpdate(( commentId ? {commentId: commentId} : {forumId: forumId} ), (
        heartClickUsers.includes(nickname) 
        ? { $pull: { heartClickUsers: nickname }, $inc: { heartCount: -1 } } 
        : { $push: { heartClickUsers: nickname }, $inc: { heartCount: 1 } }
    ))
    .then(heart => res.json(heart))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteForumHeart = (req, res) => {
    const forumId = req.params.id;

    Heart.deleteMany({forumId: forumId})
    .then(heart => res.json(heart))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteCommentHeart = (req, res) => {
    const commentId = req.params.id;

    Heart.deleteMany({commentId: commentId})
    .then(heart => res.json(heart))
    .catch(err => res.status(400).json('Error: ' + err));
}
*/