import React from 'react';
import AlgoHeader from './AlgoHeader';
import MicroMarketFlow from './MicroMarketFlow';
import OrderBookHeatmap from './OrderBookHeatmap';
import LatencyMonitor from './LatencyMonitor';
import AlgoPerformanceMatrix from './AlgoPerformanceMatrix';
import PatternRecognitionAlerts from './PatternRecognitionAlerts';

const AlgoDashboard = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-gray-200 font-mono">
      <MicroMarketFlow /> {/* Central 3D background */}
      <div className="absolute inset-0 flex flex-col z-10">
        <AlgoHeader />
        <main className="flex-grow grid grid-cols-4 grid-rows-[2fr_1fr] gap-2 p-2">
          
          {/* Order Book Heatmap */}
          <div className="col-span-2 row-span-2 bg-black/50 border border-blue-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <OrderBookHeatmap />
          </div>

          {/* Latency Monitor */}
          <div className="col-span-2 row-span-2 bg-black/50 border border-cyan-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <LatencyMonitor />
          </div>

          {/* Algo Performance Matrix */}
          <div className="col-span-2 row-span-1 bg-black/50 border border-blue-700/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <AlgoPerformanceMatrix />
          </div>

          {/* Pattern Recognition Alerts */}
          <div className="col-span-2 row-span-1 bg-black/50 border border-red-700/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <PatternRecognitionAlerts />
          </div>

        </main>
      </div>
    </div>
  );
};

export default AlgoDashboard;
