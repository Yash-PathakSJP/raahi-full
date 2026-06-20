// Seeds the database with sample users, trips, and matches so the dashboard
// looks populated immediately after setup. Run with: npm run seed
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Match = require('../models/Match');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

const run = async () => {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Trip.deleteMany({}),
    Match.deleteMany({}),
    Conversation.deleteMany({}),
    Message.deleteMany({}),
  ]);

  console.log('Creating users...');
  const usersData = [
    {
      fullName: 'Yash Pathak',
      email: 'hello.yash@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Adventure seeker | Trekking enthusiast | Love mountains, roads and capturing moments. Looking for amazing people to travel and create unforgettable memories together.',
      location: { city: 'Jaipur', country: 'India' },
      gender: 'Male',
      travelerType: 'Adventure Explorer',
      interests: ['Trekking', 'Camping', 'Photography', 'Road Trips', 'Mountains', 'Backpacking'],
      travelStyle: 'Budget Traveler',
      groupPreference: 'Small Group (3-6 people)',
      languages: ['English', 'Hindi'],
      dateOfBirth: new Date('2002-02-14'),
    },
    {
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Mountains call and I must go. Always planning the next trek.',
      location: { city: 'Bangalore', country: 'India' },
      gender: 'Male',
      travelerType: 'Adventure Explorer',
      interests: ['Trekking', 'Camping', 'Photography', 'Mountains'],
      travelStyle: 'Budget Traveler',
      languages: ['English', 'Hindi', 'Kannada'],
    },
    {
      fullName: 'Ananya Verma',
      email: 'ananya.verma@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Nature lover exploring one trail at a time.',
      location: { city: 'Delhi', country: 'India' },
      gender: 'Female',
      travelerType: 'Nature Lover',
      interests: ['Hiking', 'Mountains', 'Reading'],
      travelStyle: 'Mid-range Traveler',
      languages: ['English', 'Hindi'],
    },
    {
      fullName: 'Nikhil Patel',
      email: 'nikhil.patel@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Backpacker on a budget, chasing sunsets across India.',
      location: { city: 'Mumbai', country: 'India' },
      gender: 'Male',
      travelerType: 'Backpacker',
      interests: ['Backpacking', 'Budget Travel'],
      travelStyle: 'Budget Traveler',
      languages: ['English', 'Hindi', 'Gujarati'],
    },
    {
      fullName: 'Priya Iyer',
      email: 'priya.iyer@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Culture explorer, always seeking the next story.',
      location: { city: 'Chennai', country: 'India' },
      gender: 'Female',
      travelerType: 'Culture Explorer',
      interests: ['Culture', 'Food', 'Art'],
      travelStyle: 'Mid-range Traveler',
      languages: ['English', 'Tamil'],
    },
    {
      fullName: 'Arjun Mehta',
      email: 'arjun.mehta@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Road tripper. Give me a car, a playlist, and an open highway.',
      location: { city: 'Pune', country: 'India' },
      gender: 'Male',
      travelerType: 'Road Tripper',
      interests: ['Road Trips', 'Photography'],
      travelStyle: 'Budget Traveler',
      languages: ['English', 'Hindi', 'Marathi'],
    },
    {
      fullName: 'Sneha Kapoor',
      email: 'sneha.kapoor@mail.com',
      password: 'Password123',
      isVerified: true,
      bio: 'Solo traveler turned community builder.',
      location: { city: 'Hyderabad', country: 'India' },
      gender: 'Female',
      travelerType: 'Solo Traveler',
      interests: ['Solo Travel', 'Mountains', 'Photography'],
      travelStyle: 'Luxury Traveler',
      languages: ['English', 'Hindi', 'Telugu'],
    },
  ];

  const users = await User.create(usersData);
  const [yash, rahul, ananya, nikhil, priya, arjun, sneha] = users;

  console.log('Creating trips...');
  const trips = await Trip.create([
    {
      creator: yash._id,
      title: 'Spiti Valley Trek',
      destination: 'Spiti Valley',
      state: 'Himachal Pradesh',
      coverImage: '',
      startDate: new Date('2024-05-22'),
      endDate: new Date('2024-05-28'),
      budgetMin: 8000,
      budgetMax: 12000,
      tripType: 'Adventure',
      description: 'Planning a 5 day trip to Manali. Let\u2019s explore Solang Valley, Rohtang Pass and do some trekking.',
      status: 'Upcoming',
      members: [
        { user: yash._id, role: 'organizer' },
        { user: rahul._id, role: 'member' },
        { user: ananya._id, role: 'member' },
        { user: nikhil._id, role: 'member' },
      ],
      itinerary: [
        { day: 1, date: new Date('2024-05-22'), title: 'Delhi to Manali', description: 'Overnight journey from Delhi' },
        { day: 2, date: new Date('2024-05-23'), title: 'Manali Local Sightseeing', description: 'Hadimba Temple, Mall Road' },
        { day: 3, date: new Date('2024-05-24'), title: 'Manali to Kaza', description: 'Drive to Kaza via Atal Tunnel' },
        { day: 4, date: new Date('2024-05-25'), title: 'Kaza to Key Monastery', description: 'Explore Key Monastery & Kibber' },
        { day: 5, date: new Date('2024-05-26'), title: 'Chicham Bridge & Hikkim', description: 'Visit Chicham Bridge and Hikkim Post Office' },
        { day: 6, date: new Date('2024-05-27'), title: 'Kaza to Manali', description: 'Drive back to Manali' },
        { day: 7, date: new Date('2024-05-28'), title: 'Manali to Delhi', description: 'Return to Delhi' },
      ],
    },
    {
      creator: yash._id,
      title: 'Kasol Weekend Escape',
      destination: 'Kasol',
      state: 'Himachal Pradesh',
      startDate: new Date('2024-06-10'),
      endDate: new Date('2024-06-12'),
      budgetMin: 4000,
      budgetMax: 7000,
      tripType: 'Relaxation',
      status: 'Upcoming',
      members: [
        { user: yash._id, role: 'organizer' },
        { user: priya._id, role: 'member' },
        { user: arjun._id, role: 'member' },
      ],
    },
    {
      creator: yash._id,
      title: 'Goa Beach Party',
      destination: 'Goa',
      state: 'Goa',
      startDate: new Date('2024-07-05'),
      endDate: new Date('2024-07-10'),
      budgetMin: 10000,
      budgetMax: 15000,
      tripType: 'Relaxation',
      status: 'Planned',
      members: [
        { user: yash._id, role: 'organizer' },
        { user: sneha._id, role: 'member' },
        { user: nikhil._id, role: 'member' },
      ],
    },
    {
      creator: yash._id,
      title: 'Rishikesh Adventure',
      destination: 'Rishikesh',
      state: 'Uttarakhand',
      startDate: new Date('2024-03-15'),
      endDate: new Date('2024-03-18'),
      budgetMin: 5000,
      budgetMax: 8000,
      tripType: 'Adventure',
      status: 'Completed',
      members: [
        { user: yash._id, role: 'organizer' },
        { user: rahul._id, role: 'member' },
      ],
    },
  ]);

  console.log('Creating matches...');
  await Match.create([
    {
      users: [yash._id, rahul._id],
      initiator: yash._id,
      compatibilityScore: 92,
      matchReasons: [
        { title: 'Both love Adventure & Trekking', description: 'You both enjoy trekking and outdoor adventures.' },
        { title: 'Similar Budget Range', description: 'You both have similar budget preferences for travel.' },
        { title: 'Love for Mountains', description: 'You both prefer mountain destinations over beaches.' },
        { title: 'Similar Travel Style', description: 'You both enjoy small groups and immersive experiences.' },
      ],
      status: 'matched',
      recommendedTrip: trips[0]._id,
    },
    {
      users: [yash._id, ananya._id],
      initiator: ananya._id,
      compatibilityScore: 85,
      matchReasons: [
        { title: 'Shared Interests', description: 'You both enjoy mountains and photography.' },
      ],
      status: 'matched',
    },
    {
      users: [yash._id, nikhil._id],
      initiator: yash._id,
      compatibilityScore: 78,
      matchReasons: [
        { title: 'Budget Alignment', description: 'You both prefer budget-friendly travel.' },
      ],
      status: 'matched',
    },
  ]);

  console.log('Creating conversations & messages...');
  const conv1 = await Conversation.create({ participants: [yash._id, rahul._id] });
  const messages = await Message.create([
    { conversation: conv1._id, sender: rahul._id, content: 'Hey Yash! Are we still on for Spiti Valley Trek?', readBy: [rahul._id, yash._id] },
    { conversation: conv1._id, sender: yash._id, content: 'Yes bro! Can\u2019t wait for this adventure', readBy: [yash._id, rahul._id] },
    { conversation: conv1._id, sender: rahul._id, content: 'Awesome! I\u2019ll share the details in a while.', readBy: [rahul._id] },
    { conversation: conv1._id, sender: yash._id, content: 'Perfect! Let\u2019s make it memorable', readBy: [yash._id] },
  ]);
  conv1.lastMessage = messages[messages.length - 1]._id;
  conv1.lastMessageAt = new Date();
  await conv1.save();

  const conv2 = await Conversation.create({ participants: [yash._id, ananya._id] });
  const m2 = await Message.create({
    conversation: conv2._id,
    sender: ananya._id,
    content: 'That sounds great!',
    readBy: [ananya._id],
  });
  conv2.lastMessage = m2._id;
  await conv2.save();

  console.log('\u2705 Seed complete!');
  console.log(`\nTest login credentials:\n  Email: hello.yash@mail.com\n  Password: Password123\n`);

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
