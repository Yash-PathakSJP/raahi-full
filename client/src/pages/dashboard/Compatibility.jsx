import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Heart, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const ICON_BY_INDEX = ['🏔️', '💰', '🌍', '🗣️', '✨'];

export default function Compatibility() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: me } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/matches/compatibility/${userId}`);
        setData(res.data);
      } catch (err) {
        toast.error('Could not load compatibility data');
        navigate('/discover');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, navigate]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const { data: res } = await api.post(`/matches/${userId}`);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send request');
    } finally {
      setConnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!data) return null;

  const { user: other, compatibilityScore, reasons } = data;
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (compatibilityScore / 100) * circumference;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Discover
      </button>

      <div className="card p-8 text-center">
        <h2 className="font-display text-xl font-bold text-gray-900">AI Compatibility</h2>
        <p className="mt-1 text-sm text-gray-500">See how well you match with {other.fullName}</p>

        <div className="mt-8 flex items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-gradient text-xl font-bold text-white">
              {me?.fullName?.[0] || 'Y'}
            </div>
            <p className="text-sm font-medium text-gray-700">{me?.fullName}</p>
          </div>

          <div className="relative h-32 w-32">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#F3F0FF" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="url(#compat-grad)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
              <defs>
                <linearGradient id="compat-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-extrabold text-gray-900">{compatibilityScore}%</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-600">
              {other.fullName[0]}
            </div>
            <p className="text-sm font-medium text-gray-700">{other.fullName}</p>
          </div>
        </div>

        <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-4 py-1.5 text-sm font-semibold text-rose-600">
          <Heart className="h-4 w-4 fill-rose-500 text-rose-500" /> Highly Compatible
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6">
          <p className="font-semibold text-gray-900">Why you match?</p>
          <ul className="mt-3 space-y-3">
            {reasons.map((r, i) => (
              <li key={r.title} className="flex gap-3">
                <span className="text-lg">{ICON_BY_INDEX[i % ICON_BY_INDEX.length]}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card bg-brand-50 p-6">
          <p className="flex items-center gap-1.5 font-semibold text-brand-800">
            <Sparkles className="h-4 w-4" /> AI Insight
          </p>
          <p className="mt-3 text-sm text-brand-700">
            You two could be great travel buddies! Shared interests and a similar travel style suggest you'll
            enjoy planning adventures together.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={handleConnect} disabled={connecting} className="btn-primary flex-1">
          <Heart className="h-4 w-4" /> {connecting ? 'Sending…' : 'Send Match Request'}
        </button>
        <Link to="/messages" className="btn-secondary flex-1">
          <MessageCircle className="h-4 w-4" /> Message
        </Link>
      </div>
    </div>
  );
}
