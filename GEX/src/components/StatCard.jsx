import React from 'react';

const StatCard = ({ label, value }) => (
    <div className="bg-gray-800/50 p-6 rounded-lg">
        <h2 className="text-gray-400 text-md mb-2">{label}</h2>
        <p className="text-3xl font-semibold text-gray-100">{value}</p>
    </div>
);

export default StatCard;
