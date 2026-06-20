import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard' },
  '/discover': { title: 'Discover Travelers', subtitle: 'Find and connect with like-minded travelers' },
  '/trips': { title: 'Your Trips', subtitle: 'Manage and explore your travel plans' },
  '/matches': { title: 'Matches' },
  '/messages': { title: 'Messages' },
  '/itinerary': { title: 'Itinerary' },
  '/bookings': { title: 'Bookings' },
  '/community': { title: 'Community' },
  '/wallet': { title: 'Wallet' },
  '/settings': { title: 'Settings', subtitle: 'Manage your account and preferences' },
};

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const meta =
    PAGE_META[location.pathname] ||
    Object.entries(PAGE_META).find(([path]) => location.pathname.startsWith(path))?.[1] ||
    {};

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setMobileOpen(true)} title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-y-auto scroll-thin p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
