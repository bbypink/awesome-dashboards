import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const transactionTypes = ['Swap', 'Borrow', 'Supply', 'Withdraw', 'Liquidation'];
const defiAssets = ['ETH', 'DAI', 'USDC', 'UNI', 'AAVE', 'COMP'];

const generateTransaction = () => {
    const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const asset1 = defiAssets[Math.floor(Math.random() * defiAssets.length)];
    let asset2 = defiAssets[Math.floor(Math.random() * defiAssets.length)];
    while (asset1 === asset2 && type === 'Swap') { // Ensure different assets for swaps
        asset2 = defiAssets[Math.floor(Math.random() * defiAssets.length)];
    }

    const amount = (Math.random() * 1000).toFixed(2);
    let message = '';
    let colorClass = '';

    switch (type) {
        case 'Swap':
            message = `SWAP ${amount} ${asset1} for ${asset2}`;
            colorClass = 'text-blue-400';
            break;
        case 'Borrow':
            message = `BORROW ${amount} ${asset1}`;
            colorClass = 'text-red-400';
            break;
        case 'Supply':
            message = `SUPPLY ${amount} ${asset1}`;
            colorClass = 'text-green-400';
            break;
        case 'Withdraw':
            message = `WITHDRAW ${amount} ${asset1}`;
            colorClass = 'text-yellow-400';
            break;
        case 'Liquidation':
            message = `LIQUIDATION of ${amount} ${asset1}`;
            colorClass = 'text-purple-400';
            break;
        default:
            message = `UNKNOWN ${amount} ${asset1}`;
            colorClass = 'text-gray-400';
    }

    return {
        id: Math.random(),
        timestamp: new Date().toLocaleTimeString(),
        type,
        message,
        colorClass,
    };
};

const TransactionStream = () => {
    const [transactions, setTransactions] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const interval = setInterval(() => {
            setTransactions(prev => {
                const newTx = generateTransaction();
                // Prepend new transaction
                const updatedTxs = [newTx, ...prev];
                // Keep max 6 transactions in view, removing the oldest from the end
                return updatedTxs.slice(0, 6); 
            });
        }, 700); // New transaction every 0.7 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full flex flex-col p-2 bg-black/30 rounded-lg">
            <h3 className="text-xl font-bold text-green-400 mb-4">TRANSACTION STREAM</h3>
            <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
                <div className="flex flex-col">
                    <AnimatePresence initial={false}>
                        {transactions.map(tx => (
                            <motion.div
                                key={tx.id}
                                initial={{ opacity: 0, y: -20 }} // Enter from top
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }} // Exit to bottom
                                transition={{ duration: 0.5 }}
                                className={`text-xs p-1 ${tx.colorClass} border-b border-gray-700 last:border-b-0`}
                            >
                                <span className="font-bold mr-1">{tx.timestamp}</span>
                                <span>{tx.message}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TransactionStream;
