const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a trip title'],
      trim: true,
      maxlength: 100,
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      trim: true,
    },
    state: {
      type: String,
      trim: true,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    budgetMin: {
      type: Number,
      default: 0,
    },
    budgetMax: {
      type: Number,
      default: 0,
    },
    tripType: {
      type: String,
      enum: ['Adventure', 'Relaxation', 'Cultural', 'Road Trip', 'Backpacking', 'Other'],
      default: 'Adventure',
    },
    description: {
      type: String,
      maxlength: 2000,
      default: '',
    },
    status: {
      type: String,
      enum: ['Planned', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Upcoming',
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['organizer', 'member'], default: 'member' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    itinerary: [
      {
        day: { type: Number, required: true },
        date: { type: Date },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        locations: [
          {
            name: String,
            lat: Number,
            lng: Number,
          },
        ],
      },
    ],
    expenses: [
      {
        title: String,
        amount: Number,
        paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        date: { type: Date, default: Date.now },
      },
    ],
    notes: [
      {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        content: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

TripSchema.index({ destination: 'text', title: 'text' });

module.exports = mongoose.model('Trip', TripSchema);
