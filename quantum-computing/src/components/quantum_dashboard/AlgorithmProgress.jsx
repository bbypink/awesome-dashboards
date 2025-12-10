import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const generateProgressData = () => {
  const data = [];
  let value = Math.random() * 50 + 20; // Start with a random value
  for (let i = 0; i < 20; i++) {
    value += (Math.random() - 0.5) * 10; // Fluctuate
    value = Math.max(0, Math.min(100, value)); // Clamp between 0 and 100
    data.push({ name: `Step ${i}`, progress: value });
  }
  return data;
};

const AlgorithmProgress = () => {
  const [data, setData] = useState(generateProgressData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newDataPoint = { name: `Step ${prevData.length}`, progress: Math.max(0, Math.min(100, prevData[prevData.length - 1].progress + (Math.random() - 0.5) * 10)) };
        return [...prevData.slice(1), newDataPoint];
      });
    }, 2000); // Update every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Algorithm Progress</h2>
      <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={0}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis dataKey="name" hide />
          <YAxis domain={[0, 100]} stroke="#4a5568" />
          <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none', color: '#fff' }} />
          <Line type="monotone" dataKey="progress" stroke="#9f7aea" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AlgorithmProgress;
