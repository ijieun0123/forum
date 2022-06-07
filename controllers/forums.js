let Comment = require('../models/comment.model');
let Forum = require('../models/forum.model');
const cloudinary = require('cloudinary').v2;

module.exports.postForum = (req, res) => {
    const _user = req.body._user;
    const titleText = req.body.titleText;
    const mainText = req.body.mainText;
    const attachImagePath = (req.file ? req.file.path : '');
    const attachImageName = (req.file ? req.file.filename : '');
    const data = { _user, titleText, mainText, attachImagePath, attachImageName };

    const newForum = new Forum(data);
    newForum.save()
    .then(forum => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getForums = (req, res) => {
    Forum.find().sort({$natural:-1})
    .populate('_user', 'profileImagePath nickname')
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
    .populate('_user', 'profileImagePath nickname')
    .then(forums => res.json(forums))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getForum = async (req, res) => {
    const id = req.params.id;

    const forum = await Forum.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
    if(Array.isArray(forum)) forum.save()

    Forum.findById(id)
    .populate('_user', 'profileImagePath nickname')
    .populate({
        path: '_comment',
        populate: {path: '_user', select: 'nickname profileImagePath'}
    })
    .then(forum => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateForum = async (req, res) => {
    const id = req.params.id;
    const titleText = req.body.titleText;
    const mainText = req.body.mainText;
    const oldAttachImagePath = req.body.attachImagePath;
    const oldAttachImageName = req.body.attachImageName;
    const attachImagePath = (req.file ? req.file.path : oldAttachImagePath);
    let attachImageName = ''

    if(req.file){ // 이미지 변경했을 때
        attachImageName = req.file.filename
    } else if(oldAttachImageName && !oldAttachImagePath){ // 이미지 삭제했을 때
        attachImageName = ''
    } else{ // 이미지 변경 안했을 때
        attachImageName = oldAttachImageName
    }

    // 이미지 변경했을 때 || 이미지 삭제했을 때 => Cloudinary oldAttachImage 삭제
    if(oldAttachImageName && req.file || oldAttachImageName && !oldAttachImagePath) { 
        cloudinary.uploader.destroy(
            oldAttachImageName, 
            (err, res) => { console.log(res, err) }
        )
    }

    const data = { 
        titleText, 
        mainText, 
        attachImagePath,
        attachImageName
    };
    
    Forum.findByIdAndUpdate(id, data)
    .then(() => 
        res.json(`Forum updated`)  
    )
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
    const attachImageName = req.query.attachImageName

    if(attachImageName) {
        cloudinary.uploader.destroy(
            attachImageName, 
            (err, res) => { console.log(res, err) }
        )
    }

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

