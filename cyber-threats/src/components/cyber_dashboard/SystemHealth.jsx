import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const systemMetrics = [
    { name: 'CPU Load', value: 0, max: 100 },
    { name: 'Memory Usage', value: 0, max: 100 },
    { name: 'Disk I/O', value: 0, max: 100 },
    { name: 'Network Throughput', value: 0, max: 100 },
];

const getMetricColor = (value, max) => {
    const percentage = (value / max) * 100;
    if (percentage > 80) return 'bg-red-500';
    if (percentage > 60) return 'bg-yellow-500';
    return 'bg-green-500';
};

const SystemHealthMeter = ({ name, value, max }) => {
    const percentage = (value / max) * 100;
    const color = getMetricColor(value, max);

    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-400">
                <span>{name}</span>
                <span>{value.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                <motion.div
                    className={`h-full rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
            </div>
        </div>
    );
};

const SystemHealth = () => {
    const [metrics, setMetrics] = useState(systemMetrics.map(m => ({ ...m, value: Math.random() * m.max })));

    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => 
                prev.map(metric => ({
                    ...metric,
                    value: Math.max(0, Math.min(metric.max, metric.value + (Math.random() - 0.5) * 20)) // Random walk
                }))
            );
        }, 1500); // Update every 1.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col p-2 bg-black/30 rounded-lg">
            <h3 className="text-xl font-bold text-green-500 mb-4">SYSTEM HEALTH</h3>
            <div className="flex-grow">
                {metrics.map(metric => (
                    <SystemHealthMeter key={metric.name} {...metric} />
                ))}
            </div>
        </div>
    );
};

export default SystemHealth;
