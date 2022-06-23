const router = require('express').Router();
const upload = require('../middleware/cloudinary.config');
const auth = require('../middleware/auth');
const validate = require('../validation/validate');
const checkSchema = require('../validation/checkSchema');
const {
    postUser,
    getAccessToken,
    getTokens,
    getUser,
    deleteToken,
    updateUser,
    deleteUser
} = require('../controllers/users');

router.post('/signup', upload.single('profileImagePath'), validate(checkSchema('signup')), postUser);
router.post('/signin', validate(checkSchema('signin')), getTokens, getUser)
router.delete('/signout', auth, deleteToken)
router.post('/withdrawal', auth, validate(checkSchema('withdrawal')), deleteUser, deleteToken)
router.patch('/update/:id', auth, upload.single('profileImagePath'), validate(checkSchema('profile')), updateUser);
router.post('/get/accessToken', getAccessToken)

//router.get('/get', auth, getUser);
//router.post('/delete', auth, validate(checkSchema('withdrawal')), deleteUser);

module.exports = router;