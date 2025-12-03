import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useauthStore } from '../store/Authstore';
import { CircleUserRound, Mail, Lock } from 'lucide-react';

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useauthStore();

  const handleFormData = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await signup(formData);
  };

  return (
    <div data-theme="nord" className="min-h-screen flex items-center justify-center bg-base-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-base-100 shadow-xl rounded-2xl p-10 max-w-md w-full space-y-6"
      >
        {/* Header */}
        <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">
          Create Your Account
        </h2>

        {/* Full Name */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-white font-semibold text-lg">
            <CircleUserRound size={24} />
            Full Name
          </label>
          <input
            type='text'
            name='username'
            value={formData.username}
            onChange={handleFormData}
            placeholder='Suvani Basnet'
            disabled={isSigningUp}
            required
            className="input input-bordered w-full placeholder-white/30 text-white bg-base-200 border-teal-400 focus:border-teal-500 focus:ring focus:ring-teal-500/30"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-white font-semibold text-lg">
            <Mail size={24} />
            Email
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleFormData}
            placeholder='suvanibasnet@gmail.com'
            disabled={isSigningUp}
            required
            className="input input-bordered w-full placeholder-white/30 text-white bg-base-200 border-teal-400 focus:border-teal-500 focus:ring focus:ring-teal-500/30"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3 text-white font-semibold text-lg">
            <Lock size={24} />
            Password
          </label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleFormData}
            placeholder='supersecretsuvani'
            disabled={isSigningUp}
            required
            className="input input-bordered w-full placeholder-white/30 text-white bg-base-200 border-teal-400 focus:border-teal-500 focus:ring focus:ring-teal-500/30"
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={isSigningUp}
          className={`btn btn-primary w-full text-lg ${isSigningUp ? 'loading' : ''}`}
        >
          {isSigningUp ? "Creating account..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="mt-4 text-center text-teal-400 text-md">
          Already have an account?{" "}
          <Link to='/login' className="font-semibold hover:underline text-teal-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;