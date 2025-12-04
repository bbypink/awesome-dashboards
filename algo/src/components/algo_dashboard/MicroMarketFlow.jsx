import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// GLSL Noise functions (Perlin Noise 3D) - essential for organic flow
const glslNoise3D = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float pnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ambp = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 bmbp = vec4(Pi0.y, Pi0.y, Pi1.y, Pi1.y);
  vec4 cmbp = vec4(Pi0.z, Pi0.z, Pi0.z, Pi0.z);
  vec4 i = permute(permute(ambp) + bmbp);
  vec4 gx = fract(i / 41.0) * 2.0 - 1.0;
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gy = sign(tx) * gy;
  gx = abs(gx) - tx;
  vec4 g000 = vec4(gx.x, gy.x, gx.y, gy.y);
  vec4 g100 = vec4(gx.z, gy.z, gx.w, gy.w);
  vec4 g001 = vec4(gx.x, gy.x, gx.y, gy.y);
  vec4 g101 = vec4(gx.z, gy.z, gx.w, gy.w);
  vec4 g010 = vec4(gx.x, gy.x, gx.y, gy.y);
  vec4 g110 = vec4(gx.z, gy.z, gx.w, gy.w);
  vec4 g011 = vec4(gx.x, gy.x, gx.y, gy.y);
  vec4 g111 = vec4(gx.z, gy.z, gx.w, gy.w);
  vec4 r_vec = taylorInvSqrt(g000 * g000 + g100 * g100 + g001 * g001 + g101 * g101);
  vec4 t_vec = taylorInvSqrt(g010 * g010 + g110 * g110 + g011 * g011 + g111 * g111);
  g000 *= r_vec.x;
  g100 *= r_vec.y;
  g001 *= r_vec.z;
  g101 *= r_vec.w;
  g010 *= t_vec.x;
  g110 *= t_vec.y;
  g011 *= t_vec.z;
  g111 *= t_vec.w;
  vec3 s_in_fade = fade(Pf0);
  vec4 n_Pi0 = dot(g000, Pf0.xzy) + dot(g100, Pf1.xzy);
  vec4 n_Pi1 = dot(g001, Pf0.xzy) + dot(g101, Pf1.xzy);
  vec4 n_Pj0 = dot(g010, Pf0.xzy) + dot(g110, Pf1.xzy);
  vec4 n_Pj1 = dot(g011, Pf0.xzy) + dot(g111, Pf1.xzy);
  vec3 n_fade = mix(n_Pi0, n_Pi1, s_in_fade.z);
  vec3 n_fade_P = mix(n_Pj0, n_Pj1, s_in_fade.z);
  vec2 n_fade_Q = mix(n_fade.xy, n_fade.zw, s_in_fade.y);
  return 2.2 * mix(n_fade_Q.x, n_fade_Q.y, s_in_fade.x);
}
`;


const FlowParticles = ({ flowSpeed, dataPressure }) => {
  const meshRef = useRef();
  const numParticles = 10000;

  const particles = useMemo(() => {
    const positions = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }
    return positions;
  }, []);

  const uniforms = useRef({
    u_time: { value: 0 },
    u_flow_speed: { value: flowSpeed },
    u_data_pressure: { value: dataPressure },
    u_color_low: { value: new THREE.Color(0x00A8FF) }, // Blue
    u_color_high: { value: new THREE.Color(0xFF00A8) }, // Pink
  });

  useFrame(({ clock }) => {
    uniforms.current.u_time.value = clock.getElapsedTime();
    uniforms.current.u_flow_speed.value = flowSpeed;
    uniforms.current.u_data_pressure.value = dataPressure;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={particles}
          count={particles.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        attach="material"
        uniforms={uniforms.current}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute vec3 position;
          uniform float u_time;
          uniform float u_flow_speed;
          uniform float u_data_pressure;
          ${glslNoise3D} // Include noise function

          varying float vIntensity;

          void main() {
            vec3 p = position;
            
            // Flow effect using noise
            float flow_offset_x = pnoise(vec3(p.x * 0.1, p.y * 0.1, u_time * 0.1 * u_flow_speed)) * 0.5;
            float flow_offset_y = pnoise(vec3(p.y * 0.1, p.z * 0.1, u_time * 0.1 * u_flow_speed)) * 0.5;
            float flow_offset_z = pnoise(vec3(p.z * 0.1, p.x * 0.1, u_time * 0.1 * u_flow_speed)) * 0.5;

            p.x += flow_offset_x * u_flow_speed;
            p.y += flow_offset_y * u_flow_speed;
            p.z += flow_offset_z * u_flow_speed;

            // Simple warp effect based on data pressure
            float warp = sin(p.x * 0.5 + p.y * 0.5 + u_time * 0.5) * 0.2 * u_data_pressure;
            p.z += warp;

            vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (2.0 + u_data_pressure * 2.0) * (1.0 / -mvPosition.z); // Size influenced by data pressure
            gl_Position = projectionMatrix * mvPosition;
            
            vIntensity = (pnoise(p * 0.2 + u_time * 0.2) + 1.0) / 2.0; // Pass intensity to fragment
          }
        `}
        fragmentShader={`
          uniform vec3 u_color_low;
          uniform vec3 u_color_high;
          varying float vIntensity;

          void main() {
            vec3 color = mix(u_color_low, u_color_high, vIntensity);
            gl_FragColor = vec4(color, vIntensity * 0.8);
          }
        `}
      />
    </points>
  );
};


const MicroMarketFlow = () => {
  const [flowSpeed, setFlowSpeed] = useState(0.5);
  const [dataPressure, setDataPressure] = useState(0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlowSpeed(Math.random() * 0.5 + 0.5); // Between 0.5 and 1.0
      setDataPressure(Math.random() * 0.8 + 0.2); // Between 0.2 and 1.0
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.8} />
        <FlowParticles flowSpeed={flowSpeed} dataPressure={dataPressure} />
        <OrbitControls enableZoom={true} enablePan={false} enableRotate={true} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
      <div className="absolute top-2 left-2 text-xs text-blue-300/50 z-10">
        MICRO-MARKET FLOW
      </div>
    </div>
  );
};

export default MicroMarketFlow;
