import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, MeshReflectorMaterial } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function Hallway() {
    const groupRef = useRef();

    // Dimensions
    const length = 100;
    const width = 20;
    const height = 15;

    return (
        <group ref={groupRef} position={[0, -2, 0]}>
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

            {/* Spotlights for frames along the walls */}
            {Array.from({ length: 10 }).map((_, i) => (
                <group key={i} position={[0, height, -40 + i * 10]}>
                    <spotLight position={[-width / 2 + 2, 0, 0]} angle={0.4} penumbra={1} intensity={15} distance={20} color="#fcdba3" castShadow />
                    <spotLight position={[width / 2 - 2, 0, 0]} angle={0.4} penumbra={1} intensity={15} distance={20} color="#fcdba3" castShadow />
                </group>
            ))}

            {/* Fog for cinematic depth */}
            <fog attach="fog" args={['#050505', 10, length - 10]} />
        </group>
    );
}

function CameraRig({ scrollProgress }) {
    useFrame((state) => {
        // Move camera forward based on scroll (max length ~ 70 units forward)
        const targetZ = 10 - (scrollProgress * 70);
        state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;

        // Add subtle walking sway
        state.camera.position.y = 2 + Math.sin(state.clock.elapsedTime * 2) * 0.05;

        // Slightly tilt camera left right for realism
        const targetRotY = Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
        state.camera.rotation.y += (targetRotY - state.camera.rotation.y) * 0.1;
    });
    return null;
}

export default function SceneManager({ scrollProgress = 0 }) {
    return (
        <Canvas shadows gl={{ antialias: false, toneMappingExposure: 1.5 }}>
            <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={60} />
            <color attach="background" args={['#050505']} />

            <Suspense fallback={null}>
                <CameraRig scrollProgress={scrollProgress} />
                <Hallway />
                {/* Adds realistic HDRI reflections implicitly, lowering intensity to fit museum mood */}
                <Environment preset="studio" environmentIntensity={0.2} />
            </Suspense>
        </Canvas>
    );
}
