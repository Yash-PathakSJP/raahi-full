const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    initiator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    compatibilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    matchReasons: [
      {
        title: String,
        description: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'matched', 'rejected'],
      default: 'pending',
    },
    recommendedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
  },
  {
    timestamps: true,
  }
);

// A pair of users should only have one match document
MatchSchema.index({ users: 1 }, { unique: false });

module.exports = mongoose.model('Match', MatchSchema);
