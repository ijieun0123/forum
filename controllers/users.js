let User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const generateTokens = require('../utils/generateTokens');
const verifyRefreshToken = require('../utils/verifyRefreshToken');
const Token = require('../models/token.model');

const defaultProfileImage = "/img/profile_default.png";

const postUser = async (req, res) => {
    const userName = req.body.userName;
    const nickname = req.body.nickname;
    const email = req.body.email;
    const password = req.body.password;
    const profileImagePath = (req.file ? req.file.path : defaultProfileImage);
    const profileImageName = (req.file ? req.file.filename : defaultProfileImage);
    const data = { userName, nickname, email, password, profileImagePath, profileImageName };

    try {
        // creates a new user ( hash user password )
        const newUser = new User(data);
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();
        res.status(200).send('User saved');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

const getAccessToken = async (req, res) => {
    const refreshTokenId = req.body.refreshTokenId;
    const token = await Token.findOne({ _id: refreshTokenId })
    const refreshToken = token.token;

    verifyRefreshToken(refreshToken)
    .then(({ tokenDetails }) => {
        console.log(tokenDetails)
        const payload = {
            user: {
                id: tokenDetails.user.id
            }
        }
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: '30m' }
        )
        res.status(200).json({
            error: false,
            accessToken,
            msg: 'Access token created successfully'
        })
    })
    .catch(err => res.status(400).json(err));
}

const getTokens = async (req, res, next) => {
    try{
        const { email } = req.body;
        const user = await User.findOne({$and: [ { "email": email }, { "active": "true" } ]} );
        const { accessToken, refreshToken } = await generateTokens(user);
        const refreshTokenId = await Token.findOne({ token: refreshToken }).select('_id')
        
        req.refreshTokenId = refreshTokenId;
        req.accessToken = accessToken;
        req.user = user;
        
        next()
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: true,
            msg: 'Server Error tokens'
        })
    }
}

const getUser = async (req, res) => {
    const refreshTokenId = req.refreshTokenId._id;
    const accessToken = req.accessToken;
    const userId = req.user._id;
    
    try {
        const user = await User.findById(userId)
        .select('-password')
        .select('-createdAt')
        .select('-updatedAt')
        .select('-__v')
        res.status(200).json({ 
            user, 
            refreshTokenId, 
            accessToken 
        });
    } catch (error) {
        res.status(500).json({
            error: true,
            msg: 'Server Error user'
        })
    }
}

const deleteUser = async (req, res, next) => {
    const id = req.user.id;

    try{
        await User.findByIdAndUpdate(id, {active: false})
        next();
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: true,
            msg: 'Server Error'
        })
    }
}

const deleteToken = async (req, res) => {  // signout, withdrawal
    const id = req.user.id;

    try{
        const token = await Token.findOne({ _user: id })
        if (!token) return res.status(200).json({
            error: false,
            msg: 'token deleted'
        })
        await token.remove();
        res.status(200).json({
            error: false,
            msg: 'token deleted'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: true,
            msg: 'Server Error'
        })
    }
}

const updateUser = async (req, res) => {
    const id = req.user.id;
    const userName = req.body.userName;
    const nickname = req.body.nickname;
    const email = req.body.email;
    const oldProfileImagePath = req.body.profileImagePath;
    const oldProfileImageName = req.body.profileImageName;
    let profileImagePath = defaultProfileImage;
    let profileImageName = defaultProfileImage;
    
    if(req.file){ // 이미지 변경했을 때
        profileImagePath = req.file.path
        profileImageName = req.file.filename
    } else if(oldProfileImageName && !oldProfileImagePath){ // 이미지 삭제 했을 떄
        profileImagePath = defaultProfileImage
        profileImageName = defaultProfileImage
    } else if(oldProfileImageName && oldProfileImagePath){ // 이미지 변경 안했을 때
        profileImagePath = oldProfileImagePath
        profileImageName = oldProfileImageName
    }

    // 이미지 변경했을 때 || 이미지 삭제했을 때 => Cloudinary oldAttachImage 삭제
    if(oldProfileImageName && req.file || oldProfileImageName && !oldProfileImagePath) { 
        cloudinary.uploader.destroy(
            oldProfileImageName, 
            (err, res) => { console.log(res, err) }
        )
    }

    const data = { 
        userName, 
        nickname, 
        email, 
        profileImagePath, 
        profileImageName 
    };

    User.findByIdAndUpdate(id, data, {new: true})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports = {
    postUser,
    getAccessToken,
    getTokens,
    getUser,
    deleteToken,
    updateUser,
    deleteUser
}