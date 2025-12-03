import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Cell } from 'recharts';

// Generates the initial GEX data profile
const generateGEXProfile = () => {
    const data = [];
    const basePrice = 45000;
    for (let i = -25; i <= 25; i++) {
        const strike = basePrice + i * 100;
        const baseGamma = Math.exp(-0.0001 * Math.pow(i, 2)) * 10e8;
        const gamma = i > 0 ? baseGamma * (1 - Math.abs(i)/50) : -baseGamma * (1 - Math.abs(i)/50) ;
        data.push({ strike: strike, gamma: gamma });
    }
    return data;
};

const GEXChart = () => {
    const [gexData, setGexData] = useState(generateGEXProfile());
    const [currentPrice, setCurrentPrice] = useState(45150);

    useEffect(() => {
        // Animation loop for the gamma bars
        const gexInterval = setInterval(() => {
            setGexData(prevData =>
                prevData.map(d => ({
                    ...d,
                    gamma: d.gamma * (1 + (Math.random() - 0.5) * 0.1) // Fluctuate by up to 10%
                }))
            );
        }, 500);

        // Animation loop for the price line
        const priceInterval = setInterval(() => {
            setCurrentPrice(prevPrice => prevPrice + (Math.random() - 0.5) * 50);
        }, 1500);

        return () => {
            clearInterval(gexInterval);
            clearInterval(priceInterval);
        };
    }, []);

    const formatGamma = (value) => `${(value / 1e9).toFixed(1)}B`;

    return (
        <div className="bg-gray-800/50 p-4 rounded-lg h-[50vh]">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 px-2">Gamma Exposure Profile (GEX)</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gexData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <XAxis 
                        dataKey="strike" 
                        tickFormatter={(val) => `$${(val/1000).toFixed(0)}k`} 
                        tick={{ fill: '#9ca3af' }} 
                        axisLine={{ stroke: '#9ca3af' }} 
                    />
                    <YAxis 
                        tickFormatter={formatGamma} 
                        tick={{ fill: '#9ca3af' }} 
                        axisLine={{ stroke: '#9ca3af' }} 
                    />
                    <Tooltip
                        cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                        formatter={(value) => [formatGamma(value), "Gamma"]}
                        labelFormatter={(label) => `Strike: $${label}`}
                    />
                    <Bar dataKey="gamma" isAnimationActive={false}>
                        {gexData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.gamma > 0 ? 'rgba(217, 70, 239, 0.6)' : 'rgba(59, 130, 246, 0.6)'} />
                        ))}
                    </Bar>
                    <ReferenceLine x={currentPrice} stroke="#facc15" strokeWidth={2} label={{ value: 'Current Price', position: 'insideTop', fill: '#facc15' }}/>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GEXChart;
