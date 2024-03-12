const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const multer = require('multer');
const upload = multer();

// Authentification //
router.post("/register", authController.signUp);//1
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);

// User data base
router.get('/', userController.getAllUsers);//2
router.get('/:id', userController.userInfo);//3
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.patch('/follow/:id', userController.follow);
router.patch('/unfollow/:id', userController.unfollow);

// Upload //
router.post('/upload', upload.single('file'), uploadController.uploadProfil);


module.exports = router;