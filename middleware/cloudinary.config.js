const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const {
    CLOUDINARY_HOST,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_HOST,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'image',
        format: async () => { 'png', 'jpg', 'jpeg' },
        public_id: (req, file) => file.filename,
    },
});

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
});

const attachImageUpload = upload.single('attachImagePath');
const testImageUpload = upload.fields([{ name: 'titleText', maxCount: 1 }, { name: 'mainText', maxCount: 1 }, { name: 'attachImagePath', maxCount: 1 }]);
const profileImageUpload = upload.single('profileImagePath');

module.exports = {
    attachImageUpload,
    //testImageUpload,
    profileImageUpload,
}