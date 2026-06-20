const asyncHandler = require('express-async-handler');
const Trip = require('../models/Trip');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all trips for logged-in user (optionally filtered by status)
// @route   GET /api/trips
// @access  Private
exports.getTrips = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { 'members.user': req.user.id };
  if (status && status !== 'All') {
    query.status = status;
  }

  const trips = await Trip.find(query)
    .populate('members.user', 'fullName avatar')
    .sort({ startDate: 1 });

  res.status(200).json({ success: true, count: trips.length, trips });
});

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
exports.getTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id)
    .populate('members.user', 'fullName avatar')
    .populate('notes.author', 'fullName avatar')
    .populate('expenses.paidBy', 'fullName avatar');

  if (!trip) {
    return next(new ErrorResponse('Trip not found', 404));
  }

  res.status(200).json({ success: true, trip });
});

// @desc    Create a new trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = asyncHandler(async (req, res, next) => {
  const {
    title,
    destination,
    state,
    coverImage,
    startDate,
    endDate,
    budgetMin,
    budgetMax,
    tripType,
    description,
  } = req.body;

  if (!destination || !startDate || !endDate) {
    return next(new ErrorResponse('Destination, start date and end date are required', 400));
  }

  const trip = await Trip.create({
    creator: req.user.id,
    title: title || `Trip to ${destination}`,
    destination,
    state,
    coverImage,
    startDate,
    endDate,
    budgetMin,
    budgetMax,
    tripType,
    description,
    members: [{ user: req.user.id, role: 'organizer' }],
  });

  res.status(201).json({ success: true, message: 'Trip created', trip });
});

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = asyncHandler(async (req, res, next) => {
  let trip = await Trip.findById(req.params.id);
  if (!trip) {
    return next(new ErrorResponse('Trip not found', 404));
  }

  const isOrganizer = trip.members.some(
    (m) => m.user.toString() === req.user.id && m.role === 'organizer'
  );
  if (!isOrganizer && trip.creator.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this trip', 403));
  }

  trip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, message: 'Trip updated', trip });
});

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    return next(new ErrorResponse('Trip not found', 404));
  }

  if (trip.creator.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this trip', 403));
  }

  await trip.deleteOne();
  res.status(200).json({ success: true, message: 'Trip deleted' });
});

// @desc    Add/update itinerary day
// @route   POST /api/trips/:id/itinerary
// @access  Private
exports.addItineraryDay = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new ErrorResponse('Trip not found', 404));

  trip.itinerary.push(req.body);
  await trip.save();

  res.status(201).json({ success: true, message: 'Itinerary updated', trip });
});

// @desc    Add expense
// @route   POST /api/trips/:id/expenses
// @access  Private
exports.addExpense = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new ErrorResponse('Trip not found', 404));

  trip.expenses.push({ ...req.body, paidBy: req.body.paidBy || req.user.id });
  await trip.save();

  res.status(201).json({ success: true, message: 'Expense added', trip });
});

// @desc    Add note
// @route   POST /api/trips/:id/notes
// @access  Private
exports.addNote = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new ErrorResponse('Trip not found', 404));

  trip.notes.push({ author: req.user.id, content: req.body.content });
  await trip.save();

  res.status(201).json({ success: true, message: 'Note added', trip });
});

// @desc    Join a trip
// @route   POST /api/trips/:id/join
// @access  Private
exports.joinTrip = asyncHandler(async (req, res, next) => {
  const trip = await Trip.findById(req.params.id);
  if (!trip) return next(new ErrorResponse('Trip not found', 404));

  const alreadyMember = trip.members.some((m) => m.user.toString() === req.user.id);
  if (alreadyMember) {
    return next(new ErrorResponse('You are already a member of this trip', 400));
  }

  trip.members.push({ user: req.user.id, role: 'member' });
  await trip.save();

  res.status(200).json({ success: true, message: 'Joined trip', trip });
});
