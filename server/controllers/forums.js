let Forum = require('../models/forum.model');

module.exports.getForums = (req, res) => {
    Forum.find()
    .then(forums => res.json(forums))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.getForum = (req, res) => {
    const id = req.params.id;

    Forum.findById(id)
    .then(forum => res.json(forum))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.postForum = (req, res) => {
    const profileImage = req.body.profileImage;
    const nickname = req.body.nickname;
    const attachImage = req.body.attachImage;
    const attachImageValue = req.body.attachImageValue;
    const titleText = req.body.titleText;
    const mainText = req.body.mainText;
    const newForum = new Forum({
        profileImage,
        nickname,
        attachImage,
        attachImageValue,
        titleText,
        mainText,
    });

    newForum.save()
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

module.exports.updateViewCount = (req, res) => {
    const id = req.params.id;

    Forum.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
    .then(() => res.json(`ViewCount updated`))
    .catch(err => res.status(400).json('Error: ' + err));
}

module.exports.deleteForum = (req, res) => {
    const id = req.params.id;

    Forum.findByIdAndDelete(id)
    .then(() => res.json(`Forum deleted`))
    .catch(err => res.status(400).json('Error: ' + err));
}