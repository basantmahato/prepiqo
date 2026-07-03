import express from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin, updatePassword, updateProfile, verifyEmailChange, verifyRegistration, resendVerificationOtp } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-registration', verifyRegistration);
router.post('/resend-verification', resendVerificationOtp);

router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.put('/updatepassword', protect, updatePassword);
router.put('/profile', protect, updateProfile);
router.put('/verify-email', protect, verifyEmailChange);

export default router;
