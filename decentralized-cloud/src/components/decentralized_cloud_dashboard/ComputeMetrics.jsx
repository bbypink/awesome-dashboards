import React, { useState, useEffect } from 'react';
import { FaMicrochip, FaTasks, FaBolt } from 'react-icons/fa';

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

const ProgressBar = ({ percentage, color = "bg-cyan-400" }) => (
  <div className="w-20 h-2 bg-gray-700 rounded-full">
    <div
      className={`${color} h-2 rounded-full`}
      style={{ width: `${percentage}%`, transition: 'width 0.35s' }}
    ></div>
  </div>
);

const SparkBar = ({ value, maxValue = 100, color = "bg-cyan-500" }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

const VerticalProgressBar = ({ percentage, color = "bg-yellow-400" }) => (
  <div className="w-4 h-16 bg-gray-700 rounded-full flex flex-col-reverse overflow-hidden">
    <div
      className={`${color} w-full rounded-full`}
      style={{ height: `${percentage}%`, transition: 'height 0.35s' }}
    ></div>
  </div>
);

const StatItem = ({ icon, label, value, unit, children, iconClassName, sparkBarValue, sparkBarMax, sparkBarColor }) => (
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
    {sparkBarValue !== undefined && (
      <SparkBar value={sparkBarValue} maxValue={sparkBarMax} color={sparkBarColor} />
    )}
  </div>
);

const ComputeMetrics = () => {
  const activeJobs = useMetricAnimation(123, 0.1, 2500);
  const cpuUtilization = useMetricAnimation(75, 0.2, 1500);
  const gpuUtilization = useMetricAnimation(62, 0.3, 1800);
  const powerConsumption = useMetricAnimation(2.1, 0.05, 3000);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Compute Metrics</h2>
      <div className="space-y-4">
        <StatItem icon={<FaTasks className="text-cyan-400" />} label="Active Jobs" value={Math.round(activeJobs)} iconClassName="animate-pulse-slow" sparkBarValue={activeJobs} sparkBarMax={200} sparkBarColor="bg-cyan-500" />
        <StatItem icon={<FaMicrochip className="text-cyan-400" />} label="CPU Utilization" value={`${cpuUtilization.toFixed(0)}%`}>
          <ProgressBar percentage={cpuUtilization} />
        </StatItem>
        <StatItem icon={<FaMicrochip className="text-purple-400" />} label="GPU Utilization" value={`${gpuUtilization.toFixed(0)}%`}>
          <ProgressBar percentage={gpuUtilization} color="bg-purple-400" />
        </StatItem>
        <StatItem icon={<FaBolt className="text-yellow-400" />} label="Power Consumption" value={powerConsumption.toFixed(1)} unit="MW">
          <VerticalProgressBar percentage={(powerConsumption / 5) * 100} /> {/* Assuming max 5 MW */}
        </StatItem>
      </div>
    </div>
  );
};

export default ComputeMetrics;
