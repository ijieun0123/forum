const router = require('express').Router();
const auth = require('../middleware/auth');
const checkSchema = require('../validation/checkSchema');
const validate = require('../validation/validate');
const {
    postComment,
    getComments,
    updateComment,
    deleteComment
} = require('../controllers/comments');
const {
    deleteHearts
} = require('../controllers/hearts');

router.post('/post', auth, validate(checkSchema('comment')), postComment);
router.get('/get/:id', auth, getComments);
router.patch('/update/:id', auth, validate(checkSchema('comment')), updateComment);
router.delete('/delete/:id', auth, deleteComment, deleteHearts);

module.exports = router;