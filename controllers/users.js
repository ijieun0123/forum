let User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;

const defaultProfileImage = "/img/profile_default.png";

module.exports.postUser = async (req, res) => {
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

module.exports.getToken = async (req, res) => {
    const { email } = req.body;

    try{
        const user = await User.findOne({$and: [ { "email": email }, { "active": "true" } ]} );

        const payload = {
            user: {
                id: user._id
            }
        }

        // return jwt
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '30m' },   // 만료기간 테스트
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

module.exports.getUser = async (req, res) => {
    const id = req.user.id;

    try {
        const user = await User.findById(id)
        .select('-password')
        .select('-createdAt')
        .select('-updatedAt')
        .select('-__v')
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.updateUser = async (req, res) => {
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

module.exports.deleteUser = async (req, res) => {
    const id = req.user.id;

    User.findByIdAndUpdate(id, {active: false})
    .then(() => res.json('탈퇴되었습니다.'))
    .catch(err => res.status(400).json(err));
}
