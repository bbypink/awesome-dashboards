import React, { useState, useEffect } from 'react';
import { FaCube, FaHourglassHalf, FaBug } from 'react-icons/fa';

const useMetricAnimation = (baseValue, fluctuation = 0.1, delay = 2000) => {
  const [value, setValue] = useState(baseValue);
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuationAmount = (Math.random() - 0.5) * baseValue * fluctuation;
      setValue(baseValue + fluctuationAmount);
    }, delay);
    return () => clearInterval(interval);
  }, [baseValue, fluctuation, delay]);
  return value;
};

const ProgressBar = ({ percentage, color = "bg-purple-400" }) => (
  <div className="w-20 h-2 bg-gray-700 rounded-full">
    <div
      className={`${color} h-2 rounded-full`}
      style={{ width: `${percentage}%`, transition: 'width 0.35s' }}
    ></div>
  </div>
);

const StatItem = ({ icon, label, value, unit, children, iconClassName }) => (
  <div className="flex items-center justify-between space-x-3">
    <div className="flex items-center space-x-3">
      <div className={`p-2 bg-gray-700/50 rounded-full ${iconClassName}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-bold">
          {value} <span className="text-sm font-normal text-gray-400">{unit}</span>
        </p>
      </div>
    </div>
    {children}
  </div>
);

const ProcessorStats = () => {
  const qubits = 128; // Static value for now
  const coherenceTime = useMetricAnimation(50, 0.2, 2000); // in μs
  const errorRate = useMetricAnimation(0.01, 0.5, 3000); // percentage

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Processor Stats</h2>
      <div className="space-y-4">
        <StatItem icon={<FaCube className="text-purple-400" />} label="Qubits" value={qubits} />
        <StatItem icon={<FaHourglassHalf className="text-cyan-400" />} label="Coherence Time" value={coherenceTime.toFixed(0)} unit="μs">
          <ProgressBar percentage={coherenceTime * 2} color="bg-cyan-500" /> {/* Scale to 100 for bar */}
        </StatItem>
        <StatItem icon={<FaBug className="text-red-400" />} label="Error Rate" value={(errorRate * 100).toFixed(2)} unit="%">
          <ProgressBar percentage={errorRate * 100} color="bg-red-500" />
        </StatItem>
      </div>
    </div>
  );
};

export default ProcessorStats;
