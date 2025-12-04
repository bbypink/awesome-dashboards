import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FlowBackground = () => {
  const meshRef = useRef();
  const uniforms = useRef({
    u_time: { value: 0.0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_color1: { value: new THREE.Color('#3A0CA3') }, // Deep Purple
    u_color2: { value: new THREE.Color('#4361EE') }, // Blue
    u_color3: { value: new THREE.Color('#4CC9F0') }, // Cyan
  });

  useFrame(({ clock }) => {
    uniforms.current.u_time.value = clock.getElapsedTime();
  });

  // Handle window resize
  const handleResize = () => {
    uniforms.current.u_resolution.value.set(window.innerWidth, window.innerHeight);
  };
  React.useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <mesh ref={meshRef} scale={[window.innerWidth / 100, window.innerHeight / 100, 1]}>
      <planeGeometry args={[100, 100, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms.current}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float u_time;
          uniform vec2 u_resolution;
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          uniform vec3 u_color3;
          varying vec2 vUv;

          // Perlin noise by Ashima Arts
          vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
          vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

          float cnoise(vec2 P) {
              vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
              vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
              Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
              vec4 ix = Pi.xzxz;
              vec4 iy = Pi.yyww;
              vec4 fx = Pf.xzxz;
              vec4 fy = Pf.yyww;

              vec4 i = permute(permute(ix) + iy);

              vec4 gx = fract(i / 41.0) * 2.0 - 1.0 ;
              vec4 gy = abs(gx) - 0.5;
              vec4 tx = floor(gx + 0.5);
              gy = sign(tx) * gy;
              gx = abs(gx) - tx;

              vec2 g00 = vec2(gx.x,fy.x);
              vec2 g10 = vec2(gx.y,fy.y);
              vec2 g01 = vec2(gx.z,fy.z);
              vec2 g11 = vec2(gx.w,fy.w);

              vec4 norm = inversesqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
              g00 *= norm.x;
              g01 *= norm.y;
              g10 *= norm.z;
              g11 *= norm.w;

              float n00 = dot(g00, vec2(fx.x, fy.x));
              float n10 = dot(g10, vec2(fx.y, fy.y));
              float n01 = dot(g01, vec2(fx.z, fy.z));
              float n11 = dot(g11, vec2(fx.w, fy.w));

              vec2 f = fade(Pf.xy);
              vec4 n_z = mix(vec4(n00, n10, n01, n11), vec4(n01, n11, n00, n10), f.x);
              vec2 n_xy = mix(n_z.xy, n_z.zw, f.y);
              return 2.2 * dot(n_xy, vec2(1.0, 1.0));
          }

          void main() {
            vec2 st = vUv;
            vec2 p = st * 8.0;
            p += cnoise(p + u_time * 0.1) * 1.5;

            float r = cnoise(p * 0.7 + u_time * 0.2) * 0.5 + 0.5;
            float g = cnoise(p * 0.8 + u_time * 0.3) * 0.5 + 0.5;
            float b = cnoise(p * 0.9 + u_time * 0.4) * 0.5 + 0.5;

            vec3 color = mix(mix(u_color1, u_color2, r), u_color3, g);
            color = mix(color, u_color1, b);

            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

const PredictiveFlowBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <FlowBackground />
      </Canvas>
    </div>
  );
};

export default PredictiveFlowBackground;
