import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/users/me');
        setProfile(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!profile) return <p className="text-gray-600">Unable to load profile</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-8">My Profile</h1>
      <div className="card p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Full Name</label>
            <p className="text-lg text-gray-900 dark:text-slate-50 font-medium">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Email</label>
            <p className="text-lg text-gray-900 dark:text-slate-50 font-medium">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Account Type</label>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                profile.role === 'admin'
                  ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                  : 'bg-baby-pink-100 dark:bg-baby-pink-900 text-baby-pink-800 dark:text-baby-pink-200'
              }`}>
                {profile.role === 'admin' ? '👑 Administrator' : '👤 Customer'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

