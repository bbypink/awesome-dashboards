import React, { useState, useEffect } from 'react';

const PredictiveHeader = () => {
    const [dateTime, setDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const StatusIndicator = ({ label, status, color }) => (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
            <span className="text-xs text-gray-400">{label}: <span className="font-bold">{status}</span></span>
        </div>
    );

    return (
        <header className="p-4 border-b border-blue-500/50 flex justify-between items-center bg-black/50 backdrop-blur-sm relative z-10">
            <div>
                <h1 className="text-3xl font-bold text-blue-400 drop-shadow-lg animate-pulse-fast">AI PREDICTIVE INSIGHTS</h1>
                <p className="text-sm text-purple-400/70 mt-1">REAL-TIME MARKET ANOMALY DETECTION</p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                    <StatusIndicator label="MODEL" status="ACTIVE" color="bg-green-500" />
                    <StatusIndicator label="DATA FLOW" status="OPTIMAL" color="bg-blue-500" />
                    <StatusIndicator label="ACCURACY" status="98.7%" color="bg-purple-500" />
                </div>
                <div className="font-mono text-lg text-blue-400/90">
                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()} UTC
                </div>
            </div>
        </header>
    );
};

export default PredictiveHeader;
