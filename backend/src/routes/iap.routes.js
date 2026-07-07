import express from 'express';
import { verifyAppleReceipt, verifyGoogleReceipt } from '../controllers/iap.controller.js';
import { protect } from '../middleware/auth.middleware.js'; // Assuming auth middleware exists

const router = express.Router();

router.post('/verify-apple', protect, verifyAppleReceipt);
router.post('/verify-google', protect, verifyGoogleReceipt);

export default router;
