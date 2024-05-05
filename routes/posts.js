var express = require('express');
var router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const postsController = require('../controllers/postsController');

/* router.get('/', handleErrorAsync(postsController.getPostController));
router.post('/', handleErrorAsync(postsController.createPostController)); */

router.get('/', handleErrorAsync(postsController.getPostController));
router.post('/', handleErrorAsync(postsController.createPostController));
router.delete('/:id', handleErrorAsync(postsController.getPostController));
router.delete('/', handleErrorAsync(postsController.getPostController));
router.delete('/patch', handleErrorAsync(postsController.getPostController));

module.exports = router;
