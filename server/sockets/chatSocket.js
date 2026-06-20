const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

// Tracks which socket id(s) belong to which user for presence + targeted emits
const onlineUsers = new Map(); // userId -> Set(socketId)

const addOnlineUser = (userId, socketId) => {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
};

const removeOnlineUser = (userId, socketId) => {
  if (onlineUsers.has(userId)) {
    onlineUsers.get(userId).delete(socketId);
    if (onlineUsers.get(userId).size === 0) onlineUsers.delete(userId);
  }
};

function initSocket(io) {
  // Authenticate socket connections using the same JWT as the REST API
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(' ')[1];

      if (!token) return next(new Error('Authentication required'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return next(new Error('User not found'));

      socket.userId = user._id.toString();
      socket.user = { id: user._id, fullName: user.fullName, avatar: user.avatar };
      next();
    } catch (err) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    const { userId } = socket;
    addOnlineUser(userId, socket.id);
    socket.join(`user:${userId}`);
    io.emit('presence:update', { userId, online: true });

    // Join a specific conversation room
    socket.on('conversation:join', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Send a message
    socket.on('message:send', async ({ conversationId, content }, callback) => {
      try {
        if (!content || !content.trim()) {
          if (callback) callback({ success: false, message: 'Message cannot be empty' });
          return;
        }

        const conversation = await Conversation.findById(conversationId);
        if (!conversation || !conversation.participants.some((p) => p.toString() === userId)) {
          if (callback) callback({ success: false, message: 'Not authorized' });
          return;
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: content.trim(),
          readBy: [userId],
        });

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          lastMessageAt: Date.now(),
        });

        const populated = await message.populate('sender', 'fullName avatar');

        io.to(`conversation:${conversationId}`).emit('message:new', populated);

        // Notify participants who may not have the conversation open
        conversation.participants.forEach((p) => {
          if (p.toString() !== userId) {
            io.to(`user:${p.toString()}`).emit('conversation:updated', {
              conversationId,
              lastMessage: populated,
            });
          }
        });

        if (callback) callback({ success: true, message: populated });
      } catch (err) {
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Typing indicators
    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:start', { userId, conversationId });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('typing:stop', { userId, conversationId });
    });

    socket.on('disconnect', () => {
      removeOnlineUser(userId, socket.id);
      if (!onlineUsers.has(userId)) {
        io.emit('presence:update', { userId, online: false });
      }
    });
  });
}

module.exports = { initSocket, onlineUsers };
