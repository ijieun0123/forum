const router = require('express').Router();
const controllers = require('../controllers/comments');

router.get('/get/:id', controllers.getComments);
router.post('/post', controllers.postComment);
router.patch('/update/:id', controllers.updateComment);
router.delete('/delete/:id', controllers.deleteComment);
router.delete('/forum/delete/:id', controllers.deleteForumComments);

module.exports = router;