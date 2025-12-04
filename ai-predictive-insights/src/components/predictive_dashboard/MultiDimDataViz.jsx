import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const DataCrystal = ({ dataValue }) => {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_data: { value: dataValue },
    u_color_base: { value: new THREE.Color('#4CC9F0') }, // Cyan base
    u_color_accent: { value: new THREE.Color('#8A2BE2') }, // Purple accent
  }), []);

  useFrame(({ clock }) => {
    uniforms.u_time.value = clock.getElapsedTime();
    uniforms.u_data.value = dataValue;
    
    if (meshRef.current) {
        // More subtle and data-influenced rotation
        meshRef.current.rotation.x += 0.0005 + (dataValue * 0.0001);
        meshRef.current.rotation.y += 0.0007 + (dataValue * 0.0002);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 8]} /> {/* Increased subdivisions */}
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          uniform float u_time;
          uniform float u_data;
          varying vec2 vUv;
          varying float vDistortion;
          varying float vNoise;

          // Classic Perlin 2D Noise
          vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
          vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }
          float cnoise(vec2 P) {
              vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
              vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
              Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
              vec4 i = permute(permute(Pi.xzxz) + Pi.yyww);
              vec4 gx = fract(i / 41.0) * 2.0 - 1.0 ;
              vec4 gy = abs(gx) - 0.5;
              vec4 tx = floor(gx + 0.5);
              gy = sign(tx) * gy;
              gx = abs(gx) - tx;
              vec2 g00 = vec2(gx.x,Pf.x);
              vec2 g10 = vec2(gx.y,Pf.y);
              vec2 g01 = vec2(gx.z,Pf.z);
              vec2 g11 = vec2(gx.w,Pf.w);
              vec4 norm = inversesqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
              g00 *= norm.x;
              g01 *= norm.y;
              g10 *= norm.z;
              g11 *= norm.w;
              float n00 = dot(g00, vec2(Pf.x, Pf.y));
              float n10 = dot(g10, vec2(Pf.z, Pf.w));
              float n01 = dot(g01, vec2(Pf.x - 1.0, Pf.y));
              float n11 = dot(g11, vec2(Pf.z - 1.0, Pf.w));
              vec2 f = fade(Pf.xy);
              vec4 n_z = mix(vec4(n00, n10, n01, n11), vec4(n01, n11, n00, n10), f.x);
              vec2 n_xy = mix(n_z.xy, n_z.zw, f.y);
              return 2.2 * dot(n_xy, vec2(1.0, 1.0));
          }

          void main() {
            vUv = uv;
            vec3 transformed = position;
            
            // Layered noise for organic displacement
            float noise1 = cnoise(position.xy * 2.0 + u_time * 0.1);
            float noise2 = cnoise(position.yz * 3.0 + u_time * 0.15);
            float noise3 = cnoise(position.zx * 4.0 + u_time * 0.2);
            
            float displacement = (noise1 + noise2 + noise3) / 3.0;
            displacement = pow(displacement, 2.0) * u_data * 0.5; // Data influences strength

            transformed += normal * displacement;
            vDistortion = displacement;
            vNoise = noise1; // Pass some noise to fragment for color variation

            gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          uniform float u_data;
          uniform vec3 u_color_base;
          uniform vec3 u_color_accent;
          varying vec2 vUv;
          varying float vDistortion;
          varying float vNoise;

          void main() {
            vec3 baseColor = mix(u_color_base, u_color_accent, smoothstep(0.2, 0.8, u_data));
            vec3 finalColor = baseColor;
            
            // Add some glow based on noise and time
            float glow = sin(vNoise * 10.0 + u_time * 2.0) * 0.1 + 0.1;
            glow += vDistortion * 0.5;
            finalColor += glow * u_color_accent * 0.5;

            // Fresnel effect for edge glow
            vec3 normal = normalize(vec3(vUv - 0.5, 0.5));
            float fresnel = dot(normal, vec3(0.0, 0.0, 1.0));
            fresnel = pow(fresnel, 4.0) * 1.5; // Sharper, stronger Fresnel
            finalColor += u_color_accent * fresnel * (0.5 + u_data * 0.5); // Data influences Fresnel strength
            
            gl_FragColor = vec4(finalColor, 0.8 + fresnel * 0.2); // Translucent with enhanced Fresnel
          }
        `}
        transparent={true}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const MultiDimDataViz = () => {
  const [dataValue, setDataValue] = useState(0.5);

  useEffect(() => {
    const interval = setInterval(() => {
      setDataValue(Math.random() * 0.8 + 0.2); // Simulate data changes between 0.2 and 1.0
    }, 2000); // Update data every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full relative">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <DataCrystal dataValue={dataValue} />
        <OrbitControls />
      </Canvas>
      <div className="absolute top-2 left-2 text-xs text-purple-300/50 z-10">
        AI DATA CRYSTAL
      </div>
    </div>
  );
};

export default MultiDimDataViz;
