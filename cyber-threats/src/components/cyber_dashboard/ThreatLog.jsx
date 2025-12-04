import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const threatTypes = ['ATTACK', 'WARNING', 'INFO'];
const threatMessages = [
    'DDoS attack detected from {IP}',
    'Unusual login attempt from {IP}',
    'Malware signature match on {SERVER}',
    'Port scan detected from {IP}',
    'Firewall rule updated on {SERVER}',
    'System integrity check: PASSED on {SERVER}',
    'Unauthorized access attempt: {IP}',
    'Suspicious activity: {SERVER} to {IP}',
];

const generateThreat = () => {
    const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    let message = threatMessages[Math.floor(Math.random() * threatMessages.length)];
    
    // Replace placeholders
    if (message.includes('{IP}')) {
        message = message.replace('{IP}', `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
    }
    if (message.includes('{SERVER}')) {
        message = message.replace('{SERVER}', `SRV-${Math.floor(Math.random() * 999)}`);
    }

    const colorClass = 
        type === 'ATTACK' ? 'text-red-400' :
        type === 'WARNING' ? 'text-yellow-400' :
        'text-green-400';

    return {
        id: Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        colorClass,
    };
};

const ThreatLog = () => {
    const [threats, setThreats] = useState([]);
    const scrollRef = useRef(); // scrollRef is needed for ref={scrollRef} in JSX

    useEffect(() => {
        const interval = setInterval(() => {
            setThreats(prev => {
                const newThreat = generateThreat();
                // Prepend new threat
                const updatedThreats = [newThreat, ...prev];
                // Keep max 4 threats in view, removing the oldest from the end
                return updatedThreats.slice(0, 4); 
            });
        }, 800); // New threat every 0.8 seconds

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom on new threats is removed
    // useEffect(() => {
    //     if (scrollRef.current) {
    //         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    //     }
    // }, [threats]);

    return (
        <div className="w-full h-full flex flex-col p-2 bg-black/30 rounded-lg">
            <h3 className="text-xl font-bold text-red-500 mb-4">THREAT LOG</h3>
            <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col flex-grow min-h-0">
                    <AnimatePresence initial={false}>
                        {threats.map(threat => (
                            <motion.div
                                key={threat.id}
                                initial={{ opacity: 0, y: -20 }} // Enter from top
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }} // Exit to bottom
                                transition={{ duration: 0.5 }}
                                className={`text-xs p-1 ${threat.colorClass} flex items-center space-x-2`}
                            >
                                <span className="font-bold">{threat.timestamp}</span>
                                <span className="text-gray-500">[{threat.type}]</span>
                                <span>{threat.message}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ThreatLog;
