const express = require('express');
const router = express.Router();
const { getCompatibility, createMatch, getMatches } = require('../controllers/matchController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMatches);
router.get('/compatibility/:userId', getCompatibility);
router.post('/:userId', createMatch);

module.exports = router;
