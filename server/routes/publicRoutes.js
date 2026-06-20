const express = require('express');
const router = express.Router();
const {
  subscribe,
  getPublicTrips,
  getPublicTrip,
  getTestimonials,
} = require('../controllers/publicController');

// These power the marketing landing page and intentionally require no auth.
router.post('/subscribe', subscribe);
router.get('/public/trips', getPublicTrips);
router.get('/public/trips/:id', getPublicTrip);
router.get('/public/testimonials', getTestimonials);

module.exports = router;
