const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/cloudinary.config');


const {
    postImage,
    deleteImage
} = require('../controllers/images');

router.post('/post', auth, postImage);
router.delete('/delete/:id', auth, deleteImage);

module.exports = router;