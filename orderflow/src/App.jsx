import React, { useState, useEffect } from 'react';

import Header from './components/Header';
import OrderBook from './components/OrderBook';
import TimeAndSales from './components/TimeAndSales';
import MarketInfo from './components/MarketInfo';
import TradeFlow from './components/TradeFlow';

// --- SIMULATION SETUP ---
const MID_PRICE = 45000.50;
const SPREAD = 0.5;
const BOOK_DEPTH = 15;

const generateInitialBook = () => {
    let bids = [], asks = [];
    for (let i = 0; i < BOOK_DEPTH; i++) {
        bids.push({ price: MID_PRICE - SPREAD/2 - i * 0.5, size: Math.random() * 5 + 1 });
        asks.push({ price: MID_PRICE + SPREAD/2 + i * 0.5, size: Math.random() * 5 + 1 });
    }
    return { bids, asks };
};

const App = () => {
    const [marketPrice, setMarketPrice] = useState(MID_PRICE);
    const [priceDirection, setPriceDirection] = useState('text-white');
    const [orderBook, setOrderBook] = useState(generateInitialBook());
    const [recentTrades, setRecentTrades] = useState([]);
    const [latestTrade, setLatestTrade] = useState(null);

    useEffect(() => {
        const simulationInterval = setInterval(() => {
            // 1. Fluctuate order book
            setOrderBook(prevBook => {
                const newBids = prevBook.bids.map(b => ({ ...b, size: Math.max(0.1, b.size + (Math.random() - 0.5) * 0.5) }));
                const newAsks = prevBook.asks.map(a => ({ ...a, size: Math.max(0.1, a.size + (Math.random() - 0.5) * 0.5) }));
                return { bids: newBids, asks: newAsks };
            });

            // 2. Simulate a trade
            if (Math.random() > 0.3) { // 70% chance of a trade each tick
                const side = Math.random() > 0.5 ? 'buy' : 'sell';
                const tradeSize = Math.random() * 2 + 0.01;
                const tradePrice = side === 'buy' ? orderBook.asks[0].price : orderBook.bids[0].price;

                // Update market price and direction
                setPriceDirection(tradePrice > marketPrice ? 'text-green-400' : 'text-red-400');
                setMarketPrice(tradePrice);

                const newTrade = {
                    id: Date.now() + Math.random(),
                    price: tradePrice,
                    size: tradeSize,
                    side,
                    time: new Date().toLocaleTimeString(),
                };
                
                // Add to recent trades list and trigger trade bubble
                setRecentTrades(prev => [newTrade, ...prev].slice(0, 20));
                setLatestTrade(newTrade);
            }
        }, 500); // Simulation tick every 500ms

        return () => clearInterval(simulationInterval);
    }, [orderBook, marketPrice]); // Dependency array to use latest book data

    return (
        <div className="bg-black text-gray-300 min-h-screen font-mono flex flex-col p-4">
            <Header />
            <div className="flex-grow grid grid-cols-5 grid-rows-6 gap-4 mt-4">
                
                {/* --- TOP INFO BAR --- */}
                <div className="col-span-5 row-span-1 grid grid-cols-4 gap-4">
                    <MarketInfo label="Last Price" value={marketPrice.toFixed(2)} colorClass={priceDirection} />
                    <MarketInfo label="24h Volume" value={"1,283.45 BTC"} />
                    <MarketInfo label="24h High" value={(MID_PRICE + 150).toFixed(2)} />
                    <MarketInfo label="24h Low" value={(MID_PRICE - 150).toFixed(2)} />
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="col-span-4 row-span-5 relative">
                    <OrderBook data={orderBook} />
                    <TradeFlow latestTrade={latestTrade} />
                </div>

                <div className="col-span-1 row-span-5">
                    <TimeAndSales trades={recentTrades} />
                </div>
            </div>
        </div>
    );
}

export default App;