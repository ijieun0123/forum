let Comment = require('../models/comment.model');
let Forum = require('../models/forum.model');
let User = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const postForum = async (req, res) => {
    const _user = req.user.id;
    const titleText = req.body.titleText;
    const mainText = req.body.mainText;
    const attachImagePath = (req.file ? req.file.path : '');
    const attachImageName = (req.file ? req.file.filename : '');
    const data = { _user, titleText, mainText, attachImagePath, attachImageName };
    
    try{
        const newForum = new Forum(data);
        newForum.save()
        res.status(200).json('Forum saved')
    } catch (err) {
        res.status(500).json('server error');
    }

}

const getNewForums = async (req, res) => {
    const forums = req.forums;
    const selectValue = req.body.selectValue;
    const searchValue = req.body.searchValue;
    const user = req.user;

    if(searchValue) {
        const newForums = forums.filter(el => el.titleText.includes(searchValue))
        res.status(200).json(newForums);
    } else{
        if(selectValue === 'viewOrder'){
            const newForums = forums.sort((a, b) => b.viewCount - a.viewCount)
            res.status(200).json(newForums);
        } else if(selectValue === 'heartOrder'){
            const newForums = forums.sort((a, b) => b.heartCount - a.heartCount)
            res.status(200).json(newForums);
        } else if(selectValue === 'whatIWrote'){
            const newForums = forums.filter(el => el.nickname === user.nickname)
            res.status(200).json(newForums);
        } else if(selectValue === 'whatILike'){
            const newForums = forums.filter(el => el.heartFill === true)
            res.status(200).json(newForums);
        } else {
            res.status(200).json(forums);
        }
    } 
}

const getForums = async (req, res, next) => {
    const selectValue = req.body.selectValue;
    const searchValue = req.body.searchValue;
    const nickname = req.body.nickname
    const user = await User.findOne({nickname:nickname})
    let userObjectId = '';

    if(user){
        const userId = user._id;
        userObjectId = ObjectId(userId)
    } 

    try{
        const forums = await Forum
        .aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "_user",
                    foreignField: "_id",
                    as: "_user",
                },
            },
            {  $unwind: "$_user" },
            {
                $lookup: {
                    from: "hearts",
                    localField: "_id",
                    foreignField: "_forum",
                    as: "_heart",
                    pipeline: [{
                        $match: { "_comment" : null }
                    }]
                },
            },
            { 
                $group: {
                    _id: "$_id",
                    forumId: { $first: "$_id" },
                    heartClickUsers: { $first: "$_heart._user" },
                    profileImagePath: { $first: "$_user.profileImagePath" },
                    nickname: { $first: "$_user.nickname" },
                    attachImageName: { $first: "$attachImageName" },
                    titleText: { $first: "$titleText" },
                    viewCount: { $first: "$viewCount" },
                    createdAt: { $first: "$createdAt" },
                }
            },
            { 
                $addFields: {
                    heartFill: { 
                        $cond: {
                            if: { $in: [ userObjectId, "$heartClickUsers"  ] }, 
                            then: true,
                            else: false,
                        }
                    },
                    heartCount: { $size: '$heartClickUsers' }
                } 
            },
            { 
                $project: { 
                    _id:0,
                    updatedAt:0,
                    __v: 0,
                    heartClickUsers:0,
                } 
            },
            {
                $sort: { createdAt: -1 }
            }
        ])
        
        req.forums = forums;
        req.user = user;

        if(selectValue || searchValue) {
            next()
        } else{
            res.status(200).json(forums);
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: err });
    }
}

const updateViewCount = async (req, res, next) => {
    const id = req.params.id;

    Forum.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }, {new: true})
    .then(() => next())
    .catch(err => res.status(400).json('Error: ' + err));
}

const getForum = async (req, res) => {
    const _forum = ( req._forum  ? req._forum : req.params.id )
    const _user = req.user.id

    const userObjectId = ObjectId(_user)
    const forumObjectId = ObjectId(_forum)

    try{
        const forum = await Forum
        .aggregate([
            { 
                $match : { _id: forumObjectId } 
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_user",
                    foreignField: "_id",
                    as: "_user",
                },
            },
            {  $unwind: "$_user" },
            {
                $lookup: {
                    from: "hearts",
                    localField: "_id",
                    foreignField: "_forum",
                    as: "_heart",
                    pipeline: [{
                        $match: { "_comment" : null }
                    }]
                },
            },
            { 
                $group: {
                    _id: "$_id",
                    forumId: { $first: "$_id" },
                    heartClickUsers: { $first: "$_heart._user" },
                    profileImagePath: { $first: "$_user.profileImagePath" },
                    nickname: { $first: "$_user.nickname" },
                    attachImagePath: { $first: "$attachImagePath" },
                    attachImageName: { $first: "$attachImageName" },
                    titleText: { $first: "$titleText" },
                    mainText: { $first: "$mainText" },
                    viewCount: { $first: "$viewCount" },
                    createdAt: { $first: "$createdAt" },
                }
            },
            { 
                $addFields: {
                    heartFill: { 
                        $cond: {
                            if: { $in: [ userObjectId, "$heartClickUsers"  ] }, 
                            then: true,
                            else: false,
                        }
                    },
                    heartCount: { $size: '$heartClickUsers' }
                } 
            },
            { 
                $project: { 
                    _id:0,
                    updatedAt:0,
                    __v: 0,
                    heartClickUsers:0,
                } 
            }
        ])
        res.status(200).json(forum[0])
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updateForum = async (req, res) => {
    const id = req.params.id;
    const titleText = req.body.titleText;
    const mainText = req.body.mainText;
    const oldAttachImagePath = req.body.attachImagePath;
    const oldAttachImageName = req.body.attachImageName;
    const attachImagePath = ( req.file ? req.file.path : oldAttachImagePath );
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

const updateForumHeart = (req, res) => {
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

const deleteForum = async (req, res, next) => {
    const id = req.params.id;
    const attachImageName = req.query.attachImageName;

    req._forum = id;

    try{
        const forum = await Forum.findByIdAndDelete(id)
        if(Array.isArray(forum)) forum.save()

        if(attachImageName) {
            cloudinary.uploader.destroy(
                attachImageName, 
                (err, res) => { console.log(res, err) }
            )
        }

        next()
    } catch (err) {
        console.error(err);
        res.status(400).send({ msg: err });
    }
}

const deleteForums = async (req, res) => {
    Forum.deleteMany({})
    .then(() => res.json(`Forums deleted`))
    .catch(err => res.status(400).json('Error: ' + err));

    const comment = await Comment.deleteMany({})
    if(Array.isArray(comment._forum)) comment.save()
}

module.exports = {
    postForum,
    getForums,
    getForum,
    updateViewCount,
    updateForum,
    updateForumHeart,
    deleteForum,
    deleteForums,
    getNewForums
}

