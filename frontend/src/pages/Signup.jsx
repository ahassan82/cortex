import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    skills: '',
    githubUrl: '',
    avatarUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.githubUrl && !/^https?:\/\//.test(form.githubUrl)) errs.githubUrl = 'Must be a valid URL';
    if (form.avatarUrl && !/^https?:\/\//.test(form.avatarUrl)) errs.avatarUrl = 'Must be a valid URL';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await client.post('/auth/signup', form);
      const { token, user } = res.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Join Cortex and start earning from your code</p>
        </div>

        <div className="card">
          {serverError && (
            <div className="mb-5 p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Name */}
            <div>
              <label className="label" htmlFor="name">Full Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label" htmlFor="email">Email *</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label" htmlFor="password">Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={form.password}
                onChange={handleChange}
                className={`input-field ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="label" htmlFor="bio">Bio <span className="text-gray-500 font-normal">(optional)</span></label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="Tell us a bit about yourself and your expertise..."
                value={form.bio}
                onChange={handleChange}
                className="input-field resize-none"
              />
            </div>

            {/* Skills */}
            <div>
              <label className="label" htmlFor="skills">
                Skills <span className="text-gray-500 font-normal">(optional, comma-separated)</span>
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="React, Node.js, TypeScript, Python..."
                value={form.skills}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className="label" htmlFor="githubUrl">
                GitHub URL <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/yourusername"
                value={form.githubUrl}
                onChange={handleChange}
                className={`input-field ${errors.githubUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.githubUrl && <p className="mt-1 text-xs text-red-400">{errors.githubUrl}</p>}
            </div>

            {/* Avatar URL */}
            <div>
              <label className="label" htmlFor="avatarUrl">
                Avatar URL <span className="text-gray-500 font-normal">(optional)</span>
              </label>
              <input
                id="avatarUrl"
                name="avatarUrl"
                type="url"
                placeholder="https://github.com/yourusername.png"
                value={form.avatarUrl}
                onChange={handleChange}
                className={`input-field ${errors.avatarUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.avatarUrl && <p className="mt-1 text-xs text-red-400">{errors.avatarUrl}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
