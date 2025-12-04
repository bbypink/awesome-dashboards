import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const GRID_SIZE = 4; // 4x4 grid

const getRiskColor = (risk) => {
    // Smooth interpolation between green (low) -> orange (medium) -> red (high)
    const colorLow = [0, 168, 107];   // Emerald Green
    const colorMid = [255, 165, 0];  // Orange
    const colorHigh = [220, 20, 60]; // Crimson Red

    let r, g, b;

    if (risk < 0.5) {
        // From green to orange
        const t = risk / 0.5;
        r = colorLow[0] * (1 - t) + colorMid[0] * t;
        g = colorLow[1] * (1 - t) + colorMid[1] * t;
        b = colorLow[2] * (1 - t) + colorMid[2] * t;
    } else {
        // From orange to red
        const t = (risk - 0.5) / 0.5;
        r = colorMid[0] * (1 - t) + colorHigh[0] * t;
        g = colorMid[1] * (1 - t) + colorHigh[1] * t;
        b = colorMid[2] * (1 - t) + colorHigh[2] * t;
    }

    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
};

const RiskCell = ({ riskScore }) => {
    // Subtler glow animation based on risk
    const glowColor = riskScore >= 0.5 ? '#DC143C' : '#00A86B'; // Red glow for high risk, green for low
    const glowIntensity = riskScore * 5; // Higher risk, stronger glow
    const duration = 1.0 - riskScore * 0.5; // Higher risk, faster pulse

    return (
        <motion.div
            className="flex items-center justify-center border border-gray-700/50 rounded-md text-sm font-bold text-black"
            style={{ backgroundColor: getRiskColor(riskScore) }}
            animate={{
                boxShadow: [`0 0 0px ${glowColor}`, `0 0 ${glowIntensity}px ${glowColor}`, `0 0 0px ${glowColor}`]
            }}
            transition={{ repeat: Infinity, duration: duration, ease: "easeInOut" }}
        >
            { (riskScore * 100).toFixed(0) }%
        </motion.div>
    );
};

const RiskHeatmap = () => {
    const [gridData, setGridData] = useState(() =>
        Array.from({ length: GRID_SIZE * GRID_SIZE }, () => Math.random())
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setGridData(Array.from({ length: GRID_SIZE * GRID_SIZE }, () => Math.random()));
        }, 2500); // Update risk scores every 2.5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full p-4 flex flex-col">
            <h3 className="text-xl font-bold text-red-400 mb-4">RISK HEATMAP</h3>
            <div className={`grid grid-cols-${GRID_SIZE} gap-2 flex-grow`}>
                {gridData.map((risk, index) => (
                    <RiskCell key={index} riskScore={risk} />
                ))}
            </div>
        </div>
    );
};

export default RiskHeatmap;
