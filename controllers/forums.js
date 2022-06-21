let Comment = require('../models/comment.model');
let Forum = require('../models/forum.model');
const cloudinary = require('cloudinary').v2;

module.exports.postForum = async (req, res) => {
    const _user = req.user.id;
    const titleText = req.body.titleText;
    const mainText = req.body.mainText;
    const attachImagePath = (req.file ? req.file.path : '');
    const attachImageName = (req.file ? req.file.filename : '');
    const data = { _user, titleText, mainText, attachImagePath, attachImageName };

    try{
        const newForum = new Forum(data);
        newForum.save()
        res.status(200).json('Forum saved');
    } catch (err) {
        res.status(500).json('server error');
    }
}

module.exports.getForums = async (req, res) => {
    try{
        const forum = await Forum.find().sort({$natural:-1})
        .populate('_user', 'profileImagePath nickname -_id')
        res.status(200).json(forum);
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: err });
    }
}

module.exports.getSearchForums = async (req, res) => {
    const searchValue = req.query.searchValue;

    try{
        const forum = await Forum
        .find({ titleText: { $regex: searchValue, $options: 'i' } }) // 부분검색 허용, 대소문자구분x
        .sort({$natural:-1})
        .populate('_user', 'profileImagePath nickname -_id')
        res.status(200).json(forum);
    } catch (err){
        console.error(err);
        res.status(400).json({ msg: err });
    }
}

module.exports.getForum = async (req, res) => {
    const id = req.params.id;

    Forum.findById(id)
    .populate('_user', 'profileImagePath nickname -_id')
    .populate({
        path: '_comment',
        populate: {path: '_user', select: 'nickname profileImagePath -_id'}
    })
    .then(forum => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateViewCount = async (req, res) => {
    const id = req.params.id;

    Forum.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, {new: true})
    .then(() => res.json('ViewCount updated'))
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

    const data = { 
        titleText, 
        mainText, 
        attachImagePath,
        attachImageName
    };

    // Cloudinary oldAttachImage 삭제 ( 이미지 변경했을 때 || 이미지 삭제했을 때 )
    if(oldAttachImageName && req.file || oldAttachImageName && !oldAttachImagePath) { 
        cloudinary.uploader.destroy(
            oldAttachImageName, 
            (err, res) => { console.log(res, err) }
        )
    }

    Forum.findByIdAndUpdate(id, data)
    .then(() => res.json('forum updated'))
    .catch(err => res.status(400).json(err.message))
}

module.exports.updateForumHeart = (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
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

    try{
        const forum = await Forum.findByIdAndDelete(id)
        if(Array.isArray(forum)) forum.save()
        res.status(200).send('Forum deleted');

        const comment = await Comment.deleteMany({_forum:id})
        if(Array.isArray(comment._forum)) comment.save()

        if(attachImageName) {
            cloudinary.uploader.destroy(
                attachImageName, 
                (err, res) => { console.log(res, err) }
            )
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ msg: err });
    }
}

module.exports.deleteForums = async (req, res) => {
    Forum.deleteMany({})
    .then(() => res.json(`Forums deleted`))
    .catch(err => res.status(400).json('Error: ' + err));

    const comment = await Comment.deleteMany({})
    if(Array.isArray(comment._forum)) comment.save()
}

