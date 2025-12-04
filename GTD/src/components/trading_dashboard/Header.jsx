import React, { useState, useEffect } from 'react';

const Header = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const StatusIndicator = ({ label }) => (
        <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-xs text-gray-400">{label}</span>
        </div>
    );

    return (
        <header className="p-4 border-b border-cyan-300/20 flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-cyan-300/90">G.T.D. / GLOBAL TRADE DASHBOARD</h1>
                <p className="text-xs text-gray-500">SYSTEM INTERFACE VER. 2.8.1</p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                    <StatusIndicator label="MARKETS: OPEN" />
                    <StatusIndicator label="DATA-STREAM: LIVE" />
                    <StatusIndicator label="SYSTEM: NOMINAL" />
                </div>
                <div className="font-mono text-lg text-cyan-300/90">
                    {time.toLocaleTimeString()} UTC
                </div>
            </div>
        </header>
    );
};

export default Header;
