import React from 'react';

const PrimaryMetricDisplay = ({ label, value, change, flashClass }) => {
    const isPositive = change >= 0;
    
    return (
        <div className={`md:col-span-1 bg-gray-800/50 p-6 rounded-lg transition-all duration-500 ${flashClass}`}>
            <h2 className="text-gray-400 text-md mb-2">{label}</h2>
            <div className="flex items-baseline space-x-2">
                <span className={`text-5xl font-bold ${isPositive ? 'text-fuchsia-500' : 'text-blue-400'}`}>
                    {value.toFixed(2)}%
                </span>
                <span className={`text-xl font-semibold ${isPositive ? 'text-fuchsia-500' : 'text-blue-400'}`}>
                    {isPositive ? '▲' : '▼'} {change.toFixed(2)}
                </span>
            </div>
        </div>
    );
};

export default PrimaryMetricDisplay;