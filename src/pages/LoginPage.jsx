import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { accessToken, user } = res.data;
      login(user, accessToken);
      navigate('/');
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 bg-gradient-bebe-soft">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-gradient-bebe-vibrant shadow-xl flex items-center justify-center text-white text-lg font-bold mx-auto mb-4 transform hover:scale-110 transition-transform">
            CX
          </div>
          <h1 className="text-4xl font-bold gradient-text drop-shadow-sm">Welcome Back</h1>
          <p className="text-baby-pink-600 dark:text-baby-pink-300 mt-2 font-medium">Sign in to your CommerceX account</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border-2 border-baby-pink-200 dark:border-baby-pink-700">
          <div>
            <label className="block text-sm font-semibold text-baby-pink-700 dark:text-baby-pink-200 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-baby-pink-700 dark:text-baby-pink-200 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field"
            />
          </div>

          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">❌ {error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? '⏳ Signing in...' : '💗 Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-700 dark:text-slate-300">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-baby-pink-600 dark:text-baby-pink-400 hover:text-baby-pink-700 dark:hover:text-baby-pink-300 font-bold hover:underline underline-offset-2">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

