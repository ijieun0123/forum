const router = require('express').Router();
const controllers = require('../controllers/users');
const upload = require('../middleware/cloudinary.config');
const auth = require('../middleware/auth');
const validate = require('../validation/validate');
const checkSchema = require('../validation/checkSchema');

router.post('/post', upload.single('profileImagePath'), validate(checkSchema('signup')), controllers.postUser);
router.post('/get/tokens', validate(checkSchema('signin')), controllers.getTokens)
router.post('/get/accessToken', controllers.getAccessToken)
router.delete('/delete/refreshToken', auth, controllers.deleteToken)
router.get('/get', auth, controllers.getUser);
router.patch('/update/:id', auth, upload.single('profileImagePath'), validate(checkSchema('profile')), controllers.updateUser);
router.post('/delete', auth, validate(checkSchema('withdrawal')), controllers.deleteUser);

module.exports = router;