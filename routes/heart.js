const router = require('express').Router();
const controllers = require('../controllers/heart');

router.post('/post', controllers.postHeart);
//router.get('/forum/get', controllers.getForumHearts);
//router.get('/forum/get/:id', controllers.getForumHeart);
//router.get('/comment/get/:id', controllers.getCommentHearts);
//router.patch('/update', controllers.updateHeart);
//router.delete('/forum/delete/:id', controllers.deleteForumHeart);
//router.delete('/comment/delete/:id', controllers.deleteCommentHeart);

module.exports = router;