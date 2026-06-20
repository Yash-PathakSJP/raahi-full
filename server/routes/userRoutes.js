const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateProfile,
  getDashboardStats,
  discoverTravelers,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/discover', discoverTravelers);
router.get('/me/dashboard', getDashboardStats);
router.put('/me', updateProfile);
router.delete('/me', deleteAccount);
router.get('/:id', getUserProfile);

module.exports = router;
