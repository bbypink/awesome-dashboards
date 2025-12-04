import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const PRICE_LEVELS = 15; // Number of price levels to display
const SPREAD_SIZE = 5; // Number of price levels between best bid and best ask

const getHeatmapColor = (quantity, isBid) => {
    // Interpolate from dark to vibrant for quantity
    const intensity = Math.min(1, quantity / 1000); // Max quantity assumed 1000
    if (isBid) { // Green for bids
        return `rgb(${Math.floor(intensity * 50)}, ${Math.floor(intensity * 200)}, ${Math.floor(intensity * 100)})`;
    } else { // Red for asks
        return `rgb(${Math.floor(intensity * 200)}, ${Math.floor(intensity * 50)}, ${Math.floor(intensity * 100)})`;
    }
};

const HeatmapCell = ({ quantity, isBid }) => {
    const bgColor = useMemo(() => getHeatmapColor(quantity, isBid), [quantity, isBid]);
    const fontSize = useMemo(() => Math.max(0.7, Math.min(1.0, quantity / 1000 + 0.3)), [quantity]);

    return (
        <motion.div
            className="flex items-center justify-center h-4 rounded-sm text-white font-mono"
            style={{ backgroundColor: bgColor, fontSize: `${fontSize}rem` }}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            {quantity > 0 ? quantity : ''}
        </motion.div>
    );
};

const OrderBookHeatmap = () => {
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [], midPrice: 100 });

    const generateOrderBook = () => {
        const mid = 100 + (Math.random() - 0.5) * 5; // Simulate mid price fluctuation
        const newBids = [];
        const newAsks = [];

        // Generate Bids
        let currentBidPrice = mid - SPREAD_SIZE * 0.01;
        for (let i = 0; i < PRICE_LEVELS; i++) {
            newBids.push({
                price: parseFloat(currentBidPrice.toFixed(2)),
                quantity: Math.floor(Math.random() * 1000)
            });
            currentBidPrice -= 0.01;
        }

        // Generate Asks
        let currentAskPrice = mid + SPREAD_SIZE * 0.01;
        for (let i = 0; i < PRICE_LEVELS; i++) {
            newAsks.push({
                price: parseFloat(currentAskPrice.toFixed(2)),
                quantity: Math.floor(Math.random() * 1000)
            });
            currentAskPrice += 0.01;
        }

        setOrderBook({
            bids: newBids.sort((a, b) => b.price - a.price), // Highest bid first
            asks: newAsks.sort((a, b) => a.price - b.price), // Lowest ask first
            midPrice: parseFloat(mid.toFixed(2)),
        });
    };

    useEffect(() => {
        generateOrderBook(); // Initial load
        const interval = setInterval(generateOrderBook, 500); // Update every 0.5 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-4 flex flex-col font-mono text-white">
            <h3 className="text-xl font-bold text-green-400 mb-4">ORDER BOOK HEATMAP</h3>
            <div className="flex-grow flex justify-center items-center">
                <div className="flex flex-col-reverse flex-grow h-full items-end mr-2"> {/* Bids */}
                    {orderBook.bids.map((bid, index) => (
                        <HeatmapCell key={index} quantity={bid.quantity} isBid={true} />
                    ))}
                </div>

                <div className="flex flex-col h-full justify-around text-center w-1/4"> {/* Price Column */}
                    {orderBook.bids.slice(0, 3).map((bid, index) => (
                        <div key={`bprice-${index}`} className="text-sm text-green-300">{bid.price}</div>
                    ))}
                    <div className="text-lg font-bold text-gray-400">MID</div>
                    {orderBook.asks.slice(0, 3).map((ask, index) => (
                        <div key={`aprice-${index}`} className="text-sm text-red-300">{ask.price}</div>
                    ))}
                </div>

                <div className="flex flex-col flex-grow h-full items-start ml-2"> {/* Asks */}
                    {orderBook.asks.map((ask, index) => (
                        <HeatmapCell key={index} quantity={ask.quantity} isBid={false} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderBookHeatmap;
