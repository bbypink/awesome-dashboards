import React from 'react';
import { ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

const RadialMetric = ({ label, value, total, color, formatter }) => {
    const percentage = total ? (value / total) * 100 : value;
    const formattedValue = formatter ? formatter(value) : `${percentage.toFixed(1)}%`;
  
    const chartData = [{ name: label, value: percentage, fill: color }];
  
    return (
      <div className="flex flex-col items-center justify-between text-center p-2 rounded-lg bg-gray-800/50 h-full">
        {/* Label is now outside and above the chart */}
        <div className="py-1">
            <p className="text-gray-400 text-xs">{label}</p>
        </div>
        <ResponsiveContainer width="100%" height={100}>
            <RadialBarChart
                innerRadius="65%" // Smaller inner radius to make room for text
                outerRadius="100%"
                data={chartData}
                startAngle={90}
                endAngle={-270}
                barSize={10}
            >
                <RadialBar
                    minAngle={15}
                    background
                    clockWise={true}
                    dataKey="value"
                />
                {/* Formatted value is inside the chart again */}
                <text
                    x="50%"
                    y="50%" // Centered vertically
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-white font-semibold text-base" // Consistent size
                >
                    {formattedValue}
                </text>
            </RadialBarChart>
        </ResponsiveContainer>
      </div>
    );
};

export default RadialMetric;
