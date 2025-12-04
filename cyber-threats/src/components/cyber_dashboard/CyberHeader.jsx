import React, { useState, useEffect } from 'react';

const CyberHeader = () => {
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
        <header className="p-4 border-b border-purple-500/50 flex justify-between items-center bg-black/50 backdrop-blur-sm">
            <div>
                <h1 className="text-3xl font-bold text-green-400 drop-shadow-lg animate-pulse-fast">CYBERNETIC THREAT MONITOR</h1>
                <p className="text-sm text-purple-400/70 mt-1">SECURE NETWORK OPERATIONS // INITIATING PROTOCOL GREEN</p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                    <StatusIndicator label="NETWORK" status="ONLINE" color="bg-green-500" />
                    <StatusIndicator label="FIREWALL" status="ACTIVE" color="bg-yellow-500" />
                    <StatusIndicator label="THREAT LEVEL" status="MODERATE" color="bg-orange-500" />
                </div>
                <div className="font-mono text-lg text-purple-400/90">
                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()} UTC
                </div>
            </div>
        </header>
    );
};

export default CyberHeader;
