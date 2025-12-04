import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area,
} from 'recharts';
import { motion } from 'framer-motion';

const generateData = () => {
  const data = [];
  const now = new Date();
  for (let i = -20; i <= 20; i++) {
    const date = new Date(now.getTime() + i * 3600 * 1000); // Hourly data
    const actual = Math.random() * 100 + 50;
    const forecast = actual * (1 + (Math.random() - 0.5) * 0.1);
    const uncertainty = Math.random() * 10 + 5;

    data.push({
      time: date.getHours() + ':00',
      actual: i < 0 ? actual : null,
      forecast: i >= 0 ? forecast : null,
      upperBound: i >= 0 ? forecast + uncertainty : null,
      lowerBound: i >= 0 ? forecast - uncertainty : null,
      timestamp: date.getTime(),
    });
  }
  return data;
};

const ForecastGraph = () => {
  const [data, setData] = useState(generateData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData());
    }, 5000); // Update data every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full p-4">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">PREDICTIVE FORECAST</h3>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart
          data={data}
          margin={{
            top: 10, right: 30, left: 0, bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#777" tick={{ fontSize: 10 }} />
          <YAxis stroke="#777" tick={{ fontSize: 10 }} />
          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #555' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#eee' }} />
          
          {/* Actual Data (historical) */}
          <Line type="monotone" dataKey="actual" stroke="#00FFCC" strokeWidth={2} dot={false} isAnimationActive={false} />

          {/* Forecast Line */}
          <Line type="monotone" dataKey="forecast" stroke="#FF0055" strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={1500} />
          
          {/* Uncertainty Band */}
          <Area type="monotone" dataKey="upperBound" stroke="none" fill="#FF0055" fillOpacity={0.1} />
          <Area type="monotone" dataKey="lowerBound" stroke="none" fill="#FF0055" fillOpacity={0.1} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastGraph;
