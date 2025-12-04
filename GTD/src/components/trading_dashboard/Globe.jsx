import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- City Data ---
const cities = {
    "New York": { lat: 40.7128, lon: -74.0060 },
    "London": { lat: 51.5074, lon: -0.1278 },
    "Tokyo": { lat: 35.6895, lon: 139.6917 },
    "Hong Kong": { lat: 22.3193, lon: 114.1694 },
    "Singapore": { lat: 1.3521, lon: 103.8198 },
    "Sydney": { lat: -33.8688, lon: 151.2093 },
    "Frankfurt": { lat: 50.1109, lon: 8.6821 },
    "San Francisco": { lat: 37.7749, lon: -122.4194 },
};

const cityKeys = Object.keys(cities);

// --- Helper function to convert lat/lon to 3D coordinates ---
const latLonToVector3 = (lat, lon, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
};

// --- Animated Arc Component ---
const Arc = ({ start, end }) => {
    const curve = useMemo(() => {
        const startVec = latLonToVector3(cities[start].lat, cities[start].lon, 2);
        const endVec = latLonToVector3(cities[end].lat, cities[end].lon, 2);
        const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5).normalize().multiplyScalar(2 + startVec.distanceTo(endVec) * 0.4);
        return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    }, [start, end]);

    const tubeRef = useRef();
    useFrame(({ clock }) => {
        if (tubeRef.current) {
            tubeRef.current.uniforms.u_time.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh>
            <tubeGeometry args={[curve, 64, 0.007, 8, false]} />
            <shaderMaterial
                ref={tubeRef}
                attach="material"
                transparent
                args={[{
                    uniforms: {
                        u_time: { value: 0 },
                        color: { value: new THREE.Color(0x00ffff) },
                    },
                    vertexShader: `
                        varying float v_path_progress;
                        void main() {
                            v_path_progress = position.y;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform float u_time;
                        uniform vec3 color;
                        varying float v_path_progress;
                        void main() {
                            float time_val = mod(u_time * 0.5, 2.0);
                            float opacity = 0.0;
                            if (v_path_progress > time_val - 0.2 && v_path_progress < time_val) {
                                opacity = (v_path_progress - (time_val - 0.2)) / 0.2;
                            }
                            gl_FragColor = vec4(color, opacity);
                        }
                    `,
                }]}
            />
        </mesh>
    );
};

const CityPoint = ({ city }) => {
    const position = useMemo(() => latLonToVector3(cities[city].lat, cities[city].lon, 2.01), [city]);
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#00ffff" />
        </mesh>
    );
};

const AnimatedGlobeMesh = ({ gridShaderMaterial }) => {
    const meshRef = useRef();

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.0005;
            // The gridShaderMaterial is attached as a second material
            // We need to access it correctly for uniform updates
            if (meshRef.current.material && meshRef.current.material.length > 1) {
                meshRef.current.material[1].uniforms.u_time.value = clock.getElapsedTime();
            }
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[2, 64, 64]} />
            <meshStandardMaterial color="#b0c4de" emissive="#00FFFF" emissiveIntensity={3} metalness={0.5} roughness={0.6} />
            <primitive object={gridShaderMaterial} attach="material" />
        </mesh>
    );
};


const Globe = () => {
    const [arcs, setArcs] = useState([]);
    
    const gridShaderMaterial = useMemo(() => new THREE.ShaderMaterial({
        uniforms: { u_time: { value: 0 } },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float u_time;
            varying vec2 vUv;
            void main() {
                float grid = 0.0;
                float h_lines = pow(sin(vUv.y * 30.0), 2.0);
                float v_lines = pow(sin(vUv.x * 30.0), 2.0);
                grid = max(h_lines, v_lines);
                grid = smoothstep(0.95, 1.0, grid);
                
                float scanline = sin(vUv.y * 500.0 + u_time * 2.0) * 0.05 + 0.95;

                gl_FragColor = vec4(0.0, 0.8, 0.8, grid * 0.5 * scanline);
            }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true,
        side: THREE.FrontSide,
    }), []);


    useEffect(() => {
        const interval = setInterval(() => {
            const startCity = cityKeys[Math.floor(Math.random() * cityKeys.length)];
            let endCity = cityKeys[Math.floor(Math.random() * cityKeys.length)];
            while (startCity === endCity) {
                endCity = cityKeys[Math.floor(Math.random() * cityKeys.length)];
            }
            setArcs(prev => [...prev.slice(-9), { start: startCity, end: endCity, id: Math.random() }]);
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div className="w-full h-full relative">
            <div className="absolute top-2 left-2 text-xs text-cyan-300/50 z-10">LIVE GLOBAL DATA STREAM</div>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.05} />
                <pointLight color="#63b3ed" position={[10, 10, 10]} intensity={1.0} />

                <AnimatedGlobeMesh gridShaderMaterial={gridShaderMaterial} />

                <mesh scale={[1.02, 1.02, 1.02]}>
                    <sphereGeometry args={[2, 64, 64]} />
                    <shaderMaterial
                        blending={THREE.AdditiveBlending}
                        side={THREE.BackSide}
                        transparent
                        args={[{
                            vertexShader: `
                                varying vec3 vNormal;
                                void main() {
                                    vNormal = normalize( normalMatrix * normal );
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                                }
                            `,
                            fragmentShader: `
                                varying vec3 vNormal;
                                void main() {
                                    float intensity = pow( 0.8 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) ), 4.0 );
                                    gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity;
                                }
                            `,
                        }]}
                    />
                </mesh>

                {arcs.map(arc => <Arc key={arc.id} start={arc.start} end={arc.end} />)}
                {cityKeys.map(city => <CityPoint key={city} city={city} />)}

                <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} minDistance={3} maxDistance={10} />
            </Canvas>
        </div>
    );
};

export default Globe;
