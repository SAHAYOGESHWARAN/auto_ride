const express = require('express');
const { requestTrip, acceptTrip, getPreviousTrips, checkFareDetails } = require('../controllers/tripController');
const { authenticate } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/request', authenticate, requestTrip);
router.post('/accept/:tripId', authenticate, acceptTrip);
router.get('/previous', authenticate, getPreviousTrips);
router.get('/fare', authenticate, checkFareDetails);

module.exports = router;