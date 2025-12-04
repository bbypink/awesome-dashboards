import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const alertTypes = ['Momentum Shift', 'Liquidity Drain', 'Arbitrage Opp', 'Volatility Spike', 'Volume Anomaly'];
const assets = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSLA', 'NVDA'];

const generatePatternAlert = () => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    const message = `${type} detected in ${asset}`;

    const colorClass = 
        type === 'Momentum Shift' ? 'text-green-400' :
        type === 'Liquidity Drain' ? 'text-red-400' :
        type === 'Arbitrage Opp' ? 'text-blue-400' :
        'text-yellow-400';

    return {
        id: Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        colorClass,
    };
};

const PatternRecognitionAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setAlerts(prev => {
                const newAlert = generatePatternAlert();
                // Prepend new alert
                const updatedAlerts = [newAlert, ...prev];
                // Keep max 4 alerts in view, removing the oldest from the end
                return updatedAlerts.slice(0, 4); 
            });
        }, 1000); // New alert every 1 second

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col p-2 bg-black/30 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">PATTERN ALERTS</h3>
            <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col">
                    <AnimatePresence initial={false}>
                        {alerts.map(alert => (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, y: -20 }} // Enter from top
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }} // Exit to bottom
                                transition={{ duration: 0.5 }}
                                className={`text-xs p-1 ${alert.colorClass} border-b border-gray-700 last:border-b-0`}
                            >
                                <span className="font-bold mr-1">{alert.timestamp}</span>
                                <span>{alert.message}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default PatternRecognitionAlerts;
