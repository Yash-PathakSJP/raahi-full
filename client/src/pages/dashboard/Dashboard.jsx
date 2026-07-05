import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles, Map, Compass, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const FALLBACK_DESTINATIONS = [
  { name: 'Manali', state: 'Himachal Pradesh', emoji: '🏔️' },
  { name: 'Kasol', state: 'Himachal Pradesh', emoji: '🌲' },
  { name: 'Zanskar Valley', state: 'Ladakh', emoji: '❄️' },
  { name: 'Goa', state: 'Beach Vibes', emoji: '🏖️' },
];

const GRADIENT_PAIRS = [
  'from-violet-500 to-purple-700',
  'from-pink-500 to-rose-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    tripsPlanned: 0,
    matchesFound: 0,
    countriesVisited: 0,
    groupsJoined: 0,
  });
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [recommendedTrips, setRecommendedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const isNewUser =
    !loading &&
    stats.tripsPlanned === 0 &&
    stats.matchesFound === 0;

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/me/dashboard');
        setStats(data.stats);
        setUpcomingTrip(data.upcomingTrip);
        setRecommendedTrips(data.recommendedTrips || []);
      } catch (err) {
        toast.error('Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!upcomingTrip?.startDate) return;
    const tick = () => {
      const diff = new Date(upcomingTrip.startDate) - new Date();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      });
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, [upcomingTrip]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const firstName = user?.fullName?.split(' ')[0] || 'Traveler';

  const STAT_CARDS = [
    { label: 'Trips Planned', value: stats.tripsPlanned, icon: '🗺️', color: 'bg-violet-50 text-violet-700' },
    { label: 'Matches Found', value: stats.matchesFound, icon: '🤝', color: 'bg-pink-50 text-pink-700' },
    { label: 'Countries', value: stats.countriesVisited, icon: '🌍', color: 'bg-blue-50 text-blue-700' },
    { label: 'Groups Joined', value: stats.groupsJoined, icon: '👥', color: 'bg-emerald-50 text-emerald-700' },
  ];

  const ONBOARDING_STEPS = [
    {
      step: 1,
      icon: '👤',
      label: 'Complete your profile',
      desc: 'Add your interests, travel style and bio so others can find you',
      link: '/settings',
      cta: 'Edit Profile',
      done: !!(user?.bio || user?.interests?.length),
    },
    {
      step: 2,
      icon: '🧭',
      label: 'Discover travelers',
      desc: 'Browse people going to similar destinations and send match requests',
      link: '/discover',
      cta: 'Explore',
      done: stats.matchesFound > 0,
    },
    {
      step: 3,
      icon: '✈️',
      label: 'Create your first trip',
      desc: 'Plan a trip and invite others to join your adventure',
      link: '/trips/new',
      cta: 'Create Trip',
      done: stats.tripsPlanned > 0,
    },
    {
      step: 4,
      icon: '💬',
      label: 'Start a conversation',
      desc: 'Message a matched traveler and plan together in real time',
      link: '/messages',
      cta: 'Go to Messages',
      done: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900">
          {greeting}, {firstName}! 👋
        </h2>
        <p className="text-gray-500">
          {isNewUser
            ? 'Welcome to RAAHI! Follow the steps below to get started.'
            : 'Ready for your next adventure?'}
        </p>
      </div>

      {/* Onboarding checklist — only for new users */}
      {isNewUser && (
        <div className="card border-brand-200 bg-gradient-to-br from-brand-50 to-purple-50 p-6">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl">🎒</span>
            <div>
              <h3 className="font-display text-lg font-bold text-brand-900">
                Welcome to RAAHI!
              </h3>
              <p className="text-sm text-brand-600">
                Complete these steps to start your journey
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {ONBOARDING_STEPS.map((item) => (
              <div
                key={item.step}
                className={`flex items-center gap-4 rounded-xl p-4 shadow-sm transition ${
                  item.done ? 'bg-white/60' : 'bg-white'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                    item.done
                      ? 'bg-emerald-100'
                      : 'bg-brand-gradient text-white'
                  }`}
                >
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    item.emoji || item.step
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-semibold text-sm ${
                      item.done ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}
                  >
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
                {!item.done && (
                  <Link
                    to={item.link}
                    className="btn-primary shrink-0 text-xs py-2 px-3"
                  >
                    {item.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero + upcoming trip */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-navy-gradient p-8 text-white lg:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="relative z-10 max-w-md">
            <h3 className="font-display text-2xl font-bold">
              Find Your Travel Tribe
            </h3>
            <p className="mt-2 text-gray-300">
              Connect with like-minded travelers and explore the world together.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/discover" className="btn-primary inline-flex">
                Explore Travelers <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/trips/new"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                <Map className="h-4 w-4" /> Plan a Trip
              </Link>
            </div>
          </div>
        </div>

        <div className="card flex flex-col p-6">
          {upcomingTrip ? (
            <>
              <p className="text-sm font-medium text-gray-500">Upcoming Trip</p>
              <h4 className="mt-1 font-display text-lg font-bold text-gray-900">
                {upcomingTrip.title}
              </h4>
              <p className="text-sm text-gray-500">
                {new Date(upcomingTrip.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                –{' '}
                {new Date(upcomingTrip.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              {countdown && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: countdown.days, l: 'Days' },
                    { v: countdown.hours, l: 'Hours' },
                    { v: countdown.mins, l: 'Mins' },
                  ].map((c) => (
                    <div key={c.l} className="rounded-lg bg-brand-50 py-2">
                      <p className="font-display text-lg font-bold text-brand-700">
                        {String(c.v).padStart(2, '0')}
                      </p>
                      <p className="text-[11px] text-brand-500">{c.l}</p>
                    </div>
                  ))}
                </div>
              )}

              <Link
                to={`/trips/${upcomingTrip._id}`}
                className="mt-auto pt-4 text-center text-sm font-semibold text-brand-600 hover:underline"
              >
                View Itinerary
              </Link>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center gap-3">
              <span className="text-4xl">✈️</span>
              <div>
                <p className="font-semibold text-gray-700">No upcoming trips</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start planning your first adventure
                </p>
              </div>
              <Link to="/trips/new" className="btn-primary text-sm">
                Create a Trip
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="card p-5">
            <div
              className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl ${s.color}`}
            >
              {s.icon}
            </div>
            <p className="font-display text-2xl font-bold text-gray-900">
              {loading ? '—' : s.value}
            </p>
            <p className="mt-0.5 text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recommended / Destinations */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-gray-900">
            {recommendedTrips.length > 0
              ? 'Recommended For You'
              : 'Popular Destinations'}
          </h3>
          <Link
            to="/discover"
            className="text-sm font-semibold text-brand-600 hover:underline"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {(recommendedTrips.length
              ? recommendedTrips
              : FALLBACK_DESTINATIONS
            ).map((t, i) => (
              <div
                key={t._id || t.name}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                <div
                  className={`aspect-[4/5] w-full bg-gradient-to-br ${GRADIENT_PAIRS[i % GRADIENT_PAIRS.length]} transition group-hover:scale-105`}
                  style={
                    t.coverImage
                      ? {
                          backgroundImage: `url(${t.coverImage})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : undefined
                  }
                >
                  {!t.coverImage && (
                    <div className="flex h-full items-center justify-center text-5xl opacity-40">
                      {t.emoji || '🌏'}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <button
                  className="absolute right-2 top-2 rounded-full bg-white/20 p-1.5 backdrop-blur hover:bg-white/30"
                  aria-label="Save destination"
                >
                  <Heart className="h-4 w-4 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="font-semibold leading-tight">
                    {t.destination || t.name}
                  </p>
                  <p className="text-xs text-gray-200">{t.state}</p>
                </div>
              </div>
            ))}

            <Link
              to="/discover"
              className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100"
            >
              <Sparkles className="h-6 w-6" />
              <span className="text-sm font-semibold">Discover More</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick actions for new users */}
      {isNewUser && (
        <div>
          <h3 className="font-display text-lg font-bold text-gray-900 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              to="/discover"
              className="card flex items-center gap-4 p-5 hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-2xl">
                🧭
              </div>
              <div>
                <p className="font-semibold text-gray-900">Find Travelers</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Browse and connect with compatible travel buddies
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400 shrink-0" />
            </Link>

            <Link
              to="/trips/new"
              className="card flex items-center gap-4 p-5 hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-2xl">
                🗺️
              </div>
              <div>
                <p className="font-semibold text-gray-900">Plan a Trip</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Create a trip and invite others to join your adventure
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400 shrink-0" />
            </Link>

            <Link
              to="/settings"
              className="card flex items-center gap-4 p-5 hover:shadow-md transition"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                👤
              </div>
              <div>
                <p className="font-semibold text-gray-900">Setup Profile</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add your interests so the right travelers find you
                </p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-gray-400 shrink-0" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
