const router = require('express').Router();
const controllers = require('../controllers/users');
const upload = require('../middleware/cloudinary.config');
const auth = require('../middleware/auth');
const validate = require('../validation/validate');
const checkSchema = require('../validation/checkSchema');

router.post('/post', upload.single('profileImagePath'), validate(checkSchema('signup')), controllers.postUser);
router.post('/get/token', validate(checkSchema('signin')), controllers.getToken)
router.get('/get', auth, controllers.getUser);
router.patch('/update/:id', auth, upload.single('profileImagePath'), validate(checkSchema('profile')), controllers.updateUser);
router.post('/delete', auth, validate(checkSchema('withdrawal')), controllers.deleteUser);

module.exports = router;