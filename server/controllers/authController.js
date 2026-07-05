const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendTokenResponse = require('../utils/sendTokenResponse');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || !email || !password) {
    return next(new ErrorResponse('Please provide name, email and password', 400));
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse('An account with that email already exists', 400));
  }

  const user = await User.create({ fullName, email, password });

  // Generate OTP for email verification
  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #7C3AED;">Welcome to RAAHI, ${user.fullName.split(' ')[0]}!</h2>
      <p>Use the code below to verify your account. This code expires in 10 minutes.</p>
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; background: #F3F0FF; padding: 16px 24px; border-radius: 8px; text-align: center; color: #4C1D95;">${otp}</div>
      <p style="margin-top: 24px; color: #666;">If you didn't create this account, you can safely ignore this email.</p>
    </div>
  `;

  try {
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your_smtp_user') {
      await sendEmail({ to: user.email, subject: 'Verify your RAAHI account', html });
    } else {
      console.log(`[DEV] OTP for ${user.email}: ${otp}`);
    }
  } catch (err) {
    console.error('Email send failed, continuing (dev mode):', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Account created. Please verify your email with the OTP we sent.',
    email: user.email,
    // Included only in development so the flow is testable without SMTP configured
    devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
  });
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorResponse('Please provide email and OTP', 400));
  }

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await User.findOne({
    email,
    otp: hashedOtp,
    otpExpire: { $gt: Date.now() },
  }).select('+otp +otpExpire');

  if (!user) {
    return next(new ErrorResponse('Invalid or expired OTP', 400));
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, 'Account verified successfully');
});

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOtp = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('No account found with that email', 404));
  }

  const otp = user.generateOTP();
  await user.save({ validateBeforeSave: false });

  const html = `<p>Your new RAAHI verification code is:</p><h2>${otp}</h2>`;

  try {
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your_smtp_user') {
      await sendEmail({ to: user.email, subject: 'Your new RAAHI verification code', html });
    } else {
      console.log(`[DEV] Resent OTP for ${user.email}: ${otp}`);
    }
  } catch (err) {
    console.error('Email send failed:', err.message);
  }

  res.status(200).json({
    success: true,
    message: 'A new OTP has been sent to your email',
    devOtp: process.env.NODE_ENV === 'development' ? otp : undefined,
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse('Please provide an email/phone and password', 400));
  }

  const user = await User.findOne({
    $or: [{ email }, { phone: email }],
  }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  // Silently create a welcome trip for brand new users
const { createWelcomeTripIfNew } = require('../utils/welcomeTrip');
await createWelcomeTripIfNew(user._id);

  sendTokenResponse(user, 200, res, 'Logged in successfully');
});

// @desc    Log user out / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get currently logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user: user.toSafeObject() });
});

// @desc    Forgot password - send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('There is no account with that email', 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #7C3AED;">Reset your RAAHI password</h2>
      <p>Click the button below to reset your password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block; background:#7C3AED; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; margin-top:12px;">Reset Password</a>
      <p style="margin-top: 24px; color: #666; font-size: 13px;">If the button doesn't work, copy this link: ${resetUrl}</p>
    </div>
  `;

  try {
    if (process.env.SMTP_USER && process.env.SMTP_USER !== 'your_smtp_user') {
      await sendEmail({ to: user.email, subject: 'RAAHI password reset', html });
    } else {
      console.log(`[DEV] Password reset URL for ${user.email}: ${resetUrl}`);
    }

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
      devResetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
    });
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid or expired reset token', 400));
  }

  const { password, confirmPassword } = req.body;

  if (!password || password.length < 8) {
    return next(new ErrorResponse('Password must be at least 8 characters', 400));
  }
  if (confirmPassword !== undefined && password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match', 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    Update password while logged in
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const { currentPassword, newPassword } = req.body;

  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  if (!newPassword || newPassword.length < 8) {
    return next(new ErrorResponse('New password must be at least 8 characters', 400));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

// @desc    OAuth login/signup (Google / Facebook / Apple)
// @route   POST /api/auth/oauth
// @access  Public
// Note: This is a structured stub. In production, verify the provider token
// server-side (e.g. google-auth-library / passport strategies) before trusting
// the profile data sent from the client.
exports.oauthLogin = asyncHandler(async (req, res, next) => {
  const { provider, email, fullName, avatar, providerId } = req.body;

  if (!provider || !email) {
    return next(new ErrorResponse('Missing OAuth provider details', 400));
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName: fullName || 'RAAHI Traveler',
      email,
      avatar: avatar || '',
      password: crypto.randomBytes(16).toString('hex'), // unusable random password
      authProvider: provider,
      isVerified: true,
    });
  }

  user.lastActive = Date.now();
  await user.save({ validateBeforeSave: false });

  sendTokenResponse(user, 200, res, `Logged in with ${provider}`);
});
