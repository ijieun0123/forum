let Image = require('../models/image.model');
const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const postImage = async (req, res, next) => {
    const imagePath = ( req.file ? req.file.path : '' );
    const imageName = (req.file ? req.file.filename : '');
    const _forum = ( req.body._forum ? req.body._forum : null )
    const _user = ( req.body._forum ? null : req.user.id )
    const data = { imagePath, imageName, _forum, _user }

    const newImage = new Image(data);
    newImage.save()
    .then(() => res.status(200).json('Image saved'), next())
    .catch((err) => res.status(500).json('Server error'));
}

const deleteImage = async (req, res) => {
    const imageName = req.query.imageName;
    const _forum = ( req.params.id ? req.params.id : null )
    const _user = ( req.params.id ? null : req.user.id )

    cloudinary.uploader.destroy(
        imageName, 
        (err, res) => { console.log(res, err) }
    )
    
    Image.findOneAndDelete({ $or: [ { _forum: _forum }, { _user: _user } ] })
    .then(() => res.status(200).json('Image deleted'))
    .catch((err) => res.status(500).json('Server error'));
}

module.exports = {
    postImage,
    deleteImage
}
