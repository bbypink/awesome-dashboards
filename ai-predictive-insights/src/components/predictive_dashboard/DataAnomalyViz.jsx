import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const AnomalyRing = ({ position, severity }) => {
  const meshRef = useRef();
  const [scale] = useState(() => Math.random() * 0.5 + 0.5); // Random initial scale factor
  const initialOpacity = 0.6;

  const color = useMemo(() => {
    switch (severity) {
      case 'high': return new THREE.Color('#FF0055'); // Reddish pink
      case 'medium': return new THREE.Color('#FFFF00'); // Yellow
      default: return new THREE.Color('#00FFCC'); // Cyan
    }
  }, [severity]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() * 0.5; // Slow down animation
      const currentScale = scale + Math.sin(t * 2) * 0.2; // Pulsing effect
      meshRef.current.scale.set(currentScale, currentScale, currentScale);

      // Fade out
      const opacity = initialOpacity * (1 - (t % 1)); // Fade from 1 to 0 over 1 second
      if (meshRef.current.material) {
        meshRef.current.material.opacity = opacity;
      }

      // Remove after animation cycle (e.g., every 2 seconds)
      if (t > 2) {
        // This component will be unmounted by parent if not needed
      }
    }
  });

  return (
    <mesh position={position} ref={meshRef}>
      <torusGeometry args={[0.5, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={initialOpacity} />
    </mesh>
  );
};


const DataAnomalyViz = () => {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Update age of existing anomalies and filter out old ones
      setAnomalies(prev => {
        const updatedAges = prev.map(a => ({ ...a, age: a.age + 1 })); // Increment age
        const filteredAnomalies = updatedAges.filter(a => a.age < 2); // Rings last 2 cycles (2 seconds)

        const newAnomaly = {
            id: Math.random(),
            position: new THREE.Vector3((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2),
            severity: Math.random() < 0.2 ? 'high' : (Math.random() < 0.5 ? 'medium' : 'low'),
            age: 0, // New anomalies start with age 0
        };
        return [...filteredAnomalies, newAnomaly];
      });
    }, 1000); // New anomaly and age update every second

    return () => clearInterval(interval);
  }, []);

  // Removed useFrame from here

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <pointLight position={[10, 10, 10]} intensity={1} />
        <ambientLight intensity={0.5} />
        {anomalies.map(a => (
          <AnomalyRing key={a.id} position={a.position} severity={a.severity} />
        ))}
        <OrbitControls />
      </Canvas>
      <div className="absolute top-2 left-2 text-xs text-yellow-300/50 z-10">
        AI ANOMALY DETECTION
      </div>
    </div>
  );
};

export default DataAnomalyViz;
