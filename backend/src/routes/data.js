import { Router } from 'express';
import { generateMCQs, getChatsHistory, generateNotes, generateQA, toggleShareChat, getSharedChat, generateChat } from '../controllers/mcq.controller.js';
import { protect, optionalProtect } from '../middleware/auth.middleware.js';
import { checkRequestLimit } from '../middleware/requestLimit.middleware.js';

const router = Router();

router.post('/generate', optionalProtect, checkRequestLimit, generateMCQs);
router.post('/generate-notes', optionalProtect, checkRequestLimit, generateNotes);
router.post('/generate-qa', optionalProtect, checkRequestLimit, generateQA);
router.post('/generate-chat', optionalProtect, checkRequestLimit, generateChat);
router.get('/chatshistory', protect, getChatsHistory);

router.post('/chatshistory/:id/share', protect, toggleShareChat);
router.get('/shared/:id', getSharedChat);

export default router;
