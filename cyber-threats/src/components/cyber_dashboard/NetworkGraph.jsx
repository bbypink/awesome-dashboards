import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';


// Define some example nodes (servers/regions)
const initialNodesData = [
    { id: 'Server_A', position: new THREE.Vector3(-2, 1, 0), status: 'normal' },
    { id: 'Server_B', position: new THREE.Vector3(2, 1, 0), status: 'normal' },
    { id: 'Region_C', position: new THREE.Vector3(0, -1, 2), status: 'normal' },
    { id: 'DB_D', position: new THREE.Vector3(0, -2, -1), status: 'normal' },
    { id: 'Gateway_E', position: new THREE.Vector3(3, -1, -2), status: 'normal' },
    { id: 'Client_F', position: new THREE.Vector3(-3, -2, 2), status: 'normal' },
    { id: 'Sensor_G', position: new THREE.Vector3(1, 3, -1), status: 'normal' },
    { id: 'Firewall_H', position: new THREE.Vector3(-1, 3, 1), status: 'normal' },
];

// Define some example connections
const initialConnectionsData = [
    { from: 'Server_A', to: 'Server_B', status: 'normal' },
    { from: 'Server_A', to: 'Region_C', status: 'normal' },
    { from: 'Server_B', to: 'DB_D', status: 'normal' },
    { from: 'Region_C', to: 'Gateway_E', status: 'normal' },
    { from: 'DB_D', to: 'Server_A', status: 'normal' },
    { from: 'Gateway_E', to: 'Client_F', status: 'normal' },
    { from: 'Client_F', to: 'Server_B', status: 'normal' },
    { from: 'Sensor_G', to: 'Server_A', status: 'normal' },
    { from: 'Firewall_H', to: 'Gateway_E', status: 'normal' },
    { from: 'Server_B', to: 'Sensor_G', status: 'normal' },
];

// Component for a single node
const Node = ({ position, name, status }) => {
    const meshRef = useRef();
    const color = useMemo(() => {
        switch (status) {
            case 'alert': return '#ffff00'; // Yellow
            case 'compromised': return '#ff0000'; // Red
            default: return '#00ff00'; // Green
        }
    }, [status]);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 5 + position.x) * (status === 'normal' ? 0.05 : 0.15));
        }
    });

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshBasicMaterial color={color} emissive={color} emissiveIntensity={0.8} />
            </mesh>
            {status !== 'normal' && (
                <pointLight distance={1.5} intensity={1} color={color} />
            )}
            {status !== 'normal' && (
                <mesh scale={[1.5, 1.5, 1.5]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshBasicMaterial color={color} transparent opacity={0.3} />
                </mesh>
            )}
        </group>
    );
};

// Component for a connection line with animated "data flow"
const Connection = ({ start, end, status }) => {
    const curve = useMemo(() => {
        return new THREE.CatmullRomCurve3([start, end]);
    }, [start, end]);

    const color = useMemo(() => {
        switch (status) {
            case 'alert': return '#ffff00'; // Yellow
            case 'compromised': return '#ff0000'; // Red
            default: return '#00ff00'; // Green
        }
    }, [status]);

    return (
        <mesh>
            <tubeGeometry args={[curve, 64, 0.01, 4, false]} />
            <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
    );
};


const NetworkGraph = () => {
    const [nodes, setNodes] = useState(initialNodesData);
    const [connections, setConnections] = useState(initialConnectionsData);

    // Map node IDs to their positions for easy lookup
    const nodePositions = useMemo(() => {
        const map = new Map();
        nodes.forEach(node => map.set(node.id, node.position)); // Corrected to use 'nodes' state
        return map;
    }, [nodes]);

    // Simulate network events
    useEffect(() => {
        const nodeInterval = setInterval(() => {
            setNodes(prevNodes => {
                const updatedNodes = prevNodes.map(node => {
                    if (Math.random() < 0.2) { // 20% chance to change status
                        const statuses = ['normal', 'alert', 'compromised'];
                        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        return { ...node, status: newStatus };
                    }
                    return node;
                });
                return updatedNodes;
            });
        }, 2000); // Update node status every 2 seconds

        const connInterval = setInterval(() => {
            setConnections(prevConnections => {
                const updatedConnections = prevConnections.map(conn => {
                    if (Math.random() < 0.1) { // 10% chance to change status
                        const statuses = ['normal', 'alert', 'compromised'];
                        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                        return { ...conn, status: newStatus };
                    }
                    return conn;
                });
                return updatedConnections;
            });
        }, 3000); // Update connection status every 3 seconds

        return () => {
            clearInterval(nodeInterval);
            clearInterval(connInterval);
        };
    }, []);


    return (
        <div className="w-full h-full">
            <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={10000} factor={4} saturation={1} fade />

                {/* Render Nodes */}
                {nodes.map(node => (
                    <Node key={node.id} position={node.position} name={node.id} status={node.status} />
                ))}

                {/* Render Connections */}
                {connections.map((conn, index) => (
                    <Connection
                        key={index}
                        start={nodePositions.get(conn.from)}
                        end={nodePositions.get(conn.to)}
                        status={conn.status}
                    />
                ))}

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} autoRotate={true} autoRotateSpeed={0.3} />
            </Canvas>
        </div>
    );
};

export default NetworkGraph;
