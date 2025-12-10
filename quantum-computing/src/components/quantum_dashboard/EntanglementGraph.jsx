import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NUM_QUBITS = 8;
const SVG_SIZE = 400;
const CENTER = SVG_SIZE / 2;
const RADIUS = SVG_SIZE / 2 - 50; // Radius for qubit placement

// Utility to generate initial qubit positions in a circle
const generateQubitPositions = (numQubits) => {
  const positions = [];
  for (let i = 0; i < numQubits; i++) {
    const angle = (i / numQubits) * Math.PI * 2;
    positions.push({
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle),
    });
  }
  return positions;
};

// Quantum Particles for background
const QuantumParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      id: Math.random(),
      x: Math.random() * SVG_SIZE,
      y: Math.random() * SVG_SIZE,
      r: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 10 + 5,
    }));
  }, []);

  return (
    <g>
      {particles.map(p => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill="#38bdf8"
          fillOpacity="0.3"
          animate={{
            x: p.x + (Math.random() - 0.5) * 50,
            y: p.y + (Math.random() - 0.5) * 50,
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
};


const EntanglementGraph = () => {
  const [qubitStates, setQubitStates] = useState(() =>
    Array.from({ length: NUM_QUBITS }, (_, i) => ({
      id: i,
      entangledWith: [],
      pos: generateQubitPositions(NUM_QUBITS)[i],
    }))
  );

  const [activeEntanglements, setActiveEntanglements] = useState([]);

  useEffect(() => {
    // Simulate entanglement changes
    const entanglementInterval = setInterval(() => {
      setActiveEntanglements(prev => {
        const newEntanglements = new Set(prev.map(e => `${e[0]}-${e[1]}`));

        // Randomly add/remove entanglements
        const q1 = Math.floor(Math.random() * NUM_QUBITS);
        let q2 = Math.floor(Math.random() * NUM_QUBITS);
        while (q2 === q1) { // Ensure q1 != q2
          q2 = Math.floor(Math.random() * NUM_QUBITS);
        }
        const entanglementPair = q1 < q2 ? [q1, q2] : [q2, q1];
        const key = `${entanglementPair[0]}-${entanglementPair[1]}`;

        if (newEntanglements.has(key)) {
          newEntanglements.delete(key); // Break entanglement
        } else {
          newEntanglements.add(key); // Form entanglement
        }

        return Array.from(newEntanglements).map(k => k.split('-').map(Number));
      });
    }, 1500); // Change entanglement every 1.5 seconds

    return () => clearInterval(entanglementInterval);
  }, []);

  const getLineKey = (e) => `${e[0]}-${e[1]}`;
  const entangledQubits = useMemo(() => new Set(activeEntanglements.flat()), [activeEntanglements]);


  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg h-full relative overflow-hidden">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wider">Qubit Entanglement Graph</h2>
      
      <svg width={SVG_SIZE} height={SVG_SIZE} viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="block mx-auto">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#a78bfa" /> {/* Light Purple */}
            <stop offset="100%" stopColor="#38bdf8" /> {/* Cyan */}
          </linearGradient>
          {/* SVG Filter for Glow Effect */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <QuantumParticles /> {/* Background particles */}

        <g>
          {/* Entanglement Lines */}
          <AnimatePresence>
            {activeEntanglements.map(pair => {
              const q1 = qubitStates[pair[0]].pos;
              const q2 = qubitStates[pair[1]].pos;
              return (
                <motion.line
                  key={getLineKey(pair)}
                  x1={q1.x} y1={q1.y}
                  x2={q2.x} y2={q2.y}
                  stroke="url(#lineGradient)"
                  strokeWidth="2.5" // Slightly thicker
                  strokeLinecap="round"
                  filter="url(#glow)" // Apply glow
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              );
            })}
          </AnimatePresence>

          {/* Qubit Nodes */}
          {qubitStates.map(qubit => (
            <motion.g
              key={qubit.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.circle
                cx={qubit.pos.x}
                cy={qubit.pos.y}
                r="10"
                fill="#8b5cf6" // Purple
                stroke="#a78bfa"
                strokeWidth="2"
                filter={entangledQubits.has(qubit.id) ? "url(#glow)" : undefined} // Apply glow if entangled
                className={`${entangledQubits.has(qubit.id) ? "" : ""} hover:scale-125 transition-transform duration-200 cursor-pointer`}
                whileHover={{ scale: 1.2 }}
              />
              <text
                x={qubit.pos.x}
                y={qubit.pos.y + 30} // Position label below qubit
                textAnchor="middle"
                fill="#c4b5fd"
                fontSize="12"
              >
                Q{qubit.id}
              </text>
            </motion.g>
          ))}
        </g>
      </svg>
      <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400">
        Simulated Entanglement Status
      </div>
    </div>
  );
};

export default EntanglementGraph;
