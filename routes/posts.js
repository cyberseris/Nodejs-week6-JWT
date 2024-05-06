var express = require('express');
var router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const { getPostController, createPostController, deletePostController, deleteAllPostController, updatePostController } = require('../controllers/postsController');
const { requireSignIn } = require('../middlewares/authMiddleware');

router.post('/', requireSignIn, handleErrorAsync(createPostController));
router.get('/', requireSignIn, handleErrorAsync(getPostController));
router.patch('/:id', requireSignIn, handleErrorAsync(updatePostController));
router.delete('/:id', requireSignIn, handleErrorAsync(deletePostController));
router.delete('/', requireSignIn, handleErrorAsync(deleteAllPostController));

module.exports = router;
