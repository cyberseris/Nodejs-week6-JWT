var express = require('express');
var router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const { getPostController, createPostController, deletePostController, deleteAllPostController, updatePostController } = require('../controllers/postsController');
const { requireSignIn } = require('../middlewares/authMiddleware');

router.get('/', requireSignIn, handleErrorAsync(getPostController));
router.post('/', requireSignIn, handleErrorAsync(createPostController));
router.delete('/:id', requireSignIn, handleErrorAsync(deletePostController));
router.delete('/', requireSignIn, handleErrorAsync(deleteAllPostController));
router.patch('/:id', requireSignIn, handleErrorAsync(updatePostController));

module.exports = router;
