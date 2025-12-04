import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const assets = [
    'FX', 'IX', 'UX', 'VX', 'NX', 'LX', 'AX', 'MX',
    'RX', 'SX', 'DX', 'CX', 'PX', 'QX', 'EX', 'TX',
    'GX', 'HX', 'JX', 'KX', 'ZX', 'WX', 'YX', 'BX'
];

const getVolatilityColor = (volatility) => {
    if (volatility > 85) return 'bg-red-500/50';
    if (volatility > 65) return 'bg-orange-500/50';
    if (volatility > 45) return 'bg-yellow-500/50';
    return 'bg-green-500/50';
};

const VolatilityCell = ({ asset }) => {
    const [volatility, setVolatility] = useState(Math.random() * 100);

    useEffect(() => {
        const interval = setInterval(() => {
            setVolatility(Math.random() * 100);
        }, 1000 + Math.random() * 2000); // Stagger updates

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className={`rounded-md p-2 flex flex-col items-center justify-center text-white ${getVolatilityColor(volatility)} transition-colors duration-500`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-sm font-bold">{asset}</div>
            <div className="text-lg font-mono">{volatility.toFixed(2)}</div>
        </motion.div>
    );
};

const VolatilityMatrix = () => {
    return (
        <div className="w-full h-full">
            <h3 className="text-cyan-300/80 text-sm font-bold mb-2">MARKET VOLATILITY</h3>
            <div className="grid grid-cols-4 grid-rows-6 gap-2 h-full">
                {assets.map(asset => (
                    <VolatilityCell key={asset} asset={asset} />
                ))}
            </div>
        </div>
    );
};

export default VolatilityMatrix;
