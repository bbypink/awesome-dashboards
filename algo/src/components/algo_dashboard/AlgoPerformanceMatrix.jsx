import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const algosData = [
    { id: 'AlphaHunter', sharpeRatio: 1.5, drawdown: 0.10, alpha: 0.02, beta: 0.8 },
    { id: 'TrendFollower', sharpeRatio: 0.8, drawdown: 0.25, alpha: -0.01, beta: 1.2 },
    { id: 'ArbSeeker', sharpeRatio: 2.1, drawdown: 0.05, alpha: 0.03, beta: 0.5 },
    { id: 'HFT_Scalper', sharpeRatio: 1.8, drawdown: 0.08, alpha: 0.015, beta: 1.0 },
];

const getMetricColorClass = (metric, value) => {
    switch (metric) {
        case 'sharpeRatio': return value >= 1 ? 'text-green-400' : 'text-yellow-400';
        case 'drawdown': return value <= 0.15 ? 'text-green-400' : (value <= 0.3 ? 'text-yellow-400' : 'text-red-400');
        case 'alpha': return value >= 0 ? 'text-green-400' : 'text-red-400';
        case 'beta': return 'text-blue-400'; // Beta is descriptive
        default: return 'text-gray-400';
    }
};

const MetricDisplay = ({ label, value, unit, metricType }) => {
    const [oldValue, setOldValue] = useState(value);
    const [flash, setFlash] = useState(false);

    useEffect(() => {
        if (value !== oldValue) {
            setFlash(true);
            const timer = setTimeout(() => setFlash(false), 300);
            setOldValue(value);
            return () => clearTimeout(timer);
        }
    }, [value, oldValue]);

    const bgColor = flash ? (value > oldValue ? 'bg-green-700/30' : 'bg-red-700/30') : 'bg-transparent';
    const textColor = getMetricColorClass(metricType, value);

    return (
        <motion.p 
            className={`flex justify-between items-center text-xs font-mono py-1 px-2 rounded ${textColor}`}
            initial={false}
            animate={{ backgroundColor: bgColor }}
            transition={{ duration: 0.1 }}
        >
            <span>{label}:</span>
            <span className="font-bold">{value.toFixed(2)}{unit}</span>
        </motion.p>
    );
};

const AlgoCard = ({ algo }) => {
    return (
        <div className="bg-black/50 border border-purple-500/20 rounded-lg p-4 flex flex-col justify-between">
            <h4 className="text-lg font-bold text-white mb-2">{algo.id}</h4>
            <div>
                <MetricDisplay label="Sharpe Ratio" value={algo.sharpeRatio} unit="" metricType="sharpeRatio" />
                <MetricDisplay label="Drawdown" value={algo.drawdown} unit="%" metricType="drawdown" />
                <MetricDisplay label="Alpha" value={algo.alpha} unit="%" metricType="alpha" />
                <MetricDisplay label="Beta" value={algo.beta} unit="" metricType="beta" />
            </div>
            {/* Simple progress bar for Drawdown */}
            <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                <motion.div
                    className="h-full rounded-full"
                    style={{ 
                        backgroundColor: algo.drawdown <= 0.15 ? '#10B981' : (algo.drawdown <= 0.3 ? '#F59E0B' : '#EF4444')
                    }}
                    animate={{ width: `${Math.min(100, algo.drawdown * 100 * 2)}%` }} // Scale drawdown to 0-100 range visually
                    transition={{ duration: 0.5 }}
                ></motion.div>
            </div>
        </div>
    );
};


const AlgoPerformanceMatrix = () => {
    const [algorithms, setAlgorithms] = useState(algosData);

    useEffect(() => {
        const interval = setInterval(() => {
            setAlgorithms(prevAlgos => prevAlgos.map(algo => ({
                ...algo,
                sharpeRatio: Math.max(0.5, Math.min(3.0, algo.sharpeRatio + (Math.random() - 0.5) * 0.2)),
                drawdown: Math.max(0.05, Math.min(0.5, algo.drawdown + (Math.random() - 0.5) * 0.05)),
                alpha: Math.max(-0.05, Math.min(0.05, algo.alpha + (Math.random() - 0.5) * 0.005)),
                beta: Math.max(0.5, Math.min(1.5, algo.beta + (Math.random() - 0.5) * 0.1)),
            })));
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-4 flex flex-col">
            <h3 className="text-xl font-bold text-purple-400 mb-4">ALGO PERFORMANCE MATRIX</h3>
            <div className="flex-grow grid grid-cols-2 gap-4 overflow-y-auto">
                {algorithms.map(algo => (
                    <AlgoCard key={algo.id} algo={algo} />
                ))}
            </div>
        </div>
    );
};

export default AlgoPerformanceMatrix;
