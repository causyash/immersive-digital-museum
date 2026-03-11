import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HiddenVault() {
    const groupRef = useRef();

    // Generate random shattered glass pieces for Idea 1 (Shattered Canvas)
    const shards = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 250; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 50 + 10,
                    (Math.random() - 0.5) * 60
                ],
                rotation: [
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                ],
                scale: Math.random() * 2 + 0.2,
                speedX: Math.random() * 0.02 - 0.01,
                speedY: Math.random() * 0.02 - 0.01,
                speedZ: Math.random() * 0.02 - 0.01
            });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.0005; // Entire vault slowly rotates

            // animate shards floating chaotically
            groupRef.current.children.forEach((shard, i) => {
                if (shard.isMesh && shards[i]) {
                    shard.rotation.x += shards[i].speedX;
                    shard.rotation.y += shards[i].speedY;
                    shard.rotation.z += shards[i].speedZ;
                }
            });
        }
    });

    return (
        <group position={[0, -60, 0]}>
            {/* Cinematic abstract lighting */}
            <ambientLight intensity={0.2} color="#4a00e0" />
            <pointLight position={[0, 10, 0]} intensity={300} color="#ff0055" distance={80} />
            <pointLight position={[0, -10, 0]} intensity={300} color="#00ffcc" distance={80} />

            {/* Vault Endless Reflective Floor */}
            <mesh position={[0, -15, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[200, 200]} />
                <meshStandardMaterial color="#020202" roughness={0.02} metalness={0.9} />
            </mesh>

            <group ref={groupRef}>
                {shards.map((data, i) => (
                    <mesh key={i} position={data.position} rotation={data.rotation} scale={data.scale}>
                        <tetrahedronGeometry args={[1, 0]} />
                        <meshPhysicalMaterial
                            color="#ffffff"
                            transmission={0.98}
                            opacity={1}
                            metalness={0.3}
                            roughness={0.05}
                            ior={1.5}
                            thickness={2}
                        />
                    </mesh>
                ))}
            </group>
        </group>
    );
}
