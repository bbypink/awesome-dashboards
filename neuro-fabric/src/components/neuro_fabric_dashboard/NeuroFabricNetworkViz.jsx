import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';

// Helper to generate a random color
const getRandomColor = () => {
  const colors = [0xff00ff, 0x00ffff, 0xffff00, 0xff0066, 0x00ffcc]; // Neon-like colors
  return colors[Math.floor(Math.random() * colors.length)];
};

const Neuron = ({ position, active, color }) => {
  const ref = useRef();
  const [scale, setScale] = useState(1);
  const initialColor = useMemo(() => new THREE.Color(color).clone(), [color]);
  const activeColor = useMemo(() => new THREE.Color(0xffffff).clone(), []); // Bright white when active

  useFrame(() => {
    if (active) {
      // Scale up and then down rapidly
      setScale(s => Math.max(1, s - 0.05)); // Decrease scale
      if (scale === 1) setScale(1.5); // Reset scale
      // Also pulse color
      ref.current.material.color.lerp(activeColor, 0.2);
    } else {
      // Return to original scale and color
      setScale(s => (s > 1 ? Math.max(1, s - 0.02) : 1));
      ref.current.material.color.lerp(initialColor, 0.05);
    }
  });

  return (
    <Sphere args={[0.2 * scale, 16, 16]} position={position} ref={ref}>
      <meshStandardMaterial emissive={color} emissiveIntensity={active ? 1.5 : 0.5} />
    </Sphere>
  );
};

const Connection = ({ start, end, active, color }) => {
  const ref = useRef();
  const initialColor = useMemo(() => new THREE.Color(color).clone(), [color]);
  const activeColor = useMemo(() => new THREE.Color(0xffffff).clone(), []); // Bright white when active

  useFrame(() => {
    if (active) {
      ref.current.material.color.lerp(activeColor, 0.2);
    } else {
      ref.current.material.color.lerp(initialColor, 0.05);
    }
  });

  return (
    <Line points={[start, end]} color={color} lineWidth={active ? 3 : 1} ref={ref}>
      <meshBasicMaterial transparent opacity={active ? 0.8 : 0.3} />
    </Line>
  );
};

const NeuralNetwork = ({ numLayers, neuronsPerLayer }) => {
  const [neuronStates, setNeuronStates] = useState([]);
  const [connectionStates, setConnectionStates] = useState([]);

  // Generate network structure
  const network = useMemo(() => {
    const layers = [];
    const connections = [];

    // Create neurons
    for (let i = 0; i < numLayers; i++) {
      layers[i] = [];
      const layerOffset = i * 2.5 - (numLayers * 2.5) / 2 + 1.25; // Distribute layers
      const currentNeurons = neuronsPerLayer[i] || neuronsPerLayer[0];

      for (let j = 0; j < currentNeurons; j++) {
        const neuronOffset = j * 0.8 - (currentNeurons * 0.8) / 2 + 0.4;
        const color = getRandomColor();
        layers[i].push({
          id: `n-${i}-${j}`,
          position: [layerOffset, neuronOffset, (Math.random() - 0.5) * 0.5], // Slight z-randomness
          color: color,
        });
      }
    }

    // Create connections
    for (let i = 0; i < numLayers - 1; i++) {
      layers[i].forEach(neuronA => {
        layers[i + 1].forEach(neuronB => {
          connections.push({
            id: `c-${neuronA.id}-${neuronB.id}`,
            start: neuronA.position,
            end: neuronB.position,
            color: neuronA.color, // Color based on source neuron
          });
        });
      });
    }

    return { layers, connections };
  }, [numLayers, neuronsPerLayer]);

  // Simulate network activity
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly activate some neurons
      const newNeuronStates = network.layers.flat().map(neuron => ({
        id: neuron.id,
        active: Math.random() < 0.02, // Small chance of activation
      }));
      setNeuronStates(newNeuronStates);

      // Randomly activate some connections (simulating data flow)
      const newConnectionStates = network.connections.map(conn => ({
        id: conn.id,
        active: Math.random() < 0.01, // Small chance of activation
      }));
      setConnectionStates(newConnectionStates);

    }, 200); // Update every 200ms

    return () => clearInterval(interval);
  }, [network]);

  return (
    <>
      {network.layers.flat().map(neuron => (
        <Neuron
          key={neuron.id}
          position={neuron.position}
          color={neuron.color}
          active={neuronStates.find(s => s.id === neuron.id)?.active || false}
        />
      ))}
      {network.connections.map(conn => (
        <Connection
          key={conn.id}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          active={connectionStates.find(s => s.id === conn.id)?.active || false}
        />
      ))}
    </>
  );
};

const NeuroFabricNetworkViz = () => {
  return (
    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-gray-900 to-black rounded-lg">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />

        <NeuralNetwork numLayers={5} neuronsPerLayer={[10, 8, 8, 5, 2]} />
        <OrbitControls enableZoom enablePan enableRotate />
      </Canvas>
    </div>
  );
};

export default NeuroFabricNetworkViz;

