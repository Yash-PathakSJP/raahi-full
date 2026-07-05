const Trip = require('../models/Trip');
const Match = require('../models/Match');

// Sample destination pool for the welcome trip
const WELCOME_DESTINATIONS = [
  {
    title: 'Spiti Valley Trek',
    destination: 'Spiti Valley',
    state: 'Himachal Pradesh',
    tripType: 'Adventure',
    description:
      'Explore the remote valleys of Spiti — ancient monasteries, dramatic landscapes, and starlit skies. Edit this trip to match your actual plans!',
    budgetMin: 8000,
    budgetMax: 12000,
  },
  {
    title: 'Goa Beach Escape',
    destination: 'Goa',
    state: 'Goa',
    tripType: 'Relaxation',
    description:
      'Sun, sand, and sea — plan your perfect Goa getaway. Edit this trip to match your actual plans!',
    budgetMin: 10000,
    budgetMax: 18000,
  },
  {
    title: 'Rishikesh Adventure',
    destination: 'Rishikesh',
    state: 'Uttarakhand',
    tripType: 'Adventure',
    description:
      'White-water rafting, bungee jumping, and yoga by the Ganges. Edit this trip to match your actual plans!',
    budgetMin: 5000,
    budgetMax: 9000,
  },
];

/**
 * Creates a welcome trip for a brand new user on their first login.
 * Picks a random destination from the pool so different users get variety.
 * Called silently after login — errors are swallowed so they never
 * surface as a login failure.
 */
const createWelcomeTripIfNew = async (userId) => {
  try {
    const tripCount = await Trip.countDocuments({ 'members.user': userId });
    if (tripCount > 0) return; // Not a new user

    const dest =
      WELCOME_DESTINATIONS[Math.floor(Math.random() * WELCOME_DESTINATIONS.length)];

    const startDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    const endDate = new Date(Date.now() + 37 * 24 * 60 * 60 * 1000); // 7-day trip

    await Trip.create({
      creator: userId,
      title: dest.title,
      destination: dest.destination,
      state: dest.state,
      startDate,
      endDate,
      budgetMin: dest.budgetMin,
      budgetMax: dest.budgetMax,
      tripType: dest.tripType,
      description: dest.description,
      status: 'Upcoming',
      members: [{ user: userId, role: 'organizer' }],
    });
  } catch (err) {
    // Silently swallow — a welcome trip failing should never break login
    console.error('[Welcome trip] Failed to create:', err.message);
  }
};

module.exports = { createWelcomeTripIfNew };
