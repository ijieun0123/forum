const router = require('express').Router();
const auth = require('../middleware/auth');
const checkSchema = require('../validation/checkSchema');
const validate = require('../validation/validate');
const {
    postComment,
    getComments,
    getMyComment,
    updateComment,
    updateCommentHeart,
    deleteComment
} = require('../controllers/comments');

router.post('/post', auth, validate(checkSchema('comment')), postComment);
router.get('/get/:id', auth, getComments);
router.get('/myComment/get', auth, getMyComment);
router.patch('/heart/update/:id', auth, updateCommentHeart);
router.patch('/update/:id', auth, validate(checkSchema('comment')), updateComment);
router.delete('/delete/:id', auth, deleteComment);

module.exports = router;