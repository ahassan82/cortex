import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import StatCard from '../components/StatCard';
import ModuleCard from '../components/ModuleCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await client.get('/modules/my');
      setModules(res.data.data.modules);
      setStats(res.data.data.stats);
    } catch (err) {
      setError('Failed to load your modules. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await client.delete(`/modules/${id}`);
      setModules((prev) => prev.filter((m) => m.id !== id));
      if (stats) {
        setStats((prev) => ({
          ...prev,
          totalModules: prev.totalModules - 1,
        }));
      }
    } catch {
      alert('Failed to delete module.');
    }
  };

  const skills = user?.skills || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-brand-600/50 shadow-lg"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p className="text-gray-400 text-sm">{user?.email}</p>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {skills.slice(0, 5).map((skill) => (
                  <span key={skill} className="badge bg-brand-900/60 text-brand-300 border border-brand-700/50">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <Link to="/upload" className="btn-primary flex items-center gap-2 shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Module
        </Link>
      </div>

      {/* Bio */}
      {user?.bio && (
        <div className="mb-8 p-4 bg-dark-800 border border-dark-600 rounded-xl">
          <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
          {user.githubUrl && (
            <a
              href={user.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 text-sm text-brand-400 hover:text-brand-300"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              GitHub Profile
            </a>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Total Modules"
          value={stats?.totalModules ?? 0}
          icon="📦"
          color="brand"
        />
        <StatCard
          label="Total Earnings"
          value={`$${(stats?.totalEarnings ?? 0).toFixed(2)}`}
          icon="💰"
          color="green"
        />
        <StatCard
          label="Total Downloads"
          value={(stats?.totalDownloads ?? 0).toLocaleString()}
          icon="⬇️"
          color="blue"
        />
        <StatCard
          label="Your Score"
          value={user?.score ?? 0}
          icon="⭐"
          color="yellow"
        />
      </div>

      {/* Modules section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white">Your Modules</h2>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            {stats && (
              <>
                <span className="text-green-400">{stats.approvedModules} approved</span>
                <span className="text-yellow-400">{stats.pendingModules} pending</span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm mb-6">
            {error}
            <button onClick={fetchData} className="ml-3 underline hover:no-underline">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-5 animate-pulse">
                <div className="h-5 bg-dark-600 rounded mb-3 w-3/4" />
                <div className="h-3 bg-dark-600 rounded mb-2" />
                <div className="h-3 bg-dark-600 rounded mb-4 w-2/3" />
                <div className="h-8 bg-dark-600 rounded" />
              </div>
            ))}
          </div>
        ) : modules.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-dark-500 rounded-2xl">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-white mb-2">No modules yet</h3>
            <p className="text-gray-400 mb-6">Upload your first module and start earning!</p>
            <Link to="/upload" className="btn-primary">
              Upload Your First Module
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => (
              <div key={m.id} className="relative group">
                <ModuleCard module={m} showStatus />
                {/* Action overlay */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(m.id); }}
                    className="p-1.5 bg-red-900/80 hover:bg-red-700 text-red-300 hover:text-white rounded-lg transition-colors"
                    title="Delete module"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
