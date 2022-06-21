const router = require('express').Router();
const controllers = require('../controllers/comments');
const auth = require('../middleware/auth');
const checkSchema = require('../validation/checkSchema');
const validate = require('../validation/validate');

router.post('/post', auth, validate(checkSchema('comment')), controllers.postComment);
router.get('/get/:id', auth, controllers.getComments);
router.get('/myComment/get', auth, controllers.getMyComment);
router.patch('/heart/update/:id', auth, controllers.updateCommentHeart);
router.patch('/update/:id', auth, validate(checkSchema('comment')), controllers.updateComment);
router.delete('/delete/:id', auth, controllers.deleteComment);

module.exports = router;