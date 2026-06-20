const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Match = require('../models/Match');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get a user's public profile + stats
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  const tripsCount = await Trip.countDocuments({ 'members.user': user._id });
  const matchesCount = await Match.countDocuments({
    users: user._id,
    status: 'matched',
  });

  res.status(200).json({
    success: true,
    user: user.toSafeObject(),
    stats: {
      trips: tripsCount,
      matches: matchesCount,
    },
  });
});

// @desc    Update logged-in user's profile
// @route   PUT /api/users/me
// @access  Private
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = [
    'fullName',
    'phone',
    'avatar',
    'coverPhoto',
    'bio',
    'location',
    'dateOfBirth',
    'gender',
    'travelerType',
    'interests',
    'travelStyle',
    'groupPreference',
    'languages',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Profile updated', user: user.toSafeObject() });
});

// @desc    Get dashboard summary stats for logged-in user
// @route   GET /api/users/me/dashboard
// @access  Private
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const [tripsCount, matchesCount, countriesAgg, upcomingTrip, recommendedTrips] =
    await Promise.all([
      Trip.countDocuments({ 'members.user': userId }),
      Match.countDocuments({ users: userId, status: 'matched' }),
      Trip.distinct('state', { 'members.user': userId }),
      Trip.findOne({ 'members.user': userId, status: 'Upcoming' }).sort({ startDate: 1 }),
      Trip.find().sort({ createdAt: -1 }).limit(4),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      tripsPlanned: tripsCount,
      matchesFound: matchesCount,
      countriesVisited: countriesAgg.filter(Boolean).length,
      groupsJoined: await Trip.countDocuments({ 'members.user': userId, 'members.role': 'member' }),
    },
    upcomingTrip,
    recommendedTrips,
  });
});

// @desc    Discover travelers (with simple filtering)
// @route   GET /api/users/discover
// @access  Private
exports.discoverTravelers = asyncHandler(async (req, res) => {
  const { search, interest, page = 1, limit = 6 } = req.query;

  const query = { _id: { $ne: req.user.id }, isActive: true };

  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { 'location.city': { $regex: search, $options: 'i' } },
      { interests: { $regex: search, $options: 'i' } },
    ];
  }

  if (interest && interest !== 'All') {
    query.interests = { $regex: interest, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [travelers, total] = await Promise.all([
    User.find(query).select('-password').skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: travelers.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    travelers,
  });
});

// @desc    Deactivate / delete account
// @route   DELETE /api/users/me
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });
  res.status(200).json({ success: true, message: 'Account deactivated' });
});
