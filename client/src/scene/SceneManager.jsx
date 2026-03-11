import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import HiddenVault from './HiddenVault';

function BreathingLight({ position, color, offset }) {
    const lightRef = useRef();

    useFrame((state) => {
        if (lightRef.current) {
            // Use state.clock.getElapsedTime() which is common in fiber
            lightRef.current.intensity = 15 + Math.sin(state.clock.getElapsedTime() + offset) * 3;
        }
    });

    return (
        <spotLight
            ref={lightRef}
            position={position}
            angle={0.4}
            penumbra={1}
            distance={20}
            color={color}
        />
    );
}


function CosmicDust() {
    const points = useMemo(() => {
        const p = new Float32Array(2000 * 3);
        const s = new Float32Array(2000);
        for (let i = 0; i < 2000; i++) {
            p[i * 3] = (Math.random() - 0.5) * 50;
            p[i * 3 + 1] = (Math.random() - 0.5) * 30;
            p[i * 3 + 2] = (Math.random() - 0.5) * 150;
            s[i] = Math.random() * 0.05;
        }
        return { positions: p, sizes: s };
    }, []);

    const pointsRef = useRef();
    useFrame((state) => {
        const time = state.clock.elapsedTime * 0.1;
        pointsRef.current.rotation.y = time * 0.2;
        pointsRef.current.rotation.z = time * 0.1;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={points.positions.length / 3} array={points.positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#cfa670" transparent opacity={0.3} sizeAttenuation />
        </points>
    );
}

function Hallway() {
    const groupRef = useRef();

    // Dimensions
    const length = 120; // extended for 6 halls
    const width = 20;
    const height = 15;

    return (
        <group ref={groupRef} position={[0, -2, 0]}>
            <CosmicDust />
            {/* Floor with reflection */}
            {/* Floor with reflection */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                <planeGeometry args={[width, length]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={40}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#151515"
                    metalness={0.5}
                />
            </mesh>

            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
                <planeGeometry args={[width, length]} />
                <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
            </mesh>

            {/* Left Wall */}
            <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[length, height]} />
                <meshStandardMaterial color="#111111" />
            </mesh>

            {/* Right Wall */}
            <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry args={[length, height]} />
                <meshStandardMaterial color="#111111" />
            </mesh>

            {/* Ambient Lighting */}
            <ambientLight intensity={0.1} />

            {Array.from({ length: 12 }).map((_, i) => (
                <group key={i} position={[0, height, -50 + i * 10]}>
                    <BreathingLight position={[-width / 2 + 2, 0, 0]} color="#fcdba3" offset={i} />
                    <BreathingLight position={[width / 2 - 2, 0, 0]} color="#fcdba3" offset={i + 0.5} />
                </group>
            ))}

            {/* Fog for cinematic depth */}
            <fog attach="fog" args={['#050505', 10, length - 10]} />
        </group>
    );
}

function CameraRig({ scrollProgress, isVaultOpen }) {
    const prevZ = useRef(10);
    const scrollVelocity = useRef(0);

    useFrame((state) => {
        if (isVaultOpen) {
            // Idea 5 & Idea 1: Plunge into the shattered underground vault
            state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, -50, 0.04);
            state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 0, 0.05);

            // Dynamic camera shake as it falls
            if (state.camera.position.y > -45 && state.camera.position.y < -5) {
                state.camera.position.x = Math.sin(state.clock.elapsedTime * 40) * 0.3;
                state.camera.rotation.z = Math.sin(state.clock.elapsedTime * 60) * 0.05;
                state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, -Math.PI / 3, 0.05); // heavy screen dive
            } else {
                state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.1);
                state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, 0, 0.1);
                state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, 0.1, 0.05); // Look slightly up to the shattered canvas
            }
        } else {
            // Normal horizontal walk logic through 6 halls
            const targetZ = 10 - (scrollProgress * 90);

            // Physics Recoil Logic (Visual Treat #10)
            const diff = targetZ - state.camera.position.z;
            scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, diff * 0.1, 0.1);

            // IF we were in the vault (y < -10) and it closed, we BLAST UP
            if (state.camera.position.y < -5) {
                state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2, 0.08);
                state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, Math.PI / 4, 0.1); // Look UP while blasting
            } else {
                state.camera.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.05 + (scrollVelocity.current * 0.2);
                state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, -scrollVelocity.current * 0.05, 0.1);
            }

            state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;

            // Add subtle walking sway
            // state.camera.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;

            // Slightly tilt camera left right for realism
            const targetRotY = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
            state.camera.rotation.y += (targetRotY - state.camera.rotation.y) * 0.1;

            // Revert dive mechanisms safely
            state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, 0, 0.1);
        }
    });
    return null;
}

export default function SceneManager({ scrollProgress = 0, isVaultOpen = false }) {
    return (
        <Canvas shadows gl={{ antialias: false, toneMappingExposure: 1.5 }}>
            <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
            <color attach="background" args={['#050505']} />

            <Suspense fallback={null}>
                <CameraRig scrollProgress={scrollProgress} isVaultOpen={isVaultOpen} />
                <Hallway />
                <HiddenVault />
                <Environment preset="studio" environmentIntensity={0.2} />
            </Suspense>
        </Canvas>
    );
}
