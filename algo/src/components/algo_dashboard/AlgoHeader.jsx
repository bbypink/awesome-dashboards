import React, { useState, useEffect } from 'react';

const AlgoHeader = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const [executionStatus, setExecutionStatus] = useState('OPTIMAL');
    const [fillRate, setFillRate] = useState(99.8);
    const [riskLevel, setRiskLevel] = useState('LOW');

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const dataInterval = setInterval(() => {
            // Simulate execution status
            const statuses = ['OPTIMAL', 'DEGRADED', 'CRITICAL'];
            setExecutionStatus(statuses[Math.floor(Math.random() * statuses.length)]);

            // Simulate fill rate
            setFillRate(prev => Math.max(90, Math.min(100, prev + (Math.random() - 0.5) * 2)));

            // Simulate risk level
            const riskStatuses = ['LOW', 'MEDIUM', 'HIGH'];
            setRiskLevel(riskStatuses[Math.floor(Math.random() * riskStatuses.length)]);
        }, 3000);
        return () => clearInterval(dataInterval);
    }, []);

    const StatusIndicator = ({ label, value, color }) => (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
            <span className="text-xs text-gray-400">{label}: <span className="font-bold">{value}</span></span>
        </div>
    );

    const getExecutionColor = (status) => {
        if (status === 'CRITICAL') return 'bg-red-500';
        if (status === 'DEGRADED') return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getRiskColor = (status) => {
        if (status === 'HIGH') return 'bg-red-500';
        if (status === 'MEDIUM') return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <header className="p-4 border-b border-cyan-500/50 flex justify-between items-center bg-black/50 backdrop-blur-sm relative z-10">
            <div>
                <h1 className="text-3xl font-bold text-green-400 drop-shadow-lg animate-pulse-fast">ALGO TRADING MONITOR</h1>
                <p className="text-sm text-cyan-400/70 mt-1">HIGH-FREQUENCY DATA & MICRO-MARKET INSIGHTS</p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                    <StatusIndicator label="EXECUTION" value={executionStatus} color={getExecutionColor(executionStatus)} />
                    <StatusIndicator label="FILL RATE" value={`${fillRate.toFixed(1)}%`} color="bg-blue-500" />
                    <StatusIndicator label="RISK" value={riskLevel} color={getRiskColor(riskLevel)} />
                </div>
                <div className="font-mono text-lg text-cyan-400/90">
                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()} UTC
                </div>
            </div>
        </header>
    );
};

export default AlgoHeader;
