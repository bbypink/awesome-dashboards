import React from 'react';

const NetworkStatistic = ({ label, value, unit, colorClass = 'text-green-300' }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg h-full border border-slate-700">
        <h2 className="text-slate-400 text-sm">{label}</h2>
        <p className={`text-3xl font-semibold font-mono transition-colors duration-500 ${colorClass}`}>
            {value}<span className="text-xl text-gray-400">{unit}</span>
        </p>
    </div>
);

export default NetworkStatistic;
