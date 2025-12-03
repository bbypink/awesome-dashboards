import React from 'react';

const MarketInfo = ({ label, value, colorClass = 'text-white' }) => (
    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
        <h2 className="text-gray-500 text-xs uppercase">{label}</h2>
        <p className={`text-lg font-mono font-semibold ${colorClass}`}>
            {value}
        </p>
    </div>
);

export default MarketInfo;