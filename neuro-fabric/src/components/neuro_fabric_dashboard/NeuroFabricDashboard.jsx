import React from 'react';
import NeuroFabricHeader from './NeuroFabricHeader';
import NeuroFabricNetworkViz from './NeuroFabricNetworkViz';
import InputOutputDisplay from './InputOutputDisplay';
import NetworkMetrics from './NetworkMetrics';
import LayerInspector from './LayerInspector';

const NeuroFabricDashboard = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-gray-200 font-mono bg-gray-900">
      {/* Background elements if any */}
      <div className="absolute inset-0 z-0">
        {/* Potentially a subtle animated background like NeuroFlow or particles */}
      </div>

      <div className="absolute inset-0 flex flex-col z-10">
        <NeuroFabricHeader />
        <main className="flex-grow grid grid-cols-4 grid-rows-2 gap-4 p-4">
          
          {/* Main 3D Neural Network Visualization */}
          <div className="col-span-3 row-span-1 bg-black/30 border border-purple-500/20 rounded-lg p-4 backdrop-blur-sm">
            <NeuroFabricNetworkViz />
          </div>

          {/* Input/Output Data Stream */}
          <div className="col-span-1 row-span-1 bg-black/30 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm flex flex-col">
            <h3 className="text-blue-400 text-lg font-bold mb-2">Input/Output</h3>
            <InputOutputDisplay />
          </div>

          {/* Network Metrics */}
          <div className="col-span-2 row-span-1 bg-black/30 border border-green-500/20 rounded-lg p-4 backdrop-blur-sm flex flex-col">
            <h3 className="text-green-400 text-lg font-bold mb-2">Network Metrics</h3>
            <NetworkMetrics />
          </div>

          {/* Layer Inspector */}
          <div className="col-span-2 row-span-1 bg-black/30 border border-pink-500/20 rounded-lg p-4 backdrop-blur-sm flex flex-col">
            <h3 className="text-pink-400 text-lg font-bold mb-2">Layer Inspector</h3>
            <LayerInspector />
          </div>

        </main>
      </div>
    </div>
  );
};

export default NeuroFabricDashboard;
