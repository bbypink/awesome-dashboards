import React from 'react';
import QuantumHeader from './QuantumHeader';
import ProcessorStats from './ProcessorStats';
import JobQueue from './JobQueue';
import EntanglementGraph from './EntanglementGraph';
import AlgorithmProgress from './AlgorithmProgress';

const QuantumDashboard = () => {
  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col">
      <div className="bg-radial-gradient-c from-gray-800/50 to-gray-900/0 flex flex-col flex-grow">
        <QuantumHeader />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
            <div className="lg:col-span-2 lg:row-span-2 h-full">
              <EntanglementGraph />
            </div>
            <div className="h-full">
              <ProcessorStats />
            </div>
            <div className="h-full">
              <AlgorithmProgress />
            </div>
            <div className="lg:col-span-4 h-full">
              <JobQueue />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuantumDashboard;
