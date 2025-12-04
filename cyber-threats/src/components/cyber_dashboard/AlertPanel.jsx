import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const alertMessages = [
    { type: 'CRITICAL', message: 'Unauthorized Root Access Detected' },
    { type: 'WARNING', message: 'Large Data Exfiltration Attempt' },
    { type: 'CRITICAL', message: 'Kernel Exploit Initiated from {IP}' },
    { type: 'INFO', message: 'New Firewall Rule Applied' },
    { type: 'CRITICAL', message: 'System Offline - Ransomware Attack' },
    { type: 'WARNING', message: 'High Volume Network Traffic from {IP}' },
    { type: 'CRITICAL', message: 'Authentication Bypass Exploit' },
];

const generateAlert = () => {
    const alertConfig = alertMessages[Math.floor(Math.random() * alertMessages.length)];
    let message = alertConfig.message;

    if (message.includes('{IP}')) {
        message = message.replace('{IP}', `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    }

    const colorClass = 
        alertConfig.type === 'CRITICAL' ? 'bg-red-700/80 border-red-500' :
        alertConfig.type === 'WARNING' ? 'bg-yellow-700/80 border-yellow-500' :
        'bg-blue-700/80 border-blue-500';

    const textClass = 
        alertConfig.type === 'CRITICAL' ? 'text-red-300' :
        alertConfig.type === 'WARNING' ? 'text-yellow-300' :
        'text-blue-300';

    return {
        id: Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type: alertConfig.type,
        message,
        colorClass,
        textClass,
    };
};

const AlertPanel = () => {
    const [currentAlert, setCurrentAlert] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance to generate a new alert
                setCurrentAlert(generateAlert());
            } else if (currentAlert) {
                setCurrentAlert(null); // Clear alert after some time if no new one
            }
        }, 3000); // Check for new alerts every 3 seconds

        return () => clearInterval(interval);
    }, [currentAlert]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">CRITICAL ALERTS</h3>
            <AnimatePresence>
                {currentAlert && (
                    <motion.div
                        key={currentAlert.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center border-2 ${currentAlert.colorClass}`}
                    >
                        <motion.h4 
                            className={`text-2xl font-bold ${currentAlert.textClass} mb-2`}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                        >
                            {currentAlert.type}
                        </motion.h4>
                        <p className="text-lg text-white mb-2">{currentAlert.message}</p>
                        <p className="text-sm text-gray-300">{currentAlert.timestamp}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AlertPanel;
