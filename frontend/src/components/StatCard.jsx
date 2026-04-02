import React from 'react';

const StatCard = ({ label, value, icon, color = 'brand', suffix = '' }) => {
  const colorMap = {
    brand: 'from-brand-600/20 to-brand-800/10 border-brand-600/30 text-brand-400',
    green: 'from-green-600/20 to-green-800/10 border-green-600/30 text-green-400',
    blue: 'from-blue-600/20 to-blue-800/10 border-blue-600/30 text-blue-400',
    yellow: 'from-yellow-600/20 to-yellow-800/10 border-yellow-600/30 text-yellow-400',
    purple: 'from-purple-600/20 to-purple-800/10 border-purple-600/30 text-purple-400',
  };

  const cls = colorMap[color] || colorMap.brand;

  return (
    <div className={`bg-gradient-to-br ${cls} border rounded-xl p-5`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">
            {value}
            {suffix && <span className="text-base font-medium text-gray-300 ml-1">{suffix}</span>}
          </p>
        </div>
        {icon && (
          <div className="text-2xl opacity-80">{icon}</div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
