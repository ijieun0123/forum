let Heart = require('../models/heart.model');

module.exports.postHeart = (req, res) => {
    const body = req.body;
    const newHeart = new Heart(body);

    newHeart.save()
    .then(() => res.json('Post Heart success'))
    .catch(err => res.status(400).json('Error: ' + err));
}

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