import { useState } from 'react';
import { User, Shield, Bell, CreditCard, Link2, HelpCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const SECTIONS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Privacy & Security', icon: Shield },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  { id: 'connected', label: 'Connected Accounts', icon: Link2 },
  { id: 'help', label: 'Help & Support', icon: HelpCircle },
];

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [section, setSection] = useState('account');

  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '',
    gender: user?.gender || '',
    bio: user?.bio || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [savingPw, setSavingPw] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await api.put('/users/me', profileForm);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSavingPw(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password updated successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update password');
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-4">
      <div className="card h-fit p-2 lg:col-span-1">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition ${
              section === id ? 'bg-brand-gradient text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-6 lg:col-span-3">
        {section === 'account' && (
          <>
            <div className="card p-6">
              <p className="font-semibold text-gray-900">Account Information</p>
              <form onSubmit={handleSaveProfile} className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    className="input-field"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Email Address</label>
                  <input className="input-field bg-gray-50" value={user?.email} disabled />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    className="input-field"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 00000 00000"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    className="input-field"
                    value={profileForm.dateOfBirth}
                    onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    className="input-field"
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                  >
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Non-binary</option>
                    <option>Prefer not to say</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    rows={3}
                    className="input-field resize-none"
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" disabled={savingProfile} className="btn-primary">
                    {savingProfile ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card p-6">
              <p className="font-semibold text-gray-900">Change Password</p>
              <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
                <PasswordField
                  label="Current Password"
                  value={pwForm.currentPassword}
                  show={showPw.current}
                  onToggle={() => setShowPw({ ...showPw, current: !showPw.current })}
                  onChange={(v) => setPwForm({ ...pwForm, currentPassword: v })}
                />
                <PasswordField
                  label="New Password"
                  value={pwForm.newPassword}
                  show={showPw.next}
                  onToggle={() => setShowPw({ ...showPw, next: !showPw.next })}
                  onChange={(v) => setPwForm({ ...pwForm, newPassword: v })}
                />
                <PasswordField
                  label="Confirm New Password"
                  value={pwForm.confirmPassword}
                  show={showPw.confirm}
                  onToggle={() => setShowPw({ ...showPw, confirm: !showPw.confirm })}
                  onChange={(v) => setPwForm({ ...pwForm, confirmPassword: v })}
                />
                <button type="submit" disabled={savingPw} className="btn-primary">
                  {savingPw ? 'Updating…' : 'Update Password'}
                </button>
              </form>
            </div>
          </>
        )}

        {section === 'security' && (
          <div className="card p-6">
            <p className="font-semibold text-gray-900">Privacy & Security</p>
            <p className="mt-2 text-sm text-gray-500">
              Manage two-factor authentication, login sessions, and data privacy preferences here.
            </p>
          </div>
        )}

        {section === 'notifications' && (
          <div className="card p-6">
            <p className="font-semibold text-gray-900">Notifications</p>
            <p className="mt-2 text-sm text-gray-500">Choose what updates you'd like to receive from RAAHI.</p>
          </div>
        )}

        {section === 'payment' && (
          <div className="card p-6">
            <p className="font-semibold text-gray-900">Payment Methods</p>
            <p className="mt-2 text-sm text-gray-500">No payment methods added yet.</p>
          </div>
        )}

        {section === 'connected' && (
          <div className="card p-6">
            <p className="font-semibold text-gray-900">Connected Accounts</p>
            <p className="mt-2 text-sm text-gray-500">Link your Google, Facebook, or Apple account for faster login.</p>
          </div>
        )}

        {section === 'help' && (
          <div className="card p-6">
            <p className="font-semibold text-gray-900">Help & Support</p>
            <p className="mt-2 text-sm text-gray-500">Need help? Reach out to support@raahi.com</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordField({ label, value, show, onToggle, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          className="input-field pr-11"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
