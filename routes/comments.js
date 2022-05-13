const router = require('express').Router();
const controllers = require('../controllers/comments');

router.post('/post', controllers.postComment);
router.get('/get/:id', controllers.getComment);
router.get('/myComment/get', controllers.getMyComment);
router.patch('/heart/update/:id', controllers.updateCommentHeart);
router.patch('/update/:id', controllers.updateComment);
router.delete('/delete/:id', controllers.deleteComment);

module.exports = router;