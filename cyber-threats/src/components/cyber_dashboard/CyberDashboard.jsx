import React from 'react';
import CyberHeader from './CyberHeader';
import NetworkGraph from './NetworkGraph';
import ThreatLog from './ThreatLog';
import SystemHealth from './SystemHealth';
import AlertPanel from './AlertPanel';

const CyberDashboard = () => {
  return (
    <div className="flex flex-col h-screen bg-black text-gray-200 font-mono grid-bg">
      <CyberHeader />
      <main className="flex-grow grid grid-cols-4 grid-rows-2 gap-2">
        
        {/* Critical Alerts (replacing Network Graph) */}
        <div className="col-span-3 row-start-1 row-end-2 bg-black/30 border border-yellow-500/20 rounded-lg p-4 backdrop-blur-sm h-full">
          <AlertPanel />
        </div>

        {/* Threat Log */}
        <div className="col-span-1 row-start-1 row-end-2 bg-black/30 border border-red-500/20 rounded-lg p-2 backdrop-blur-sm h-full">
            <ThreatLog />
        </div>

        {/* System Health (spanning full width) */}
        <div className="col-span-4 row-start-2 row-end-3 bg-black/30 border border-green-500/20 rounded-lg p-4 backdrop-blur-sm h-full">
          <SystemHealth />
        </div>

      </main>
    </div>
  );
};

export default CyberDashboard;
