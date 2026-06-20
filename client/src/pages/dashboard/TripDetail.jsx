import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const TABS = ['Overview', 'Itinerary', 'Expenses', 'Members', 'Notes'];

export default function TripDetail() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [tab, setTab] = useState('Itinerary');
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');

  const loadTrip = async () => {
    try {
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data.trip);
    } catch (err) {
      toast.error('Could not load trip');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await api.post(`/trips/${id}/notes`, { content: noteText.trim() });
      setNoteText('');
      loadTrip();
    } catch (err) {
      toast.error('Could not add note');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="space-y-6">
      <Link to="/trips" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back to Trips
      </Link>

      <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-gray-900">{trip.title}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> {trip.destination}{trip.state ? `, ${trip.state}` : ''}
            </span>
          </p>
        </div>
        <button className="btn-secondary shrink-0">
          <Share2 className="h-4 w-4" /> Share Trip
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium transition ${
              tab === t ? 'border-b-2 border-brand-600 text-brand-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <div className="card p-6">
          <p className="text-sm text-gray-600">{trip.description || 'No description added yet.'}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Trip Type" value={trip.tripType} />
            <Stat label="Status" value={trip.status} />
            <Stat label="Budget" value={`₹${trip.budgetMin || 0} – ₹${trip.budgetMax || 0}`} />
            <Stat label="Members" value={trip.members.length} />
          </div>
        </div>
      )}

      {tab === 'Itinerary' && (
        <div className="card p-6">
          {trip.itinerary?.length ? (
            <ol className="relative space-y-6 border-l-2 border-brand-100 pl-6">
              {trip.itinerary.map((day) => (
                <li key={day.day} className="relative">
                  <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[10px] font-bold text-white">
                    {day.day}
                  </span>
                  <p className="text-xs font-medium text-gray-400">
                    Day {day.day} {day.date ? `· ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                  </p>
                  <p className="font-semibold text-gray-900">{day.title}</p>
                  <p className="text-sm text-gray-500">{day.description}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">No itinerary added yet.</p>
          )}
        </div>
      )}

      {tab === 'Expenses' && (
        <div className="card p-6">
          {trip.expenses?.length ? (
            <ul className="divide-y divide-gray-100">
              {trip.expenses.map((exp, i) => (
                <li key={i} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-800">{exp.title}</p>
                    <p className="text-xs text-gray-400">Paid by {exp.paidBy?.fullName || 'Unknown'}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{exp.amount}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No expenses logged yet.</p>
          )}
        </div>
      )}

      {tab === 'Members' && (
        <div className="card divide-y divide-gray-100 p-2">
          {trip.members.map((m) => (
            <div key={m.user?._id || m.user} className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                {m.user?.fullName?.[0] || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-800">{m.user?.fullName || 'Unknown'}</p>
                <p className="text-xs capitalize text-gray-400">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Notes' && (
        <div className="space-y-4">
          <form onSubmit={handleAddNote} className="card flex gap-2 p-3">
            <input
              className="input-field"
              placeholder="Add a note for the group..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button type="submit" className="btn-primary shrink-0">Post</button>
          </form>
          {trip.notes?.length ? (
            <div className="space-y-3">
              {trip.notes.map((n, i) => (
                <div key={i} className="card p-4">
                  <p className="text-sm font-medium text-gray-800">{n.author?.fullName || 'Someone'}</p>
                  <p className="mt-1 text-sm text-gray-600">{n.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-gray-500">No notes yet — be the first to add one!</p>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-0.5 font-semibold text-gray-900">{value}</p>
    </div>
  );
}
