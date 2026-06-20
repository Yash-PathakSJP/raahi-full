const asyncHandler = require('express-async-handler');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// RFC-5322-lite email check — good enough to catch typos without
// rejecting valid addresses that stricter regexes choke on.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Subscribe an email to the newsletter (landing page form)
// @route   POST /api/subscribe
// @access  Public
exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ ok: false, message: 'Please enter your email address.' });
  }

  const trimmed = email.trim();

  if (!EMAIL_RE.test(trimmed)) {
    return res
      .status(400)
      .json({ ok: false, message: 'That email address doesn\u2019t look right. Please check it and try again.' });
  }

  if (trimmed.length > 254) {
    return res.status(400).json({ ok: false, message: 'That email address is too long.' });
  }

  const existing = await NewsletterSubscriber.findOne({ email: trimmed.toLowerCase() });

  if (existing) {
    return res
      .status(200)
      .json({ ok: true, message: 'You\u2019re already on the list \u2014 we\u2019ll be in touch soon!' });
  }

  await NewsletterSubscriber.create({ email: trimmed });

  return res
    .status(201)
    .json({ ok: true, message: 'You\u2019re subscribed! Watch your inbox for travel tips.' });
});

// Static showcase content for the public landing page. This is intentionally
// simple, hand-curated marketing content (not user data), so it doesn't need
// its own collection — update these arrays directly when the showcase changes.
const PUBLIC_TRIPS = [
  {
    id: 'spiti-valley-expedition',
    title: 'Spiti Valley Expedition',
    dates: 'May 20 \u2013 May 28, 2026',
    location: 'Himachal Pradesh',
    rating: 4.8,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
  },
  {
    id: 'goa-beach-party',
    title: 'Goa Beach Party',
    dates: 'Jun 10 \u2013 Jun 15, 2026',
    location: 'Goa',
    rating: 4.7,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
  },
  {
    id: 'rishikesh-adventure',
    title: 'Rishikesh Adventure',
    dates: 'May 15 \u2013 May 18, 2026',
    location: 'Uttarakhand',
    rating: 4.9,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1593766787879-e8c3837a4b3e?w=800&h=600&fit=crop',
  },
];

const PUBLIC_TESTIMONIALS = [
  {
    id: 1,
    quote: 'I found my best travel buddy on Raahi and we had an amazing time in Himalayas!',
    name: 'Ananya Verma',
    location: 'Dehradun, India',
    rating: 5,
  },
  {
    id: 2,
    quote: 'Raahi made solo travel so easy. Met awesome people!',
    name: 'Rahul Malhotra',
    location: 'Mumbai, India',
    rating: 5,
  },
  {
    id: 3,
    quote: 'The AI match is actually accurate. Great platform!',
    name: 'Mehak Singh',
    location: 'Chandigarh, India',
    rating: 5,
  },
];

// @desc    Public showcase trips for the landing page
// @route   GET /api/public/trips
// @access  Public
exports.getPublicTrips = asyncHandler(async (req, res) => {
  res.json({ ok: true, trips: PUBLIC_TRIPS });
});

// @desc    Single public showcase trip
// @route   GET /api/public/trips/:id
// @access  Public
exports.getPublicTrip = asyncHandler(async (req, res) => {
  const trip = PUBLIC_TRIPS.find((t) => t.id === req.params.id);
  if (!trip) {
    return res.status(404).json({ ok: false, message: 'Trip not found.' });
  }
  res.json({ ok: true, trip });
});

// @desc    Public testimonials for the landing page
// @route   GET /api/public/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res) => {
  res.json({ ok: true, testimonials: PUBLIC_TESTIMONIALS });
});
