// Centralized content for the Raahi landing page.
// Keeping copy and structured data here makes the page easy to localize
// or swap for live API data later (see server/routes for the matching endpoints).

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' },
]

export const heroStats = [
  { value: '10K+', label: 'Travelers' },
  { value: '500+', label: 'Trips Planned' },
  { value: '50+', label: 'Countries' },
  { value: '98%', label: 'Happy Travelers' },
]

export const trustedBrands = ['Google', 'Airbnb', 'Booking.com', 'TripAdvisor', 'MakeMyTrip', 'GoPro']

export const features = [
  {
    icon: 'compass',
    title: 'AI Compatibility',
    desc: 'Smart AI matches you with travelers who vibe with you.',
  },
  {
    icon: 'userCheck',
    title: 'Verified Profiles',
    desc: 'Real people, real journeys. Verified for your safety.',
  },
  {
    icon: 'map',
    title: 'Trip Planning',
    desc: 'Plan, organize and manage trips together seamlessly.',
  },
  {
    icon: 'shield',
    title: 'Safe & Secure',
    desc: 'Your safety is our top priority always.',
  },
]

export const howItWorks = [
  {
    number: '01',
    icon: 'userCheck',
    title: 'Create Profile',
    desc: 'Tell us about yourself, your interests and travel preferences.',
  },
  {
    number: '02',
    icon: 'users',
    title: 'Find Your Match',
    desc: 'Our AI finds compatible travelers who share your travel vibe.',
  },
  {
    number: '03',
    icon: 'map',
    title: 'Plan & Travel',
    desc: 'Connect, plan your trip together and make unforgettable memories.',
  },
]

export const travelers = [
  {
    name: 'Rahul Sharma',
    age: 26,
    location: 'Bangalore',
    tags: ['Backpacking', 'Camping'],
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=380&fit=crop&crop=faces',
  },
  {
    name: 'Ananya Verma',
    age: 25,
    location: 'Delhi',
    tags: ['Trekking', 'Mountains'],
    badge: 'Match',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=320&h=420&fit=crop&crop=faces',
    featured: true,
  },
  {
    name: 'Nikhil Patil',
    age: 27,
    location: 'Mumbai',
    tags: ['Photography', 'Budget Travel'],
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=300&h=380&fit=crop&crop=faces',
  },
]

export const discoverPerks = [
  'Advanced search & filters',
  'Interests, budget, travel style & more',
  'Chat and get to know each other',
  'Build trust before you travel',
]

export const trips = [
  {
    title: 'Spiti Valley Expedition',
    dates: 'May 20 – May 28, 2026',
    location: 'Himachal Pradesh',
    rating: '4.8',
    reviews: '120',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&h=380&fit=crop',
    avatars: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop&crop=faces',
    ],
  },
  {
    title: 'Goa Beach Party',
    dates: 'Jun 10 – Jun 15, 2026',
    location: 'Goa',
    rating: '4.7',
    reviews: '98',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&h=380&fit=crop',
    avatars: [
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&h=80&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces',
    ],
  },
  {
    title: 'Rishikesh Adventure',
    dates: 'May 15 – May 18, 2026',
    location: 'Uttarakhand',
    rating: '4.9',
    reviews: '110',
    image: 'https://images.unsplash.com/photo-1593766787879-e8c3837a4b3e?w=500&h=380&fit=crop',
    avatars: [
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces',
    ],
  },
]

export const compatibilityMatch = {
  score: 92,
  label: 'Highly Compatible',
  personA: {
    name: 'Yash Pathak',
    location: 'Jaipur, India',
    image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=160&h=160&fit=crop&crop=faces',
  },
  personB: {
    name: 'Rahul Sharma',
    location: 'Bangalore, India',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=faces',
  },
  signals: ['Interests & hobbies', 'Travel style & preferences', 'Budget & comfort level', 'Destinations you love', 'Personality & vibe'],
  reasons: ['Both love Adventure & Trekking', 'Similar budget range', 'Love for Mountains', 'Similar travel style', 'Both photography enthusiasts'],
}

export const testimonials = [
  {
    quote: 'I found my best travel buddy on Raahi and we had an amazing time in Himalayas!',
    name: 'Ananya Verma',
    location: 'Dehradun, India',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote: 'Raahi made solo travel so easy. Met awesome people!',
    name: 'Rahul Malhotra',
    location: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=faces',
  },
  {
    quote: 'The AI match is actually accurate. Great platform!',
    name: 'Mehak Singh',
    location: 'Chandigarh, India',
    image: 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?w=120&h=120&fit=crop&crop=faces',
  },
]

export const communityStats = [
  { value: '10K+', label: 'Active Travelers' },
  { value: '200+', label: 'Trips Every Month' },
  { value: '50+', label: 'Countries' },
  { value: '24/7', label: 'Support' },
]

export const footerLinks = {
  Platform: [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Testimonials', href: '#testimonials' },
  ],
  Company: [
    { label: 'About Us', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Terms & Conditions', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Safety Tips', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
}
