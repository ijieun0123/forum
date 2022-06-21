const router = require('express').Router();
const controllers = require('../controllers/forums');
const upload = require('../middleware/cloudinary.config');
const auth = require('../middleware/auth');
const checkSchema = require('../validation/checkSchema');
const validate = require('../validation/validate');

router.post('/post', auth, upload.single('attachImagePath'), validate(checkSchema('forum')), controllers.postForum);
router.get('/get', controllers.getForums);
router.get('/search/get', controllers.getSearchForums);
router.get('/get/:id', auth, controllers.getForum)
router.patch('/viewCount/update/:id', controllers.updateViewCount)
router.put('/update/:id', upload.single('attachImagePath'), validate(checkSchema('forum')), controllers.updateForum);
router.patch('/heart/update/:id', auth, controllers.updateForumHeart);
router.delete('/delete/:id', auth, controllers.deleteForum);
router.delete('/delete', controllers.deleteForums);

module.exports = router;