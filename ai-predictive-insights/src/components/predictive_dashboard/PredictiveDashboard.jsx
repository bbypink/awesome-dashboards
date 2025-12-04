import React from 'react';
import PredictiveHeader from './PredictiveHeader';
import PredictiveFlowBackground from './PredictiveFlowBackground';
import DataAnomalyViz from './DataAnomalyViz';
import MultiDimDataViz from './MultiDimDataViz';
import ForecastGraph from './ForecastGraph';
import SmartAlertStream from './SmartAlertStream';

const PredictiveDashboard = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-gray-200 font-mono">
      <PredictiveFlowBackground />
      <div className="absolute inset-0 flex flex-col z-10">
        <PredictiveHeader />
        <main className="flex-grow grid grid-cols-4 grid-rows-[2fr_1fr] gap-2 p-2">
          
          {/* Data Anomaly Visualization */}
          <div className="col-span-2 row-span-2 bg-black/30 border border-cyan-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <DataAnomalyViz />
          </div>

          {/* Multi-Dimensional Data Visualization */}
          <div className="col-span-2 row-span-2 bg-black/30 border border-blue-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <MultiDimDataViz />
          </div>

          {/* Forecast Graph */}
          <div className="col-span-2 row-span-1 bg-black/30 border border-teal-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <ForecastGraph />
          </div>

          {/* Smart Alert Stream */}
          <div className="col-span-2 row-span-1 bg-black/30 border border-indigo-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <SmartAlertStream />
          </div>

        </main>
      </div>
    </div>
  );
};

export default PredictiveDashboard;
