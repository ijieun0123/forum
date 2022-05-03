const router = require('express').Router();
const controllers = require('../controllers/forums');

router.get('/get', controllers.getForums);
router.get('/get/:id', controllers.getForum);
router.post('/post', controllers.postForum);
router.put('/update/:id', controllers.updateForum);
router.patch('/viewCount/update/:id', controllers.updateViewCount);
router.delete('/delete/:id', controllers.deleteForum);

module.exports = router;