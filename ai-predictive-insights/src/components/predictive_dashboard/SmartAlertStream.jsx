import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const alertTypes = ['Anomaly', 'Opportunity', 'Risk', 'Information'];
const nlpTags = ['Volatility', 'Liquidity', 'Fraud', 'Arbitrage', 'Trend', 'Sentiment', 'Macro', 'Micro'];
const alertMessages = [
    'Detected unusual market activity in {TAG1} sector.',
    'High {TAG2} signal for {TAG1} asset class.',
    'AI identifies potential {TAG3} opportunity in {TAG1}.',
    'System flags {TAG2} warning for platform {TAG1}.',
    'New {TAG3} event impacting {TAG1} value.',
    'Predicted {TAG2} shift in {TAG1} for next quarter.',
];

const generateSmartAlert = () => {
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    let message = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    const tags = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => nlpTags[Math.floor(Math.random() * nlpTags.length)]);
    
    message = message.replace('{TAG1}', tags[0] || 'Market');
    message = message.replace('{TAG2}', tags[1] || 'Activity');
    message = message.replace('{TAG3}', tags[2] || 'Event');

    const colorClass = 
        type === 'Anomaly' ? 'text-red-400' :
        type === 'Opportunity' ? 'text-green-400' :
        type === 'Risk' ? 'text-yellow-400' :
        'text-blue-400';

    return {
        id: Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        nlpTags: tags.slice(0, 2), // Keep up to 2 tags
        colorClass,
    };
};

const SmartAlertStream = () => {
    const [alerts, setAlerts] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setAlerts(prev => {
                const newAlert = generateSmartAlert();
                // Prepend new alert
                const updatedAlerts = [newAlert, ...prev];
                // Keep max 4 alerts in view, removing the oldest from the end
                return updatedAlerts.slice(0, 4); 
            });
        }, 1200); // New alert every 1.2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col p-2 bg-black/30 rounded-lg">
            <h3 className="text-xl font-bold text-blue-400 mb-4">AI ALERT STREAM</h3>
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
                                <div className="font-bold">{alert.timestamp} - {alert.type}</div>
                                <p className="text-gray-300">{alert.message}</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {alert.nlpTags.map((tag, index) => (
                                        <span key={index} className="px-1 py-0.5 bg-purple-600/50 rounded-full text-white text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default SmartAlertStream;
