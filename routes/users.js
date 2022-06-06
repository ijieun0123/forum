const router = require('express').Router();
const controllers = require('../controllers/users');
const upload = require('../middleware/cloudinary.config');

router.post('/post', upload.single('profileImagePath'), controllers.postUser);
router.post('/get', controllers.getUser);
router.patch('/update/:id', upload.single('profileImagePath'), controllers.updateUser);
router.post('/delete/:id', controllers.deleteUser);

module.exports = router;