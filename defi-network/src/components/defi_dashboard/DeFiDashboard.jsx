import React from 'react';
import DeFiHeader from './DeFiHeader';
import DeFiGraph from './DeFiGraph';
import TransactionStream from './TransactionStream';
import LiquidityHealth from './LiquidityHealth';
import RiskHeatmap from './RiskHeatmap';

const DeFiDashboard = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-gray-200 font-mono">
      <div className="absolute inset-0 z-0">
        {/* Placeholder for a subtle background animation if needed later */}
      </div>
      <div className="absolute inset-0 flex flex-col z-10">
        <DeFiHeader />
        <main className="flex-grow grid grid-cols-4 grid-rows-2 gap-2 p-2">
          
          {/* DeFi Graph */}
          <div className="col-span-3 row-start-1 row-end-2 bg-black/30 border border-green-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <DeFiGraph />
          </div>

          {/* Transaction Stream */}
          <div className="col-span-1 row-start-1 row-end-2 bg-black/30 border border-green-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <TransactionStream />
          </div>

          {/* Liquidity Health */}
          <div className="col-span-2 row-start-2 row-end-3 bg-black/30 border border-orange-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <LiquidityHealth />
          </div>

          {/* Risk Heatmap */}
          <div className="col-span-2 row-start-2 row-end-3 bg-black/30 border border-red-600/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <RiskHeatmap />
          </div>

        </main>
      </div>
    </div>
  );
};

export default DeFiDashboard;
