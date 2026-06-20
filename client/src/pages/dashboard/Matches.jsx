import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/matches', { params: { status: 'matched' } });
        setMatches(data.matches);
      } catch (err) {
        toast.error('Could not load matches');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getOther = (m) => m.users.find((u) => u._id !== user.id && u._id !== user._id);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-40 animate-pulse bg-gray-100" />
        ))}
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center p-16 text-center">
        <Heart className="h-10 w-10 text-brand-200" />
        <p className="mt-3 font-display text-lg font-semibold text-gray-700">No matches yet</p>
        <p className="mt-1 text-sm text-gray-500">Head to Discover to find your travel tribe.</p>
        <Link to="/discover" className="btn-primary mt-4">Discover Travelers</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((m) => {
        const other = getOther(m);
        if (!other) return null;
        return (
          <div key={m._id} className="card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-gradient text-base font-bold text-white">
                {other.fullName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900">{other.fullName}</p>
                <p className="truncate text-xs text-gray-500">{other.travelerType}</p>
              </div>
              <span className="badge bg-rose-50 text-rose-600">{m.compatibilityScore}%</span>
            </div>
            {other.location?.city && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                <MapPin className="h-3.5 w-3.5" /> {other.location.city}, {other.location.country}
              </p>
            )}
            <div className="mt-4 flex gap-2">
              <Link to={`/matches/compatibility/${other._id}`} className="btn-secondary flex-1 text-xs">
                View Match
              </Link>
              <Link to="/messages" className="btn-primary flex-1 text-xs">
                <MessageCircle className="h-3.5 w-3.5" /> Message
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
