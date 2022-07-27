const router = require('express').Router();
//const singleUpload = require('../middleware/cloudinary.config');
const auth = require('../middleware/auth');
const checkSchema = require('../validation/checkSchema');
const validate = require('../validation/validate');
const {
    postForum,
    getForums,
    getForum,
    updateViewCount,
    updateForum,
    updateForumHeart,
    deleteForum,
    deleteForums,
    getNewForums,
    getImageUrl,
    deleteImage,
    deleteImages
} = require('../controllers/forums');
const {
    deleteComments
} = require('../controllers/comments');
const {
    deleteHearts
} = require('../controllers/hearts');
const {
    imageUpload,
    attachImageUpload
} = require('../middleware/cloudinary.config');

router.post('/get/image/url', imageUpload, getImageUrl);
router.delete('/delete/image', deleteImage);
router.delete('/delete/images', deleteImages);

router.post('/get', getForums, getNewForums);
router.post('/post', auth, validate(checkSchema('forum')), postForum);
router.get('/view/get/:id', auth, updateViewCount, getForum);
router.get('/write/get/:id', auth, getForum);
router.put('/update/:id', validate(checkSchema('forum')), updateForum);
router.delete('/delete/:id', auth, deleteForum, deleteHearts, deleteComments);
router.delete('/delete', deleteForums);

module.exports = router;