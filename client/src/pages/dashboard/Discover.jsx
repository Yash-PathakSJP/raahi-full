import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const FILTERS = ['All', 'Adventure', 'Trekking', 'Backpacking', 'Photography'];

export default function Discover() {
  const navigate = useNavigate();
  const [travelers, setTravelers] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(new Set());

  const loadTravelers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/discover', {
        params: { search, interest: activeFilter, page, limit: 6 },
      });
      setTravelers(data.travelers);
      setPages(data.pages || 1);
    } catch (err) {
      toast.error('Could not load travelers');
    } finally {
      setLoading(false);
    }
  }, [search, activeFilter, page]);

  useEffect(() => {
    const t = setTimeout(loadTravelers, 300); // debounce search
    return () => clearTimeout(t);
  }, [loadTravelers]);

  const handleLike = async (e, userId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const { data } = await api.post(`/matches/${userId}`);
      setLikedIds((prev) => new Set(prev).add(userId));
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send match request');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, destination, interest..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
          />
        </div>
        <button className="btn-secondary">
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => {
              setActiveFilter(f);
              setPage(1);
            }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeFilter === f
                ? 'bg-brand-gradient text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : travelers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center p-16 text-center">
          <p className="font-display text-lg font-semibold text-gray-700">No travelers found</p>
          <p className="mt-1 text-sm text-gray-500">Try a different search term or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {travelers.map((t) => (
            <div
              key={t._id}
              onClick={() => navigate(`/matches/compatibility/${t._id}`)}
              className="card group cursor-pointer overflow-hidden transition hover:shadow-lg"
            >
              <div className="relative h-40 bg-gradient-to-br from-brand-400 to-accent-pink">
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-brand-700">
                  {88 + (t._id.charCodeAt(0) % 10)}% Match
                </span>
                <button
                  onClick={(e) => handleLike(e, t._id)}
                  className="absolute right-3 top-3 rounded-full bg-white/90 p-2 transition hover:bg-white"
                  aria-label="Like traveler"
                >
                  <Heart
                    className={`h-4 w-4 ${likedIds.has(t._id) ? 'fill-accent-rose text-accent-rose' : 'text-gray-500'}`}
                  />
                </button>
                <div className="absolute -bottom-7 left-4 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-brand-600 text-lg font-bold text-white">
                  {t.fullName[0]}
                </div>
              </div>
              <div className="p-4 pt-9">
                <p className="font-semibold text-gray-900">{t.fullName}</p>
                <p className="text-sm text-gray-500">{t.travelerType}</p>
                <p className="mt-0.5 text-xs text-gray-400">{t.location?.city}, {t.location?.country}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(t.interests || []).slice(0, 2).map((interest) => (
                    <span key={interest} className="badge bg-brand-50 text-brand-700">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-lg text-sm font-medium ${
                page === i + 1 ? 'bg-brand-gradient text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === pages}
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
