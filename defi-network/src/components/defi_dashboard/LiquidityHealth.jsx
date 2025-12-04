import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const poolsData = [
    { name: 'ETH-USDC', utilization: 0.75, apy: 0.08 },
    { name: 'DAI-USDT', utilization: 0.90, apy: 0.12 },
    { name: 'UNI-ETH', utilization: 0.60, apy: 0.05 },
    { name: 'AAVE-DAI', utilization: 0.82, apy: 0.10 },
];

const getGaugeColor = (value) => {
    if (value > 0.85) return '#FF0055'; // Red for high utilization
    if (value > 0.70) return '#FFFF00'; // Yellow for medium
    return '#00FFCC'; // Cyan for low/normal
};

const RadialGauge = ({ value, label, apy, color }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value * circumference);

    return (
        <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-700"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                />
                <motion.circle
                    className="transition-colors duration-500"
                    strokeWidth="8"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx="50%"
                    cy="50%"
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset: strokeDashoffset }}
                    transition={{ duration: 0.5 }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-white text-sm">
                <span className="font-bold text-lg">{ (value * 100).toFixed(0) }%</span>
                <span className="text-xs text-gray-400">{label}</span>
                {apy && <span className="text-xs text-green-400">APY: {(apy * 100).toFixed(1)}%</span>}
            </div>
        </div>
    );
};

const LiquidityHealth = () => {
    const [pools, setPools] = useState(poolsData.map(p => ({ ...p, utilization: Math.random() })));

    useEffect(() => {
        const interval = setInterval(() => {
            setPools(prev => prev.map(pool => ({
                ...pool,
                utilization: Math.max(0.2, Math.min(0.99, pool.utilization + (Math.random() - 0.5) * 0.1)),
                apy: Math.max(0.01, Math.min(0.20, pool.apy + (Math.random() - 0.5) * 0.01)),
            })));
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-4 flex flex-col">
            <h3 className="text-xl font-bold text-orange-400 mb-4">LIQUIDITY HEALTH</h3>
            <div className="flex flex-wrap justify-around items-center flex-grow">
                {pools.map(pool => (
                    <RadialGauge
                        key={pool.name}
                        label={pool.name}
                        value={pool.utilization}
                        apy={pool.apy}
                        color={getGaugeColor(pool.utilization)}
                    />
                ))}
            </div>
        </div>
    );
};

export default LiquidityHealth;
