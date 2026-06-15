import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { ApiError } from '../utils/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const result = await api.login(username, password);
      login(result);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Incorrect username or password.');
      } else {
        setError('Could not sign in right now. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-almond">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-walnut text-almond-light font-display text-xl mb-4">
            N
          </span>
          <h1 className="font-display text-2xl text-walnut">Nutique Co Admin</h1>
          <p className="text-sm text-walnut/60 mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-almond-light rounded-3xl border border-walnut/10 shadow-card p-6 sm:p-8 space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-walnut/80 mb-1.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond focus:outline-none focus:border-sage text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-walnut/80 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-walnut/15 bg-almond focus:outline-none focus:border-sage text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-walnut text-almond-light font-medium hover:bg-sage transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
