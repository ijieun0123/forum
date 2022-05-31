const router = require('express').Router();
const controllers = require('../controllers/forums');

router.post('/post', controllers.postForum);

router.get('/get', controllers.getForums);
router.get('/search/get', controllers.getSearchForums);
router.get('/get/:id', controllers.getForum);

router.put('/update/:id', controllers.updateForum);
router.patch('/heart/update/:id', controllers.updateForumHeart);

router.delete('/delete/:id', controllers.deleteForum);
router.delete('/delete', controllers.deleteForums);

module.exports = router;