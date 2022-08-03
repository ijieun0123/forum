const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const CLOUDINARY_HOST = `${process.env.CLOUDINARY_HOST}`;
const CLOUDINARY_API_KEY = `${process.env.CLOUDINARY_API_KEY}`;
const CLOUDINARY_API_SECRET = `${process.env.CLOUDINARY_API_SECRET}`;

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
const profileImageUpload = upload.single('profileImagePath');
const imageUpload = upload.single('image');

module.exports = {
    attachImageUpload,
    imageUpload,
    profileImageUpload,
}

