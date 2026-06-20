import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import LandingPage from './landing/LandingPage';

import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/dashboard/Dashboard';
import Discover from './pages/dashboard/Discover';
import Compatibility from './pages/dashboard/Compatibility';
import Trips from './pages/dashboard/Trips';
import CreateTrip from './pages/dashboard/CreateTrip';
import TripDetail from './pages/dashboard/TripDetail';
import Matches from './pages/dashboard/Matches';
import Messages from './pages/dashboard/Messages';
import Itinerary from './pages/dashboard/Itinerary';
import Bookings from './pages/dashboard/Bookings';
import Community from './pages/dashboard/Community';
import Wallet from './pages/dashboard/Wallet';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { borderRadius: '12px', fontSize: '14px' },
          success: { iconTheme: { primary: '#7C3AED', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public marketing landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Public auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Protected dashboard routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/compatibility/:userId" element={<Compatibility />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/new" element={<CreateTrip />} />
          <Route path="/trips/:id" element={<TripDetail />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/community" element={<Community />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
