const router = require('express').Router();
const controllers = require('../controllers/users');

router.post('/post', controllers.postUser);
router.post('/get', controllers.getUser);
router.patch('/update/:id', controllers.updateUser);
router.post('/delete/:id', controllers.deleteUser);

module.exports = router;