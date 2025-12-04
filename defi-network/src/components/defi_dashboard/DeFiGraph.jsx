import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const initialProtocols = [
    { id: 'Uniswap', tvl: 5.5, volume: 1.2, fees: 0.05, status: 'operational' },
    { id: 'Aave', tvl: 7.8, volume: 0.8, fees: 0.03, status: 'operational' },
    { id: 'Compound', tvl: 3.1, volume: 0.5, fees: 0.02, status: 'operational' },
    { id: 'MakerDAO', tvl: 4.2, volume: 0.3, fees: 0.01, status: 'operational' },
    { id: 'Curve', tvl: 6.0, volume: 1.5, fees: 0.06, status: 'operational' },
    { id: 'Balancer', tvl: 2.5, volume: 0.7, fees: 0.04, status: 'operational' },
];

const getStatusColor = (status) => {
    switch (status) {
        case 'warning': return 'border-yellow-500';
        case 'critical': return 'border-red-500';
        default: return 'border-green-500';
    }
};

const ProtocolCard = ({ protocol }) => {
    const borderColorClass = getStatusColor(protocol.status);
    const pulseVariant = protocol.status !== 'operational' ? {
        scale: [1, 1.03, 1],
        boxShadow: ["0 0 0px #00FF00", "0 0 8px #FFFF00", "0 0 0px #00FF00"]
    } : {};
    const pulseTransition = protocol.status !== 'operational' ? {
        repeat: Infinity, duration: 1.5, ease: "easeInOut"
    } : {};

    return (
        <motion.div
            className={`flex flex-col p-3 rounded-lg bg-black/50 border ${borderColorClass} backdrop-blur-sm`}
            // animate={pulseVariant} // Temporarily disabled
            // transition={pulseTransition} // Temporarily disabled
        >
            <h4 className="text-lg font-bold text-white mb-1">{protocol.id}</h4>
            <div className="text-xs text-gray-400">
                <p>TVL: <span className="text-green-400 font-bold">${protocol.tvl.toFixed(2)}B</span></p>
                <p>Volume (24h): <span className="text-blue-400 font-bold">${protocol.volume.toFixed(2)}B</span></p>
                <p>Fees (24h): <span className="text-orange-400 font-bold">${protocol.fees.toFixed(2)}M</span></p>
                <p>Status: <span className={`${getStatusColor(protocol.status).replace('border', 'text')}`}>{protocol.status.toUpperCase()}</span></p>
            </div>
        </motion.div>
    );
};

const DeFiGraph = () => {
    const [protocols, setProtocols] = useState(initialProtocols);

    useEffect(() => {
        const interval = setInterval(() => {
            setProtocols(prevProtocols => prevProtocols.map(p => {
                const newTvl = Math.max(1, p.tvl + (Math.random() - 0.5) * 0.5);
                const newVolume = Math.max(0.1, p.volume + (Math.random() - 0.5) * 0.1);
                const newFees = Math.max(0.01, p.fees + (Math.random() - 0.5) * 0.01);
                
                let newStatus = 'operational';
                if (Math.random() < 0.1) newStatus = 'warning'; // 10% chance for warning
                if (Math.random() < 0.03) newStatus = 'critical'; // 3% chance for critical

                return {
                    ...p,
                    tvl: newTvl,
                    volume: newVolume,
                    fees: newFees,
                    status: newStatus,
                };
            }));
        }, 2500); // Update every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-2 flex flex-col">
            <h3 className="text-xl font-bold text-blue-400 mb-4">DEFI PROTOCOL OVERVIEW</h3>
            <div className="flex-grow grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto overflow-x-hidden">
                {protocols.map(p => (
                    <ProtocolCard key={p.id} protocol={p} />
                ))}
            </div>
        </div>
    );
};

export default DeFiGraph;