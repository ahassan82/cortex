import React from 'react';
import { Link } from 'react-router-dom';

const STATUS_STYLES = {
  approved: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const TYPE_COLORS = {
  component: 'bg-blue-500/20 text-blue-400',
  library: 'bg-purple-500/20 text-purple-400',
  template: 'bg-pink-500/20 text-pink-400',
  api: 'bg-orange-500/20 text-orange-400',
  tool: 'bg-teal-500/20 text-teal-400',
};

const ModuleCard = ({ module, showStatus = false }) => {
  const statusStyle = STATUS_STYLES[module.status] || STATUS_STYLES.pending;
  const typeColor = TYPE_COLORS[module.type] || 'bg-gray-500/20 text-gray-400';

  return (
    <Link
      to={`/modules/${module.id}`}
      className="block bg-dark-800 border border-dark-600 rounded-xl p-5 hover:border-brand-600/50 hover:shadow-lg hover:shadow-brand-900/20 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors line-clamp-1 flex-1">
          {module.title}
        </h3>
        {showStatus && (
          <span className={`badge border ${statusStyle} shrink-0 capitalize`}>
            {module.status}
          </span>
        )}
      </div>

      <p className="text-sm text-gray-400 line-clamp-2 mb-4 leading-relaxed">
        {module.description}
      </p>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className={`badge ${typeColor} capitalize`}>{module.type}</span>
        <span className="badge bg-dark-600 text-gray-300">{module.technology}</span>
        {module.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="badge bg-dark-600 text-gray-400">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {module.downloads.toLocaleString()}
          </span>
          {module.author && (
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {module.author.name}
            </span>
          )}
        </div>
        <span className={`font-bold ${module.price === 0 ? 'text-green-400' : 'text-brand-400'}`}>
          {module.price === 0 ? 'Free' : `$${module.price.toFixed(2)}`}
        </span>
      </div>
    </Link>
  );
};

export default ModuleCard;
