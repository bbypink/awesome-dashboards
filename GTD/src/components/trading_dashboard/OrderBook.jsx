import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateOrder = (isBid = true) => {
    const price = 170 + Math.random() * 10 - (isBid ? 0 : 5);
    const amount = Math.random() * 5;
    return {
        price: price.toFixed(2),
        amount: amount.toFixed(4),
        total: (price * amount).toFixed(2),
        id: Math.random()
    };
};

const OrderBook = () => {
    const [bids, setBids] = useState(Array.from({ length: 15 }, () => generateOrder(true)));
    const [asks, setAsks] = useState(Array.from({ length: 15 }, () => generateOrder(false)));

    useEffect(() => {
        const interval = setInterval(() => {
            // Update Bids
            setBids(prev => {
                const newBids = [...prev];
                if (newBids.length > 20) newBids.shift();
                newBids.push(generateOrder(true));
                return newBids.sort((a, b) => b.price - a.price);
            });

            // Update Asks
            setAsks(prev => {
                const newAsks = [...prev];
                if (newAsks.length > 20) newAsks.shift();
                newAsks.push(generateOrder(false));
                return newAsks.sort((a, b) => a.price - b.price);
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const renderRow = (order, isBid) => {
        const barWidth = `${Math.min((order.amount / 5) * 100, 100)}%`;
        const barColor = isBid ? 'bg-green-500/20' : 'bg-red-500/20';

        return (
            <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center text-xs p-1 relative"
            >
                <div
                    className={`absolute top-0 left-0 h-full ${barColor}`}
                    style={{ width: barWidth, transition: 'width 0.3s ease' }}
                ></div>
                <span className="z-10 text-green-400">{isBid && order.price}</span>
                <span className="z-10 text-white">{order.amount}</span>
                <span className="z-10 text-red-400">{!isBid && order.price}</span>
            </motion.div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-cyan-300/80 text-sm font-bold mb-2">ORDER BOOK</h3>
            <div className="flex justify-between text-xs text-gray-400 p-1 border-b border-gray-700">
                <span>PRICE (USD)</span>
                <span>AMOUNT</span>
                <span>PRICE (USD)</span>
            </div>
            <div className="flex-grow overflow-y-hidden">
                <div className="h-1/2 overflow-hidden flex flex-col-reverse">
                     <AnimatePresence>
                        {bids.slice(0, 15).map(order => renderRow(order, true))}
                    </AnimatePresence>
                </div>
                <div className="h-1/2 overflow-hidden">
                    <AnimatePresence>
                        {asks.slice(0, 15).map(order => renderRow(order, false))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
