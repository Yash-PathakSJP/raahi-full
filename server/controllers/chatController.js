const asyncHandler = require('express-async-handler');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all conversations for logged-in user
// @route   GET /api/chat/conversations
// @access  Private
exports.getConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ participants: req.user.id })
    .populate('participants', 'fullName avatar lastActive')
    .populate({
      path: 'lastMessage',
      select: 'content sender createdAt readBy',
    })
    .sort({ lastMessageAt: -1 });

  res.status(200).json({ success: true, count: conversations.length, conversations });
});

// @desc    Get or create a 1:1 conversation with another user
// @route   POST /api/chat/conversations/:userId
// @access  Private
exports.getOrCreateConversation = asyncHandler(async (req, res, next) => {
  const otherUserId = req.params.userId;

  if (otherUserId === req.user.id) {
    return next(new ErrorResponse('Cannot start a conversation with yourself', 400));
  }

  let conversation = await Conversation.findOne({
    isGroup: false,
    participants: { $all: [req.user.id, otherUserId], $size: 2 },
  }).populate('participants', 'fullName avatar lastActive');

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [req.user.id, otherUserId],
      isGroup: false,
    });
    conversation = await conversation.populate('participants', 'fullName avatar lastActive');
  }

  res.status(200).json({ success: true, conversation });
});

// @desc    Get messages for a conversation (paginated)
// @route   GET /api/chat/conversations/:id/messages
// @access  Private
exports.getMessages = asyncHandler(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    return next(new ErrorResponse('Conversation not found', 404));
  }
  if (!conversation.participants.some((p) => p.toString() === req.user.id)) {
    return next(new ErrorResponse('Not authorized to view this conversation', 403));
  }

  const { page = 1, limit = 30 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const messages = await Message.find({ conversation: req.params.id })
    .populate('sender', 'fullName avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({ success: true, messages: messages.reverse() });
});

// @desc    Mark conversation messages as read
// @route   PUT /api/chat/conversations/:id/read
// @access  Private
exports.markAsRead = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { conversation: req.params.id, readBy: { $ne: req.user.id } },
    { $addToSet: { readBy: req.user.id } }
  );
  res.status(200).json({ success: true, message: 'Marked as read' });
});
