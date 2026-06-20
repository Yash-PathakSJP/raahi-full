const express = require('express');
const router = express.Router();
const {
  getConversations,
  getOrCreateConversation,
  getMessages,
  markAsRead,
} = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/conversations/:userId', getOrCreateConversation);
router.get('/conversations/:id/messages', getMessages);
router.put('/conversations/:id/read', markAsRead);

module.exports = router;
