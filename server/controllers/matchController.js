const asyncHandler = require('express-async-handler');
const Match = require('../models/Match');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// Simple, explainable compatibility scoring based on shared interests,
// travel style, and group preference. This stands in for a more advanced
// ML-based recommender and keeps the "why you match" reasons human-readable.
const computeCompatibility = (userA, userB) => {
  let score = 50; // base score
  const reasons = [];

  const sharedInterests = (userA.interests || []).filter((i) =>
    (userB.interests || []).some((j) => j.toLowerCase() === i.toLowerCase())
  );
  if (sharedInterests.length > 0) {
    score += Math.min(sharedInterests.length * 8, 24);
    reasons.push({
      title: 'Shared Interests',
      description: `You both enjoy ${sharedInterests.slice(0, 3).join(', ')}.`,
    });
  }

  if (userA.travelStyle && userA.travelStyle === userB.travelStyle) {
    score += 10;
    reasons.push({
      title: 'Similar Budget Range',
      description: `You both prefer ${userA.travelStyle.toLowerCase()} experiences.`,
    });
  }

  if (
    userA.location?.country &&
    userB.location?.country &&
    userA.location.country === userB.location.country
  ) {
    score += 6;
    reasons.push({
      title: 'Same Home Country',
      description: `You're both based in ${userA.location.country}.`,
    });
  }

  const sharedLanguages = (userA.languages || []).filter((l) =>
    (userB.languages || []).some((m) => m.toLowerCase() === l.toLowerCase())
  );
  if (sharedLanguages.length > 0) {
    score += 5;
    reasons.push({
      title: 'Common Language',
      description: `You can both communicate in ${sharedLanguages[0]}.`,
    });
  }

  score = Math.min(Math.max(score, 0), 99);

  if (reasons.length === 0) {
    reasons.push({
      title: 'New Connection',
      description: 'You haven\u2019t crossed paths yet \u2014 start a conversation to find common ground!',
    });
  }

  return { score, reasons };
};

// @desc    Get AI compatibility score with another user
// @route   GET /api/matches/compatibility/:userId
// @access  Private
exports.getCompatibility = asyncHandler(async (req, res, next) => {
  const [me, other] = await Promise.all([
    User.findById(req.user.id),
    User.findById(req.params.userId),
  ]);

  if (!other) {
    return next(new ErrorResponse('User not found', 404));
  }

  const { score, reasons } = computeCompatibility(me, other);

  res.status(200).json({
    success: true,
    compatibilityScore: score,
    reasons,
    user: other.toSafeObject(),
  });
});

// @desc    Like / send a match request to another user
// @route   POST /api/matches/:userId
// @access  Private
exports.createMatch = asyncHandler(async (req, res, next) => {
  const otherUserId = req.params.userId;

  if (otherUserId === req.user.id) {
    return next(new ErrorResponse('You cannot match with yourself', 400));
  }

  const other = await User.findById(otherUserId);
  if (!other) {
    return next(new ErrorResponse('User not found', 404));
  }

  let match = await Match.findOne({
    users: { $all: [req.user.id, otherUserId], $size: 2 },
  });

  if (match) {
    if (match.status === 'pending' && match.initiator.toString() !== req.user.id) {
      match.status = 'matched';
      await match.save();
      return res.status(200).json({ success: true, message: "It's a match!", match });
    }
    return res.status(200).json({ success: true, message: 'Match already exists', match });
  }

  const me = await User.findById(req.user.id);
  const { score, reasons } = computeCompatibility(me, other);

  match = await Match.create({
    users: [req.user.id, otherUserId],
    initiator: req.user.id,
    compatibilityScore: score,
    matchReasons: reasons,
    status: 'pending',
  });

  res.status(201).json({ success: true, message: 'Match request sent', match });
});

// @desc    Get all matched/pending connections for logged-in user
// @route   GET /api/matches
// @access  Private
exports.getMatches = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { users: req.user.id };
  if (status) query.status = status;

  const matches = await Match.find(query)
    .populate('users', 'fullName avatar travelerType location')
    .populate('recommendedTrip', 'title destination coverImage')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: matches.length, matches });
});
