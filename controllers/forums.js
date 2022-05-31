let Comment = require('../models/comment.model');
let User = require('../models/user.model');
let Forum = require('../models/forum.model');

module.exports.postForum = async (req, res) => {
    const body = req.body;
    const newForum = new Forum(body);
    newForum.save()
    .then(forum => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getForums = (req, res) => {
    Forum.find().sort({$natural:-1})
    .populate('_user', 'profileImage nickname')
    .populate({
        path: '_comment',
        select: '_user',
    })
    .then(forums => res.json(forums))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getSearchForums = (req, res) => {
    const searchValue = req.query.searchValue

    Forum.find({ $text: { $search: searchValue } })
    .populate('_user', 'profileImage nickname')
    .then(forums => res.json(forums))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getForum = async (req, res) => {
    const id = req.params.id;

    const forum = await Forum.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
    if(Array.isArray(forum)) forum.save()

    Forum.findById(id)
    .populate('_user', 'profileImage nickname')
    .populate({
        path: '_comment',
        populate: {path: '_user', select: 'nickname profileImage'}
    })
    .then(forum => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateForum = (req, res) => {
    const body = req.body;
    const id = req.params.id;
    
    Forum.findByIdAndUpdate(id, body)
    .then(() => res.json(`Forum updated`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateForumHeart = (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const heartClickUsers = req.body.heartClickUsers;

    Forum.findByIdAndUpdate(id,
        (
            heartClickUsers.includes(userId)
            ? { $pull: {'heart.user':userId}, $inc: { 'heart.count': -1 } }
            : { $push: {'heart.user':userId}, $inc: { 'heart.count': +1 } }
        ),
        {new: true}
    )
    .then((forum) => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err))
}

module.exports.deleteForum = async (req, res) => {
    const id = req.params.id;

    Forum.findByIdAndDelete(id)
    .then(() => res.json(`Forum deleted`))
    .catch(err => res.status(400).json('Error: ' + err));

    const comment = await Comment.deleteMany({_forum:id})
    if(Array.isArray(comment._forum)) comment.save()
}

module.exports.deleteForums = async (req, res) => {
    Forum.deleteMany({})
    .then(() => res.json(`Forums deleted`))
    .catch(err => res.status(400).json('Error: ' + err));

    const comment = await Comment.deleteMany({})
    if(Array.isArray(comment._forum)) comment.save()
}

