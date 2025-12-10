import React, { useState, useEffect } from 'react';
import { FaHdd, FaFolderOpen, FaExchangeAlt } from 'react-icons/fa';

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

const RadialProgress = ({ percentage }) => {
  const radius = 30;
  const stroke = 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
      <circle
        stroke="#374151"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#38bdf8"
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={`${circumference} ${circumference}`}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.35s' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        className="text-xs fill-white transform rotate-90"
      >
        {`${Math.round(percentage)}%`}
      </text>
    </svg>
  );
};

const SparkBar = ({ value, maxValue = 100, color = "bg-cyan-500" }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const StatItem = ({ icon, label, value, unit, children, sparkBarValue, sparkBarMax, sparkBarColor }) => (
  <div className="flex items-center justify-between space-x-3">
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-gray-700/50 rounded-full">
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
    {sparkBarValue !== undefined && (
      <SparkBar value={sparkBarValue} maxValue={sparkBarMax} color={sparkBarColor} />
    )}
  </div>
);

const StorageMetrics = () => {
  const totalCapacity = 10; // This metric is static
  const usedSpace = useMetricAnimation(7.5, 0.02, 2000);
  const readSpeed = useMetricAnimation(2.1, 0.3, 1800);
  const writeSpeed = useMetricAnimation(1.3, 0.4, 2200);

  const usedPercentage = (usedSpace / totalCapacity) * 100;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Storage Metrics</h2>
      <div className="space-y-4">
        <StatItem icon={<FaHdd className="text-cyan-400" />} label="Total Capacity" value={totalCapacity.toFixed(1)} unit="PB" />
        <StatItem icon={<FaFolderOpen className="text-cyan-400" />} label="Used Space" value={usedSpace.toFixed(1)} unit="PB">
          <RadialProgress percentage={usedPercentage} />
        </StatItem>
        <StatItem icon={<FaExchangeAlt className="text-green-400" />} label="Read Speed" value={readSpeed.toFixed(1)} unit="GB/s" sparkBarValue={readSpeed * 10} sparkBarMax={30} sparkBarColor="bg-green-500" />
        <StatItem icon={<FaExchangeAlt className="text-yellow-400" />} label="Write Speed" value={writeSpeed.toFixed(1)} unit="GB/s" sparkBarValue={writeSpeed * 10} sparkBarMax={20} sparkBarColor="bg-yellow-500" />
      </div>
    </div>
  );
};

export default StorageMetrics;
