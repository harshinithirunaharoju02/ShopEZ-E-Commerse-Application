import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthError } from '../redux/slices/authSlice';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { userInfo, loading, error } = useSelector((state) => state.auth);

  // Redirect if already logged in
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    // Clear any previous errors on mount
    return () => {
      dispatch(clearAuthError());
    };
  }, [userInfo, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-xl p-8 transition-colors duration-300">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400">
            <LogIn className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your orders and profile
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50 p-4 text-sm text-red-600 dark:text-red-400 animate-shake">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative mt-1.5 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none dark:text-slate-100 transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative mt-1.5 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 py-3 text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-primary-500 focus:outline-none dark:text-slate-100 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 focus:outline-none disabled:opacity-50 transition-all duration-200"
          >
            {loading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>Sign In</span>
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Redirect Link */}
        <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="font-bold text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
