import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

const STATUS_STYLES = {
  approved: 'bg-green-500/20 text-green-400 border border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  rejected: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

const TYPE_COLORS = {
  component: 'bg-blue-500/20 text-blue-400',
  library: 'bg-purple-500/20 text-purple-400',
  template: 'bg-pink-500/20 text-pink-400',
  api: 'bg-orange-500/20 text-orange-400',
  tool: 'bg-teal-500/20 text-teal-400',
};

const ModuleDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    client.get(`/modules/${id}`)
      .then((res) => setModule(res.data.data.module))
      .catch(() => setError('Module not found or failed to load.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this module permanently?')) return;
    try {
      await client.delete(`/modules/${id}`);
      navigate('/dashboard');
    } catch {
      alert('Failed to delete module.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-white mb-2">Module not found</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const isOwner = user?.id === module.authorId;
  const typeColor = TYPE_COLORS[module.type] || 'bg-gray-500/20 text-gray-400';
  const statusStyle = STATUS_STYLES[module.status] || STATUS_STYLES.pending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title + badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${typeColor} capitalize`}>{module.type}</span>
              <span className="badge bg-dark-600 text-gray-300">{module.technology}</span>
              <span className={`badge ${statusStyle} capitalize`}>{module.status}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">{module.title}</h1>
            <p className="text-gray-400 leading-relaxed">{module.description}</p>
          </div>

          {/* Tags */}
          {module.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {module.tags.map((tag) => (
                <span key={tag} className="badge bg-dark-600 text-gray-400">#{tag}</span>
              ))}
            </div>
          )}

          {/* Links */}
          <div className="card space-y-3">
            <h3 className="font-semibold text-white text-sm uppercase tracking-wider text-gray-400">Resources</h3>
            {module.githubUrl && (
              <a
                href={module.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-white">GitHub Repository</p>
                  <p className="text-xs text-gray-400 truncate">{module.githubUrl}</p>
                </div>
                <svg className="w-4 h-4 text-gray-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
            {module.fileUrl && (
              <a
                href={module.fileUrl}
                className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors group"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <p className="text-sm font-medium text-white">Download File</p>
              </a>
            )}
            {!module.githubUrl && !module.fileUrl && (
              <p className="text-sm text-gray-500">No resources attached yet.</p>
            )}
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 border border-red-700/50 rounded-lg hover:bg-red-900/30 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Module
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price */}
          <div className="card text-center">
            <p className="text-4xl font-extrabold mb-1">
              {module.price === 0
                ? <span className="text-green-400">Free</span>
                : <span className="text-brand-400">${module.price.toFixed(2)}</span>
              }
            </p>
            <p className="text-gray-500 text-sm mb-4">per download</p>
            {module.status === 'approved' ? (
              <button className="btn-primary w-full">
                {module.price === 0 ? 'Download Free' : 'Purchase & Download'}
              </button>
            ) : (
              <div className="p-3 bg-yellow-900/30 border border-yellow-700/30 rounded-lg text-yellow-300 text-sm">
                Under review — not yet available
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="card space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Downloads</span>
              <span className="text-white font-semibold">{module.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Published</span>
              <span className="text-white font-semibold">
                {new Date(module.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Updated</span>
              <span className="text-white font-semibold">
                {new Date(module.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Author */}
          {module.author && (
            <div className="card">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Author</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold">
                  {module.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white">{module.author.name}</p>
                  <p className="text-xs text-gray-500">Score: ⭐ {module.author.score}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
