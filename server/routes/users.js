const router = require('express').Router();
const controllers = require('../controllers/users');

router.get('/signin', controllers.signin);
router.post('/signup', controllers.signup);
router.put('/update/:id', controllers.updateUser);
router.delete('/delete/:id', controllers.deleteUser);

module.exports = router;