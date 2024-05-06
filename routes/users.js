var express = require('express');
var router = express.Router();
const handleErrorAsync = require('../service/handleErrorAsync');
const { getUserController, registerController, loginController, updatePasswordController, updateUserController } = require('../controllers/usersController');
const { requireSignIn } = require('../middlewares/authMiddleware');

router.post('/sign_up', handleErrorAsync(registerController));
router.post('/sign_in', handleErrorAsync(loginController));
router.patch('/updatePassword', requireSignIn, handleErrorAsync(updatePasswordController));
router.get('/profile', requireSignIn, handleErrorAsync(getUserController));
router.put('/profile', requireSignIn, handleErrorAsync(updateUserController));

module.exports = router;
