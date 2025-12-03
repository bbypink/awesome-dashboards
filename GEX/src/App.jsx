import React, { useState, useEffect } from 'react';
import { formatLargeNumber } from './utils/formatters';

import Header from './components/Header';
import PrimaryMetricDisplay from './components/PrimaryMetricDisplay';
import StatCard from './components/StatCard';
import GEXChart from './components/GEXChart';
import HighlightBox from './components/HighlightBox';
import AllTimeStats from './components/AllTimeStats';
import Footer from './components/Footer';

// Initial state for our new "advanced" dashboard
const initialDerivativesData = {
  impliedVolatility: 45.7,
  ivChange: 0.1,
  putCallRatio: 0.68,
  openInterest: 12400000000,
  notionalVolume: 56000000000,
};

const App = () => {
  const [liveData, setLiveData] = useState(initialDerivativesData);
  const [flashClass, setFlashClass] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prevData => {
        const ivChange = (Math.random() - 0.5) * 0.5;
        const newIV = prevData.impliedVolatility + ivChange;

        // Determine flash color based on volatility change
        if (ivChange > 0) {
          setFlashClass('flash-magenta'); // High volatility flash
        } else {
          setFlashClass('flash-blue'); // Low volatility flash
        }
        setTimeout(() => setFlashClass(""), 500);

        return {
          ...prevData,
          impliedVolatility: newIV,
          ivChange: ivChange,
          putCallRatio: prevData.putCallRatio + (Math.random() - 0.5) * 0.01,
          openInterest: prevData.openInterest + (Math.random() - 0.5) * 10000000,
        };
      });
    }, 2500); // Update every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Header />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PrimaryMetricDisplay 
                label="Implied Volatility"
                value={liveData.impliedVolatility} 
                change={liveData.ivChange}
                flashClass={flashClass}
              />
              <div className="md:col-span-2 grid grid-cols-2 gap-6">
                <StatCard label="Open Interest" value={formatLargeNumber(liveData.openInterest)} />
                <StatCard label="Notional Volume" value={formatLargeNumber(liveData.notionalVolume)} />
              </div>
            </div>
            <GEXChart />
          </div>

          <div className="lg:col-span-1 space-y-6">
             {/* These components are now static and less relevant, but kept for layout */}
            <HighlightBox data={{ high_24h: 48534.50, low_24h: 46123.00}} /> 
            <AllTimeStats data={{ ath: 69044.77, atl: 65.53, ath_change_percentage: -25, ath_date: '2025-10-06T18:57:42.558Z', atl_date: '2013-07-06T00:00:00.000Z' }} />
          </div>
        </main>
        
        <Footer data={liveData} />
      </div>
    </div>
  );
}

export default App;