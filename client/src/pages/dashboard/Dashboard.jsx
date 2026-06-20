import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const FALLBACK_DESTINATIONS = [
  { name: 'Manali', state: 'Himachal Pradesh' },
  { name: 'Kasol', state: 'Himachal Pradesh' },
  { name: 'Zanskar Valley', state: 'Ladakh' },
  { name: 'Goa', state: 'Beach Vibes' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ tripsPlanned: 0, matchesFound: 0, countriesVisited: 0, groupsJoined: 0 });
  const [upcomingTrip, setUpcomingTrip] = useState(null);
  const [recommendedTrips, setRecommendedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(null);

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
    { label: 'Trips Planned', value: stats.tripsPlanned, hint: '+2 this month' },
    { label: 'Matches Found', value: stats.matchesFound, hint: '+6 new matches' },
    { label: 'Countries Visited', value: stats.countriesVisited, hint: 'Keep Exploring' },
    { label: 'Groups Joined', value: stats.groupsJoined, hint: '' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900">
          {greeting}, {firstName}! 👋
        </h2>
        <p className="text-gray-500">Ready for your next adventure?</p>
      </div>

      {/* Hero + upcoming trip */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-navy-gradient p-8 text-white lg:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />
          <div className="relative z-10 max-w-md">
            <h3 className="font-display text-2xl font-bold">Find Your Travel Tribe</h3>
            <p className="mt-2 text-gray-300">Connect with like-minded travelers and explore the world together.</p>
            <Link to="/discover" className="btn-primary mt-5 inline-flex">
              Explore Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="card flex flex-col p-6">
          {upcomingTrip ? (
            <>
              <p className="text-sm font-medium text-gray-500">Upcoming Trip</p>
              <h4 className="mt-1 font-display text-lg font-bold text-gray-900">{upcomingTrip.title}</h4>
              <p className="text-sm text-gray-500">
                {new Date(upcomingTrip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                {new Date(upcomingTrip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>

              {countdown && (
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[
                    { v: countdown.days, l: 'Days' },
                    { v: countdown.hours, l: 'Hours' },
                    { v: countdown.mins, l: 'Mins' },
                  ].map((c) => (
                    <div key={c.l} className="rounded-lg bg-brand-50 py-2">
                      <p className="font-display text-lg font-bold text-brand-700">{String(c.v).padStart(2, '0')}</p>
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
            <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-gray-500">
              <p>No upcoming trips yet.</p>
              <Link to="/trips" className="mt-2 font-semibold text-brand-600 hover:underline">
                Plan a trip
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="font-display text-2xl font-bold text-gray-900">{loading ? '—' : s.value}</p>
            <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            {s.hint && <p className="mt-1 text-xs font-medium text-emerald-600">{s.hint}</p>}
          </div>
        ))}
      </div>

      {/* Recommended */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-gray-900">Recommended For You</h3>
          <Link to="/discover" className="text-sm font-semibold text-brand-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {(recommendedTrips.length ? recommendedTrips : FALLBACK_DESTINATIONS).map((t, i) => (
            <div key={t._id || t.name} className="group relative overflow-hidden rounded-2xl">
              <div
                className="aspect-[4/5] w-full bg-gradient-to-br from-brand-400 to-accent-pink bg-cover bg-center transition group-hover:scale-105"
                style={t.coverImage ? { backgroundImage: `url(${t.coverImage})` } : undefined}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <button
                className="absolute right-2 top-2 rounded-full bg-white/20 p-1.5 backdrop-blur hover:bg-white/30"
                aria-label="Save destination"
              >
                <Heart className="h-4 w-4 text-white" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                <p className="font-semibold">{t.destination || t.name}</p>
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
      </div>
    </div>
  );
}
