let Comment = require('../models/comment.model');
let User = require('../models/user.model');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const io = require('../utils/socket');

const postComment = async (req, res) => {
    const _user = req.user.id;
    const _forum = req.body._forum;
    const commentText = req.body.commentText;
    const data = { _user, _forum, commentText };
    const newComment = new Comment(data);

    try{
        const comment = await newComment.save();
        const user = await User.findById(_user);

        /* Sends message to all connected comment */
        io.getIO().emit("comment", {
            action: "add",
            /*
            commentData: {
                commentId: comment._id,
                commentText: comment.commentText,
                createdAt: comment.createdAt,
                heartCount: 0,
                heartFill: false,
                nickname: user.nickname,
                profileImagePath: user.profileImagePath
            },
            */
            comment: { ...comment._doc }
        })
        
        res.status(200).json({
            commentId: comment._id,
            commentText: comment.commentText,
            createdAt: comment.createdAt,
            heartCount: 0,
            heartFill: false,
            nickname: user.nickname,
            profileImagePath: user.profileImagePath
        })
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const getComments = async (req, res) => {
    const _user = req.user.id
    const _forum = ( req._forum ? req._forum : req.params.id );

    const userObjectId = ObjectId(_user)
    const forumObjectId = ObjectId(_forum)

    try{
        const comments = await Comment
        .aggregate([
            { 
                $match : { _forum: forumObjectId } 
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
                    foreignField: "_comment",
                    as: "_heart",
                },
            },
            { 
                $group: {
                    _id: "$_id",
                    commentId: { $first: "$_id" },
                    heartClickUsers: { $first: "$_heart._user" },
                    profileImagePath: { $first: "$_user.profileImagePath" },
                    nickname: { $first: "$_user.nickname" },
                    commentText: { $first: "$commentText" },
                    createdAt: { $first: "$createdAt" },
                }
            },
            { 
                $sort : { createdAt : 1 } 
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
                    _forum:0,
                    updatedAt:0,
                    __v: 0,
                    heartClickUsers:0
                } 
            }
        ])
        res.status(200).json(comments)
    } catch (err) {
        res.status(400).json('Error: ' + err)
    }
}

const updateComment = async (req, res) => {
    const id = req.params.id;
    const commentText = req.body.commentText;

    Comment.findByIdAndUpdate(id, { $set:{ commentText: commentText } }, {new: true})
    .then((comment) => res.json({ 
        commentText: comment.commentText 
    }))
    .catch((err) => res.status(400).json('Error: ' + err))
}

const deleteComment = async (req, res, next) => {
    const _comment = req.params.id;
    const _forum = req.query._forum;

    req._comment = _comment;
    req._forum = _forum;

    try{
        const comment = await Comment.findByIdAndDelete(_comment)
        if(Array.isArray(comment)) await comment.save()

        /* Sends message to all connected comment */
        io.getIO().emit("comment", {
            action: "delete",
            commentId: _comment,
        })
        
        next();
    } catch (err) {
        console.log(err)
    }
}

const deleteComments = (req, res) => {
    const _forum = req._forum

    Comment.deleteMany({_forum:_forum})
    .then(() => 
        res.json('Forum, Comments, hearts deleted')
    )
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports = {
    postComment,
    getComments,
    updateComment,
    deleteComment,
    deleteComments
}