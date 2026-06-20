import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Map,
  Heart,
  MessageCircle,
  ListChecks,
  CalendarCheck,
  Users,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/discover', icon: Compass, label: 'Discover' },
  { to: '/trips', icon: Map, label: 'Trips' },
  { to: '/matches', icon: Heart, label: 'Matches' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/itinerary', icon: ListChecks, label: 'Itinerary' },
  { to: '/bookings', icon: CalendarCheck, label: 'Bookings' },
  { to: '/community', icon: Users, label: 'Community' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy-gradient px-4 py-6 transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-2">
          <Logo light />
        </div>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto scroll-thin">
          {NAV_ITEMS.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-4 border-t border-raahi-border pt-4">
          <button
            onClick={logout}
            className="sidebar-link w-full text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Log Out
          </button>

          {user && (
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                {user.fullName?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{user.fullName}</p>
                <p className="truncate text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
