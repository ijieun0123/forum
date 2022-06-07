let User = require('../models/user.model');
const cloudinary = require('cloudinary').v2;
const defaultProfileImage = "/img/profile_default.png";

module.exports.postUser = (req, res) => {
    const userName = req.body.userName;
    const nickname = req.body.nickname;
    const email = req.body.email;
    const password = req.body.password;
    const profileImagePath = (req.file ? req.file.path : defaultProfileImage);
    const profileImageName = (req.file ? req.file.filename : defaultProfileImage);
    const data = { userName, nickname, email, password, profileImagePath, profileImageName };

    const newUser = new User(data);
    newUser.save()
    .then(() => res.json(`Sign up success`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getUser = (req, res) => {
    const body = req.body;

    User.find( {$and: [ body, { "active": "true" }]})
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateUser = async (req, res) => {
    const id = req.params.id;
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

module.exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndUpdate(id, {active: false})
    .then(() => res.json(`User deleted`))
    .catch(err => res.status(400).json('Error: ' + err));
}
