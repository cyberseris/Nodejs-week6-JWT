var express = require('express');
var router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const { getPostController, createPostController, deletePostController, deleteAllPostController, updatePostController } = require('../controllers/postsController');

router.get('/', handleErrorAsync(getPostController));
router.post('/', handleErrorAsync(createPostController));
router.delete('/:id', handleErrorAsync(deletePostController));
router.delete('/', handleErrorAsync(deleteAllPostController));
router.patch('/:id', handleErrorAsync(updatePostController));

module.exports = router;
