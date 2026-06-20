import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const TRIP_TYPES = ['Adventure', 'Relaxation', 'Cultural', 'Road Trip', 'Backpacking', 'Other'];

export default function CreateTrip() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    destination: '',
    state: '',
    startDate: '',
    endDate: '',
    budgetMin: '',
    budgetMax: '',
    tripType: 'Adventure',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.destination || !form.startDate || !form.endDate) {
      toast.error('Please fill in destination and dates');
      return;
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      toast.error('End date cannot be before start date');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/trips', {
        ...form,
        title: `Trip to ${form.destination}`,
        budgetMin: Number(form.budgetMin) || 0,
        budgetMax: Number(form.budgetMax) || 0,
      });
      toast.success('Trip created!');
      navigate(`/trips/${data.trip._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/trips" className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>

      <div>
        <h2 className="font-display text-xl font-bold text-gray-900">Create a New Trip</h2>
        <p className="text-sm text-gray-500">Plan your next adventure</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card space-y-5 p-6 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Destination</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="input-field"
                placeholder="City / Destination"
                value={form.destination}
                onChange={(e) => update('destination', e.target.value)}
              />
              <input
                className="input-field"
                placeholder="State / Region"
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                className="input-field"
                value={form.startDate}
                onChange={(e) => update('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                className="input-field"
                value={form.endDate}
                onChange={(e) => update('endDate', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Budget per person (₹)</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min="0"
                className="input-field"
                placeholder="Min"
                value={form.budgetMin}
                onChange={(e) => update('budgetMin', e.target.value)}
              />
              <input
                type="number"
                min="0"
                className="input-field"
                placeholder="Max"
                value={form.budgetMax}
                onChange={(e) => update('budgetMax', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Trip Type</label>
            <div className="flex flex-wrap gap-2">
              {TRIP_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => update('tripType', type)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    form.tripType === type
                      ? 'bg-brand-gradient text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              maxLength={200}
              className="input-field resize-none"
              placeholder="Tell us about your trip plans..."
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
            />
            <p className="mt-1 text-right text-xs text-gray-400">{form.description.length}/200</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Link to="/trips" className="btn-secondary flex-1 text-center">
              Cancel
            </Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Creating…' : 'Create Trip'}
            </button>
          </div>
        </form>

        {/* Trip preview card */}
        <div className="card p-6">
          <p className="mb-3 text-sm font-medium text-gray-500">Trip Preview</p>
          <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-brand-400 to-accent-pink" />
          <h4 className="mt-4 font-display text-lg font-bold text-gray-900">
            {form.destination || 'Your destination'}
            {form.state ? `, ${form.state}` : ''}
          </h4>
          {form.startDate && form.endDate && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4" />
              {new Date(form.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
              {new Date(form.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
          {(form.budgetMin || form.budgetMax) && (
            <p className="mt-1 text-sm text-gray-500">
              Budget: ₹{form.budgetMin || 0} – ₹{form.budgetMax || 0}
            </p>
          )}
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4" /> Trip Type: {form.tripType}
          </p>
        </div>
      </div>
    </div>
  );
}
