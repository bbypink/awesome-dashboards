import React, { useState, useEffect } from 'react';
import { FaNetworkWired, FaServer } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

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

const generateChartData = (base, count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    name: i,
    uv: base + (Math.random() - 0.5) * (base * 0.2),
  }));
};

const SparkBar = ({ value, maxValue = 100, color = "bg-cyan-500" }) => {
  const percentage = (value / maxValue) * 100;
  return (
    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
};


const StatItem = ({ icon, label, value, unit, chartData, sparkBarValue, sparkBarMax, sparkBarColor, iconClassName }) => (
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
    {chartData && (
      <div className="w-24 h-10">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={chartData}>
            <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            <Line type="monotone" dataKey="uv" stroke="#38bdf8" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
    {sparkBarValue !== undefined && (
      <SparkBar value={sparkBarValue} maxValue={sparkBarMax} color={sparkBarColor} />
    )}
  </div>
);

const NetworkStats = () => {
  const nodes = useMetricAnimation(1234, 0.05, 3000);
  const connections = useMetricAnimation(5678, 0.1, 2500);
  const throughput = useMetricAnimation(12.5, 0.2, 1500);
  const latency = useMetricAnimation(45, 0.15, 3500);
  
  const [throughputChartData, setThroughputChartData] = useState(generateChartData(12.5));

  useEffect(() => {
    const interval = setInterval(() => {
      setThroughputChartData(prevData => [...prevData.slice(1), { name: prevData.length, uv: throughput }]);
    }, 1500);
    return () => clearInterval(interval);
  }, [throughput]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Network Statistics</h2>
      <div className="space-y-4">
        <StatItem icon={<FaServer className="text-cyan-400" />} label="Total Nodes" value={Math.round(nodes)} sparkBarValue={Math.random() * 100} sparkBarMax={100} sparkBarColor="bg-blue-500" />
        <StatItem icon={<FaNetworkWired className="text-cyan-400" />} label="Active Connections" value={Math.round(connections)} sparkBarValue={Math.random() * 100} sparkBarMax={100} sparkBarColor="bg-indigo-500" />
        <StatItem icon={<FaNetworkWired className="text-green-400" />} label="Data Throughput" value={throughput.toFixed(1)} unit="GB/s" chartData={throughputChartData} />
        <StatItem icon={<FaNetworkWired className="text-red-400" />} label="Latency" value={latency.toFixed(0)} unit="ms" iconClassName="animate-pulse-slow" sparkBarValue={latency} sparkBarMax={100} sparkBarColor="bg-red-500" />
      </div>
    </div>
  );
};

export default NetworkStats;
