import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

const nodesData = [
    { id: 'NYC', x: 20, y: 30, latency: 20, status: 'stable' },
    { id: 'LDN', x: 45, y: 20, latency: 50, status: 'stable' },
    { id: 'TYO', x: 80, y: 35, latency: 80, status: 'stable' },
    { id: 'CHI', x: 30, y: 60, latency: 30, status: 'stable' },
    { id: 'HKG', x: 70, y: 65, latency: 60, status: 'stable' },
];

const linksData = [
    { from: 'NYC', to: 'LDN', latency: 40, status: 'stable' },
    { from: 'LDN', to: 'TYO', latency: 120, status: 'stable' },
    { from: 'NYC', to: 'CHI', latency: 10, status: 'stable' },
    { from: 'TYO', to: 'HKG', latency: 20, status: 'stable' },
    { from: 'CHI', to: 'HKG', latency: 90, status: 'stable' },
    { from: 'LDN', to: 'HKG', latency: 150, status: 'stable' },
];

const getLatencyColor = (latency) => {
    if (latency > 100) return 'red-500';
    if (latency > 50) return 'yellow-500';
    return 'green-500';
};

const LatencyNode = ({ node }) => {
    const pulseVariant = node.status === 'warning' ? {
        scale: [1, 1.2, 1],
        boxShadow: ["0 0 0px #FFFF00", "0 0 8px #FFFF00", "0 0 0px #FFFF00"]
    } : node.status === 'critical' ? {
        scale: [1, 1.3, 1],
        boxShadow: ["0 0 0px #FF0000", "0 0 10px #FF0000", "0 0 0px #FF0000"]
    } : {};
    const pulseTransition = node.status !== 'stable' ? {
        repeat: Infinity, duration: 1.5, ease: "easeInOut"
    } : {};

    return (
        <motion.div
            className={`absolute w-4 h-4 rounded-full flex items-center justify-center text-xs text-black font-bold`}
            style={{ 
                left: `${node.x}%`, 
                top: `${node.y}%`, 
                backgroundColor: `var(--color-${getLatencyColor(node.latency)})` 
            }}
            animate={pulseVariant}
            transition={pulseTransition}
        >
            <span className="sr-only">{node.id}: {node.latency}ms</span>
        </motion.div>
    );
};

const LatencyMonitor = () => {
    const [nodes, setNodes] = useState(nodesData);
    const [links, setLinks] = useState(linksData);

    // Dynamic Tailwind colors for CSS variables
    const colors = {
      '--color-red-500': '#EF4444',
      '--color-yellow-500': '#F59E0B',
      '--color-green-500': '#10B981',
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(prevNodes => prevNodes.map(node => {
                const newLatency = Math.max(10, Math.min(200, node.latency + (Math.random() - 0.5) * 20));
                let newStatus = 'stable';
                if (newLatency > 150) newStatus = 'critical';
                else if (newLatency > 80) newStatus = 'warning';
                return { ...node, latency: newLatency, status: newStatus };
            }));

            setLinks(prevLinks => prevLinks.map(link => {
                const newLatency = Math.max(10, Math.min(250, link.latency + (Math.random() - 0.5) * 30));
                let newStatus = 'stable';
                if (newLatency > 200) newStatus = 'critical';
                else if (newLatency > 100) newStatus = 'warning';
                return { ...link, latency: newLatency, status: newStatus };
            }));
        }, 1500); // Update every 1.5 seconds

        return () => clearInterval(interval);
    }, []);

    // Memoize link positions for SVG rendering
    const linkPositions = useMemo(() => {
        const nodeMap = new Map(nodes.map(n => [n.id, n]));
        return links.map(link => ({
            from: nodeMap.get(link.from),
            to: nodeMap.get(link.to),
            latency: link.latency,
            status: link.status,
            id: `${link.from}-${link.to}`,
        }));
    }, [nodes, links]);

    return (
        <div className="w-full h-full p-4 flex flex-col font-mono" style={colors}>
            <h3 className="text-xl font-bold text-cyan-400 mb-4">LATENCY MONITOR</h3>
            <div className="flex-grow relative border border-gray-700 rounded-lg overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {linkPositions.map(link => {
                        const colorClass = getLatencyColor(link.latency);
                        const strokeColor = `var(--color-${colorClass})`;
                        const dashArray = link.latency > 100 ? "5 5" : "10 0"; // Dashed for higher latency

                        return (
                            <motion.line
                                key={link.id}
                                x1={`${link.from.x}%`} y1={`${link.from.y}%`}
                                x2={`${link.to.x}%`} y2={`${link.to.y}%`}
                                stroke={strokeColor}
                                strokeWidth="2"
                                strokeDasharray={dashArray}
                                animate={{ opacity: link.status !== 'stable' ? [0.6, 1, 0.6] : 1 }}
                                transition={{ repeat: Infinity, duration: 1 }}
                            />
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <LatencyNode key={node.id} node={node} />
                ))}
            </div>
        </div>
    );
};

export default LatencyMonitor;
