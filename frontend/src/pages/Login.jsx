import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useauthStore } from '../store/Authstore';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login, isLoggingIn } = useauthStore();

  const handleFormData = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  const inputClasses =
    "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/60 focus:border-dirty-blue-300 focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-dirty-blue-900 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-2xl border border-white/10 bg-dirty-blue-900/70 p-8 text-white backdrop-blur-sm"
      >
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="text-sm text-white/70">Sign in to continue chatting.</p>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm font-semibold text-white">
            <Mail size={20} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormData}
            disabled={isLoggingIn}
            required
            className={inputClasses}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 text-sm font-semibold text-white">
            <Lock size={20} />
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleFormData}
            disabled={isLoggingIn}
            required
            className={inputClasses}
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
          className="w-full rounded-xl bg-dirty-blue-600 py-3 font-semibold text-white transition-colors hover:bg-dirty-blue-500 disabled:opacity-60"
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>

        <div className="space-y-3 text-center text-sm">
          <Link to="/forgot-password" className="text-white/80 underline-offset-2 hover:underline">
            Forgot password?
          </Link>
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-dirty-blue-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
