import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Settings as SettingsIcon, MapPin, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ trips: 0, matches: 0 });
  const [countries, setCountries] = useState(0);
  const [groups, setGroups] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/users/me/dashboard');
        setStats({ trips: data.stats.tripsPlanned, matches: data.stats.matchesFound });
        setCountries(data.stats.countriesVisited);
        setGroups(data.stats.groupsJoined);
      } catch (err) {
        toast.error('Could not load profile stats');
      }
    };
    load();
  }, []);

  if (!user) return null;

  const STAT_CARDS = [
    { label: 'Trips', value: stats.trips },
    { label: 'Matches', value: stats.matches },
    { label: 'Countries', value: countries },
    { label: 'Groups', value: groups },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card overflow-hidden">
        <div className="h-28 bg-navy-gradient" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end justify-between">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-brand-gradient text-3xl font-bold text-white">
              {user.fullName?.[0]}
            </div>
            <Link to="/settings" className="btn-secondary">
              <Pencil className="h-4 w-4" /> Edit Profile
            </Link>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            <h2 className="font-display text-xl font-bold text-gray-900">{user.fullName}</h2>
            {user.isVerified && <BadgeCheck className="h-5 w-5 text-brand-600" />}
          </div>
          <p className="text-sm text-gray-500">{user.travelerType}</p>
          {(user.location?.city || user.location?.country) && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
              <MapPin className="h-3.5 w-3.5" />
              {[user.location?.city, user.location?.country].filter(Boolean).join(', ')}
            </p>
          )}

          <div className="mt-5 grid grid-cols-4 gap-3 border-t border-gray-100 pt-5">
            {STAT_CARDS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-lg font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <p className="font-semibold text-gray-900">About Me</p>
          <p className="mt-2 text-sm text-gray-600">{user.bio || 'No bio added yet. Tell other travelers about yourself!'}</p>

          {!!user.interests?.length && (
            <div className="mt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Interests</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {user.interests.map((i) => (
                  <span key={i} className="badge bg-brand-50 text-brand-700">{i}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="font-semibold text-gray-900">Interests</p>
          <div className="mt-3 space-y-3 text-sm">
            <Row label="Travel Style" value={user.travelStyle || 'Not set'} />
            <Row label="Group Preference" value={user.groupPreference || 'Not set'} />
            <Row label="Languages" value={user.languages?.join(', ') || 'Not set'} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Link to="/settings" className="btn-secondary">
          <SettingsIcon className="h-4 w-4" /> Account Settings
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value}</span>
    </div>
  );
}
