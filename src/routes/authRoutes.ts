import express from 'express';
import { authController } from '../controllers/authController';
import passport from '../config/passport';
import { authMiddleware } from '../middleware/authMiddleware'; // 添加这行

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authMiddleware, authController.logout);

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);

router.get('/facebook', authController.facebookAuth);
router.get('/facebook/callback', authController.facebookAuthCallback);

router.get('/twitter', authController.twitterAuth);
router.get('/twitter/callback', authController.twitterAuthCallback);

router.post('/register-and-login', authController.registerAndLogin);

export default router;
