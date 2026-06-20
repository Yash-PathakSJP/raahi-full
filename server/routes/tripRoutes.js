const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  addItineraryDay,
  addExpense,
  addNote,
  joinTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getTrips).post(createTrip);
router.route('/:id').get(getTrip).put(updateTrip).delete(deleteTrip);
router.post('/:id/itinerary', addItineraryDay);
router.post('/:id/expenses', addExpense);
router.post('/:id/notes', addNote);
router.post('/:id/join', joinTrip);

module.exports = router;
