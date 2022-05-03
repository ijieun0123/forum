let User = require('../models/user.model');

module.exports.signin = (req, res) => {
    const body = req.query;

    User.find(body)
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.signup = (req, res) => {
    const profileImage = req.body.profileImage;
    const userName = req.body.userName;
    const userId = req.body.userId;
    const nickname = req.body.nickname;
    const password = req.body.password;
    const newUser = new User({
        profileImage,
        userName,
        userId,
        nickname,
        password,
    });

    newUser.save()
    .then(() => res.json(`Sign up success`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.updateUser = (req, res) => {
    const body = req.body;
    const id = req.params.id;

    User.findByIdAndUpdate(id, body)
    .then(() => res.json(`User updated`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteUser = (req, res) => {
    const id = req.params.id;

    User.findByIdAndDelete(id)
    .then(() => res.json(`User deleted`))
    .catch(err => res.status(400).json('Error: ' + err));
}