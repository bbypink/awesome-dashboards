import React from 'react';
import Header from './Header';
import Globe from './Globe';
import TradingTicker from './TradingTicker';
import VolatilityMatrix from './VolatilityMatrix';
import OrderBook from './OrderBook';

const GlobalTraderDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-gray-200 font-mono grid-bg">
      <Header />
      <main className="flex-grow p-4 grid grid-cols-4 grid-rows-3 gap-4">
        
        {/* Order Book */}
        <div className="col-span-1 row-span-3 bg-black/30 border border-cyan-300/20 rounded-lg p-4 backdrop-blur-sm">
          <OrderBook />
        </div>

        {/* Globe */}
        <div className="col-span-2 row-span-2 bg-black/30 border border-cyan-300/20 rounded-lg">
          <Globe />
        </div>

        {/* Volatility Matrix */}
        <div className="col-span-1 row-span-3 bg-black/30 border border-cyan-300/20 rounded-lg p-4 backdrop-blur-sm">
            <VolatilityMatrix />
        </div>

        {/* Trading Ticker */}
        <div className="col-span-2 row-span-1 bg-black/30 border border-cyan-300/20 rounded-lg p-4 backdrop-blur-sm flex flex-col">
            <h3 className="text-cyan-300/80 text-sm font-bold mb-2">LIVE MARKET TICKER</h3>
            <div className="flex-grow">
                <TradingTicker />
            </div>
        </div>

      </main>
    </div>
  );
};

export default GlobalTraderDashboard;
