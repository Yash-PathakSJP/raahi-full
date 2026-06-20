const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  logout,
  getMe,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  updatePassword,
  oauthLogin,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/forgot-password', authLimiter, forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.post('/oauth', oauthLogin);

router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

module.exports = router;
