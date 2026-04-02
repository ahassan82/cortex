import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';

const MODULE_TYPES = ['component', 'library', 'template', 'api', 'tool'];
const TECHNOLOGIES = [
  'react', 'vue', 'angular', 'svelte', 'node', 'python', 'go', 'rust',
  'typescript', 'javascript', 'php', 'ruby', 'java', 'dotnet', 'other',
];

const UploadModule = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    technology: '',
    tags: '',
    price: '0',
    githubUrl: '',
  });
  const [file, setFile] = useState(null);
  const [uploadMode, setUploadMode] = useState('github'); // 'github' | 'file'
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
    if (!form.type) errs.type = 'Please select a type';
    if (!form.technology) errs.technology = 'Please select a technology';
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) errs.price = 'Enter a valid price (0 or more)';
    if (uploadMode === 'github') {
      if (!form.githubUrl.trim()) errs.githubUrl = 'GitHub URL is required';
      else if (!/^https?:\/\//.test(form.githubUrl)) errs.githubUrl = 'Must be a valid URL';
    } else {
      if (!file) errs.file = 'Please select a file to upload';
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setServerError('');

    try {
      const formData = new FormData();
      formData.append('title', form.title.trim());
      formData.append('description', form.description.trim());
      formData.append('type', form.type);
      formData.append('technology', form.technology);
      formData.append('price', form.price);
      if (form.tags.trim()) formData.append('tags', form.tags.trim());
      if (uploadMode === 'github') {
        formData.append('githubUrl', form.githubUrl.trim());
      } else if (file) {
        formData.append('file', file);
      }

      await client.post('/modules', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to upload module. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Module Submitted!</h2>
          <p className="text-gray-400">Your module is pending review. You'll be redirected to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Upload a Module</h1>
        <p className="text-gray-400">Share your work with the Cortex community and start earning.</p>
      </div>

      <div className="card">
        {serverError && (
          <div className="mb-5 p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-red-300 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Title */}
          <div>
            <label className="label" htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="My Awesome React Component"
              value={form.title}
              onChange={handleChange}
              className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label" htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Describe what your module does, how to use it, and what problems it solves..."
              value={form.description}
              onChange={handleChange}
              className={`input-field resize-none ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
          </div>

          {/* Type + Technology */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="type">Type *</label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className={`input-field capitalize ${errors.type ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select type...</option>
                {MODULE_TYPES.map((t) => (
                  <option key={t} value={t} className="capitalize bg-dark-800">{t}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-400">{errors.type}</p>}
            </div>

            <div>
              <label className="label" htmlFor="technology">Technology *</label>
              <select
                id="technology"
                name="technology"
                value={form.technology}
                onChange={handleChange}
                className={`input-field capitalize ${errors.technology ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select technology...</option>
                {TECHNOLOGIES.map((t) => (
                  <option key={t} value={t} className="capitalize bg-dark-800">{t}</option>
                ))}
              </select>
              {errors.technology && <p className="mt-1 text-xs text-red-400">{errors.technology}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="label" htmlFor="tags">
              Tags <span className="text-gray-500 font-normal">(comma-separated)</span>
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="ui, form, validation, hooks..."
              value={form.tags}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Price */}
          <div>
            <label className="label" htmlFor="price">Price (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                className={`input-field pl-8 ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Set to 0 for a free module</p>
            {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
          </div>

          {/* Upload mode toggle */}
          <div>
            <label className="label">Source *</label>
            <div className="flex rounded-lg overflow-hidden border border-dark-400">
              <button
                type="button"
                onClick={() => setUploadMode('github')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  uploadMode === 'github'
                    ? 'bg-brand-600 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                GitHub URL
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  uploadMode === 'file'
                    ? 'bg-brand-600 text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                File Upload
              </button>
            </div>
          </div>

          {/* GitHub URL */}
          {uploadMode === 'github' && (
            <div>
              <label className="label" htmlFor="githubUrl">GitHub Repository URL *</label>
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/username/repo"
                value={form.githubUrl}
                onChange={handleChange}
                className={`input-field ${errors.githubUrl ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.githubUrl && <p className="mt-1 text-xs text-red-400">{errors.githubUrl}</p>}
            </div>
          )}

          {/* File Upload */}
          {uploadMode === 'file' && (
            <div>
              <label className="label" htmlFor="file">Upload File *</label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors
                  ${errors.file ? 'border-red-500/60' : 'border-dark-400 hover:border-brand-500/60'}
                  ${file ? 'border-brand-600/60 bg-brand-900/10' : 'bg-dark-700/30'}
                `}
                onClick={() => document.getElementById('file').click()}
              >
                <input
                  id="file"
                  name="file"
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept=".zip,.tar,.gz,.js,.ts,.json,.md,.txt"
                  onChange={handleFileChange}
                />
                {file ? (
                  <div>
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div>
                    <div className="text-3xl mb-2">📁</div>
                    <p className="text-sm text-gray-300 font-medium">Click to select file</p>
                    <p className="text-xs text-gray-500 mt-1">Accepts .zip, .tar, .gz, .js, .ts, .json, .md, .txt (max 50MB)</p>
                  </div>
                )}
              </div>
              {errors.file && <p className="mt-1 text-xs text-red-400">{errors.file}</p>}
            </div>
          )}

          {/* Info notice */}
          <div className="flex gap-3 p-3 bg-brand-900/30 border border-brand-700/40 rounded-lg text-sm text-brand-300">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              All modules are reviewed by the Cortex team before being published. This usually takes 1-2 business days.
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : 'Submit Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModule;
