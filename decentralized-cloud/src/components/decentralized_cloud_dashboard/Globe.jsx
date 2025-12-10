import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLEnabled } from '../../utils/webgl';

// A single animated arc
const Arc = ({ start, end }) => {
  const lineRef = useRef();
  const curve = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const midPoint = vStart.clone().lerp(vEnd, 0.5).normalize().multiplyScalar(1.2);
    return new THREE.QuadraticBezierCurve3(vStart, midPoint, vEnd);
  }, [start, end]);

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const t = (clock.getElapsedTime() % 2) / 2; // Loop animation every 2 seconds
      const point = curve.getPoint(t);
      // This is a bit of a hack to animate a single point, a real implementation would use a custom shader
      // For this example, we'll just sparkle the line
      lineRef.current.material.opacity = Math.sin(t * Math.PI) * 0.8 + 0.2;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry" setFromPoints={curve.getPoints(50)} />
      <lineBasicMaterial attach="material" color="#00ffff" transparent opacity={0.5} />
    </line>
  );
};


// Component for the nodes and arcs
const GlobeScene = () => {
  const nodes = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 300; i++) {
      const phi = Math.acos(-1 + (2 * i) / 299);
      const theta = Math.sqrt(300 * Math.PI) * phi;
      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);
      temp.push([x, y, z]);
    }
    return temp;
  }, []);

  const arcs = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 10; i++) {
      const start = nodes[Math.floor(Math.random() * nodes.length)];
      const end = nodes[Math.floor(Math.random() * nodes.length)];
      temp.push({ start, end });
    }
    return temp;
  }, [nodes]);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#4dffff" intensity={0.5} />
      
      <Sphere args={[1.2, 32, 32]}>
        <meshStandardMaterial color="#005f73" wireframe transparent opacity={0.3} />
      </Sphere>

      {/* Render nodes as small points */}
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={new Float32Array(nodes.flat())}
            itemSize={3}
            count={nodes.length}
          />
        </bufferGeometry>
        <pointsMaterial attach="material" size={0.005} color="#94d2bd" />
      </points>

      {/* Render animated arcs */}
      {arcs.map((arc, i) => (
        <Arc key={i} start={arc.start} end={arc.end} />
      ))}

      <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
    </>
  );
};


const Globe = () => {
  const [webGLEnabled, setWebGLEnabled] = useState(false);

  useEffect(() => {
    setWebGLEnabled(isWebGLEnabled());
  }, []);

  if (!webGLEnabled) {
    return (
      <div className="h-full w-full bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700/80 shadow-lg flex items-center justify-center">
        <p className="text-center text-gray-400">
          WebGL is not supported or is disabled. <br />
          Cannot display 3D globe.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/80 shadow-lg relative">
      <Canvas camera={{ position: [0, 0, 2] }}>
        <GlobeScene />
      </Canvas>

    </div>
  );
};

export default Globe;
