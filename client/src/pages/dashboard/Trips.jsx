import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreVertical, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const TABS = ['All Trips', 'Upcoming', 'Ongoing', 'Completed', 'Cancelled'];

const STATUS_STYLES = {
  Upcoming: 'bg-brand-50 text-brand-700',
  Ongoing: 'bg-emerald-50 text-emerald-700',
  Completed: 'bg-gray-100 text-gray-600',
  Cancelled: 'bg-rose-50 text-rose-600',
  Planned: 'bg-amber-50 text-amber-700',
};

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [tab, setTab] = useState('All Trips');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const status = tab === 'All Trips' ? 'All' : tab;
        const { data } = await api.get('/trips', { params: { status } });
        setTrips(data.trips);
      } catch (err) {
        toast.error('Could not load trips');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [tab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                tab === t ? 'bg-brand-gradient text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <Link to="/trips/new" className="btn-primary shrink-0">
          <Plus className="h-4 w-4" /> Create Trip
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card h-28 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <p className="font-display text-lg font-semibold text-gray-700">No trips here yet</p>
          <p className="mt-1 text-sm text-gray-500">Start planning your next adventure.</p>
          <Link to="/trips/new" className="btn-primary mt-4">
            <Plus className="h-4 w-4" /> Create Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <Link
              key={trip._id}
              to={`/trips/${trip._id}`}
              className="card flex flex-col gap-4 p-4 transition hover:shadow-lg sm:flex-row sm:items-center"
            >
              <div className="h-24 w-full shrink-0 rounded-xl bg-gradient-to-br from-brand-400 to-accent-pink sm:w-32" />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{trip.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
                      {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-gray-400">{trip.destination}{trip.state ? `, ${trip.state}` : ''}</p>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                    aria-label="Trip options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className={`badge ${STATUS_STYLES[trip.status] || 'bg-gray-100 text-gray-600'}`}>
                    {trip.status}
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <div className="flex -space-x-2">
                      {trip.members.slice(0, 3).map((m) => (
                        <div
                          key={m.user?._id || m.user}
                          className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-200 text-[10px] font-bold text-brand-800"
                        >
                          {m.user?.fullName?.[0] || '?'}
                        </div>
                      ))}
                    </div>
                    <Users className="h-3.5 w-3.5" />
                    {trip.members.length}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
