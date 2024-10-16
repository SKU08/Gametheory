const express = require('express');
const Booking = require('../models/Booking');
const Center = require('../models/Center');
const Sport = require('../models/Sport');
const Court = require('../models/Court');
const { verifyToken, isManager } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper function to convert DD-MM-YYYY to a valid Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);  // Convert to YYYY-MM-DD format
};

// const { verifyToken, isManager } = require('../middleware/authMiddleware');
// const router = express.Router();

// Manager view all bookings for a specific sport
// Manager view all bookings for a specific sport
router.get('/bookings/sport/:sport_id', verifyToken, isManager, async (req, res) => {
  let { sport_id } = req.params;

  try {
    // Trim the sport_id to remove any trailing spaces or newline characters
    sport_id = sport_id.trim();

    // Ensure sport_id is a valid ObjectId
    if (!sport_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid sport ID format' });
    }

    // Find all courts associated with the given sport
    const courts = await Court.find({ sport_id });

    if (courts.length === 0) {
      return res.status(404).json({ message: 'No courts found for this sport' });
    }

    // Get the court IDs to use in the Booking query
    const courtIds = courts.map(court => court._id);

    // Find all bookings for the courts
    const bookings = await Booking.find({ court_id: { $in: courtIds } });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this sport' });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ error: 'Error retrieving bookings', details: error.message });
  }
});



// Create a new center (only managers can do this)
router.post('/center', verifyToken, isManager, async (req, res) => {
  const { name, location } = req.body;

  const center = new Center({ name, location });
  try {
    await center.save();
    res.status(201).json({ message: 'Center created successfully', center });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create center' });
  }
});

// Create a new sport for a center (only managers can do this)
router.post('/sport', verifyToken, isManager, async (req, res) => {
  const { name, center_id } = req.body;

  const sport = new Sport({ name, center_id });
  try {
    await sport.save();
    res.status(201).json({ message: 'Sport created successfully', sport });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sport' });
  }
});

// Create a new court for a sport (only managers can do this)
router.post('/court', verifyToken, isManager, async (req, res) => {
  const { name, sport_id, slots } = req.body;

  const court = new Court({ name, sport_id, slots });
  try {
    await court.save();
    res.status(201).json({ message: 'Court created successfully', court });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create court' });
  }
});

// Add or update slots for a specific court (only managers can do this)
router.put('/court/:courtId/slots', verifyToken, isManager, async (req, res) => {
  const { slots } = req.body;  // Expecting an array of slots
  const courtId = req.params.courtId;

  try {
    const court = await Court.findById(courtId);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    // Update the court's slots
    court.slots = slots;  // Replace existing slots with new ones
    await court.save();

    res.status(200).json({ message: 'Slots updated successfully', court });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update slots' });
  }
});

module.exports = router;
