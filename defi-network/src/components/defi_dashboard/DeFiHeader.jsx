import React, { useState, useEffect } from 'react';

const DeFiHeader = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const [tvl, setTvl] = useState(120);
    const [volume, setVolume] = useState(5);
    const [gas, setGas] = useState(25);

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const dataInterval = setInterval(() => {
            setTvl(prev => Math.max(100, prev + (Math.random() - 0.5) * 5));
            setVolume(prev => Math.max(3, prev + (Math.random() - 0.5) * 1));
            setGas(prev => Math.max(15, Math.min(60, prev + (Math.random() - 0.5) * 5)));
        }, 3000);
        return () => clearInterval(dataInterval);
    }, []);

    const StatusIndicator = ({ label, value, unit, color }) => (
        <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
            <span className="text-xs text-gray-400">{label}: <span className="font-bold">{value}{unit}</span></span>
        </div>
    );

    return (
        <header className="p-4 border-b border-orange-500/50 flex justify-between items-center bg-black/50 backdrop-blur-sm relative z-10">
            <div>
                <h1 className="text-3xl font-bold text-green-400 drop-shadow-lg animate-pulse-fast">DEFI NETWORK OVERVIEW</h1>
                <p className="text-sm text-blue-400/70 mt-1">REAL-TIME PROTOCOL INSIGHTS & LIQUIDITY FLOW</p>
            </div>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                    <StatusIndicator label="TVL" value={`$${tvl.toFixed(0)}`} unit="B" color="bg-green-500" />
                    <StatusIndicator label="VOLUME" value={`$${volume.toFixed(1)}`} unit="B" color="bg-orange-500" />
                    <StatusIndicator label="GAS" value={gas.toFixed(0)} unit=" Gwei" color="bg-purple-500" />
                </div>
                <div className="font-mono text-lg text-blue-400/90">
                    {dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()} UTC
                </div>
            </div>
        </header>
    );
};

export default DeFiHeader;
