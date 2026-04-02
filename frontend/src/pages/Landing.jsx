import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModuleCard from '../components/ModuleCard';
import client from '../api/client';

const FEATURES = [
  {
    icon: '💰',
    title: 'Earn Passive Income',
    desc: 'Upload your modules once and earn every time a developer downloads or purchases them.',
  },
  {
    icon: '🚀',
    title: 'Instant Distribution',
    desc: 'Reach thousands of developers instantly. No marketing needed — just great code.',
  },
  {
    icon: '⭐',
    title: 'Get Scored & Mentored',
    desc: 'Our team reviews your work, gives you a quality score, and offers mentorship to help you grow.',
  },
  {
    icon: '🔒',
    title: 'Secure Transactions',
    desc: 'Every purchase is handled securely. Your earnings are always protected.',
  },
  {
    icon: '🛠️',
    title: 'All Tech Stacks',
    desc: 'React, Vue, Node, Python and more. We support every major technology stack.',
  },
  {
    icon: '🤝',
    title: 'Community First',
    desc: 'Join a thriving community of developers. Collaborate, learn, and grow together.',
  },
];

const Landing = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/modules?limit=6')
      .then((res) => setModules(res.data.data?.modules || []))
      .catch(() => setModules([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/30 via-dark-900 to-dark-900 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-900/50 border border-brand-700/50 rounded-full px-4 py-1.5 text-sm text-brand-300 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            The Developer Marketplace is now live
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Build once.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">
              Earn forever.
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Cortex is the marketplace for developers to sell modules, components, and tools — and for teams
            to find production-ready building blocks instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-primary text-base px-8 py-3">
                  Go to Dashboard
                </Link>
                <Link to="/upload" className="btn-secondary text-base px-8 py-3">
                  Upload a Module
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-base px-8 py-3">
                  Start Selling Today
                </Link>
                <Link to="/login" className="btn-secondary text-base px-8 py-3">
                  Browse Marketplace
                </Link>
              </>
            )}
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p>Modules</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">2,000+</p>
              <p>Developers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">$50k+</p>
              <p>Paid Out</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-dark-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Why developers choose Cortex</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Everything you need to monetize your code and build your developer brand.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-dark-800 border border-dark-600 rounded-xl p-6 hover:border-brand-600/50 transition-colors"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Modules */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Latest Modules</h2>
              <p className="text-gray-400">Freshly approved modules from our community</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-dark-800 border border-dark-600 rounded-xl p-5 animate-pulse">
                  <div className="h-5 bg-dark-600 rounded mb-3 w-3/4" />
                  <div className="h-3 bg-dark-600 rounded mb-2 w-full" />
                  <div className="h-3 bg-dark-600 rounded mb-4 w-2/3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-dark-600 rounded-full w-16" />
                    <div className="h-5 bg-dark-600 rounded-full w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : modules.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((m) => <ModuleCard key={m.id} module={m} />)}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-lg">No modules yet. Be the first to upload!</p>
              <Link to="/signup" className="inline-block mt-4 btn-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-20 px-4 bg-gradient-to-r from-brand-900/40 to-dark-800/60">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to start earning?</h2>
            <p className="text-gray-400 mb-8 text-lg">
              Join thousands of developers who are already monetizing their work on Cortex.
            </p>
            <Link to="/signup" className="btn-primary text-base px-10 py-3">
              Create Free Account
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-dark-600 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-brand-500 to-brand-700 rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
              </svg>
            </div>
            <span className="font-semibold text-gray-400">Cortex</span>
          </div>
          <p>© {new Date().getFullYear()} Cortex. Developer Marketplace.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
