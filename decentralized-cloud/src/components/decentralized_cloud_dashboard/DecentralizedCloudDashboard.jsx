import React from 'react';
import Header from './Header';
import Globe from './Globe';
import NetworkStats from './NetworkStats';
import StorageMetrics from './StorageMetrics';
import ComputeMetrics from './ComputeMetrics';
import EventStream from './EventStream';

const DecentralizedCloudDashboard = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="bg-radial-gradient-c from-gray-800/50 to-gray-900/0">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="lg:col-span-2 lg:row-span-2">
              <Globe />
            </div>

            <div className="lg:col-span-2">
              <NetworkStats />
            </div>

            <div>
              <StorageMetrics />
            </div>

            <div>
              <ComputeMetrics />
            </div>
            
            <div className="lg:col-span-4">
              <EventStream />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DecentralizedCloudDashboard;
