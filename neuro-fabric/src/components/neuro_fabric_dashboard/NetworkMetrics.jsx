import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

const initialChartData = [
  { time: 0, accuracy: 70, loss: 0.8 },
  { time: 1, accuracy: 72, loss: 0.75 },
  { time: 2, accuracy: 75, loss: 0.7 },
  { time: 3, accuracy: 78, loss: 0.65 },
  { time: 4, accuracy: 80, loss: 0.6 },
  { time: 5, accuracy: 83, loss: 0.55 },
  { time: 6, accuracy: 85, loss: 0.5 },
];

const StatCard = ({ label, value, unit, color }) => (
  <motion.div 
    className={`p-3 rounded-lg flex items-center justify-between border ${color ? `border-${color}-500/30` : 'border-gray-500/30'}`}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <div>
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-xl font-bold text-white">{value}<span className={`text-sm ${color ? `text-${color}-400` : 'text-gray-400'}`}>{unit}</span></div>
    </div>
  </motion.div>
);

const NetworkMetrics = () => {
  const [chartData, setChartData] = useState(initialChartData);
  const [liveStats, setLiveStats] = useState({
    accuracy: 85.2,
    loss: 0.48,
    throughput: 1.2,
    activeNeurons: 98.0,
  });
  const [time, setTime] = useState(7);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update live stats
      const newAccuracy = Math.min(99, liveStats.accuracy + (Math.random() - 0.4) * 0.5);
      const newLoss = Math.max(0.1, liveStats.loss + (Math.random() - 0.55) * 0.05);
      
      setLiveStats(prevStats => ({
        accuracy: newAccuracy,
        loss: newLoss,
        throughput: Math.max(0.5, prevStats.throughput + (Math.random() - 0.5) * 0.2),
        activeNeurons: Math.max(80, Math.min(100, prevStats.activeNeurons + (Math.random() - 0.5) * 1)),
      }));

      // Update chart data
      setTime(t => t + 1);
      const newChartEntry = {
        time: time,
        accuracy: newAccuracy,
        loss: newLoss,
      };

      setChartData(prevData => [...prevData.slice(1), newChartEntry]);

    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [liveStats, time]);

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatCard label="Accuracy" value={liveStats.accuracy.toFixed(1)} unit="%" color="green" />
        <StatCard label="Loss" value={liveStats.loss.toFixed(2)} color="red" />
        <StatCard label="Throughput" value={liveStats.throughput.toFixed(2)} unit=" GB/s" color="blue" />
        <StatCard label="Active Neurons" value={liveStats.activeNeurons.toFixed(1)} unit="%" color="purple" />
      </div>
      <motion.div 
        className="flex-grow bg-gray-800 p-3 rounded-md border border-green-600/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h4 className="text-green-400 text-md font-bold mb-2">Performance Over Time</h4>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#888" interval="preserveStartEnd" domain={['dataMin', 'dataMax']} tickFormatter={(t) => `${t}s`} />
            <YAxis yAxisId="left" stroke="#82ca9d" domain={[60, 100]} />
            <YAxis yAxisId="right" orientation="right" stroke="#ffc658" domain={[0, 1]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a202c', border: '1px solid #4a5568', borderRadius: '4px' }}
              labelStyle={{ color: '#cbd5e0' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="accuracy" stroke="#82ca9d" dot={false} isAnimationActive={false} />
            <Line yAxisId="right" type="monotone" dataKey="loss" stroke="#ffc658" dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default NetworkMetrics;

