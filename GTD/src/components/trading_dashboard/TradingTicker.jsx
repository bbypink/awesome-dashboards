import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const initialTickerData = [
    { symbol: 'BTC', price: 67345.12, change: 2.5, dir: 'up' },
    { symbol: 'ETH', price: 3491.88, change: -1.2, dir: 'down' },
    { symbol: 'SOL', price: 165.45, change: 5.8, dir: 'up' },
    { symbol: 'NVDA', price: 125.10, change: -3.1, dir: 'down' },
    { symbol: 'AAPL', price: 214.29, change: 1.9, dir: 'up' },
    { symbol: 'GME', price: 25.55, change: 10.2, dir: 'up' },
    { symbol: 'TSLA', price: 182.58, change: -0.5, dir: 'down' },
    { symbol: 'JPM', price: 198.50, change: 0.8, dir: 'up' },
];

const TickerItem = ({ symbol, price, change, dir }) => {
    const color = dir === 'up' ? 'text-green-400' : 'text-red-400';
    const sign = dir === 'up' ? '▲' : '▼';

    return (
        <div className="flex items-center space-x-4 mx-6">
            <span className="text-gray-400">{symbol}</span>
            <span className="text-white font-semibold">${price.toFixed(2)}</span>
            <span className={`${color} flex items-center`}>
                {sign} {Math.abs(change)}%
            </span>
        </div>
    );
};

const TradingTicker = () => {
    const [tickerData, setTickerData] = useState(initialTickerData);

    useEffect(() => {
        const interval = setInterval(() => {
            setTickerData(prevData =>
                prevData.map(item => {
                    const change = (Math.random() - 0.48) * 5;
                    const newPrice = Math.max(0, item.price + (item.price * change) / 100);
                    return {
                        ...item,
                        price: newPrice,
                        change: change,
                        dir: change >= 0 ? 'up' : 'down',
                    };
                })
            );
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const tickerContent = [...tickerData, ...tickerData]; // Duplicate for seamless scroll

    const marqueeVariants = {
        animate: {
            x: [0, -1344], // Adjust this value based on the width of your ticker content
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 40, // Adjust for speed
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className="w-full h-full bg-gray-900/50 rounded-lg overflow-hidden flex items-center">
            <motion.div
                className="flex"
                variants={marqueeVariants}
                animate="animate"
            >
                {tickerContent.map((item, index) => (
                    <TickerItem key={index} {...item} />
                ))}
            </motion.div>
        </div>
    );
};

export default TradingTicker;
