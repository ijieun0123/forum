const router = require('express').Router();
const auth = require('../middleware/auth');
const {
    updateHeart
} = require('../controllers/hearts');

router.post('/update', auth, updateHeart);

module.exports = router;