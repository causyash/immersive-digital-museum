import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function AnamorphosisArt({ imageUrl }) {
    const groupRef = useRef();
    const texture = useMemo(() => new THREE.TextureLoader().load(imageUrl), [imageUrl]);

    // Create 100 cubes floating in space
    const cubeCount = 150;
    const cubeData = useMemo(() => {
        const temp = [];
        for (let i = 0; i < cubeCount; i++) {
            // Random scatter
            temp.push({
                position: [
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 4
                ],
                // Target position (grid to form the image)
                gridPos: [
                    (Math.floor(i / 15) - 5) * 0.4,
                    ((i % 15) - 7.5) * 0.4,
                    0
                ],
                scale: Math.random() * 0.3 + 0.1,
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0]
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        // Mouse influence
        const mouseX = state.mouse.x * 2;
        const mouseY = state.mouse.y * 2;

        if (groupRef.current) {
            groupRef.current.children.forEach((cube, i) => {
                const data = cubeData[i];

                // Alignment factor - as mouse gets closer to center, they align
                const alignment = Math.max(0, 1 - Math.sqrt(mouseX * mouseX + mouseY * mouseY));

                // Target position
                const targetX = THREE.MathUtils.lerp(data.position[0], data.gridPos[0], alignment);
                const targetY = THREE.MathUtils.lerp(data.position[1], data.gridPos[1], alignment);
                const targetZ = THREE.MathUtils.lerp(data.position[2], data.gridPos[2], alignment);

                cube.position.x = THREE.MathUtils.lerp(cube.position.x, targetX, 0.1);
                cube.position.y = THREE.MathUtils.lerp(cube.position.y, targetY, 0.1);
                cube.position.z = THREE.MathUtils.lerp(cube.position.z, targetZ, 0.1);

                // Rotation flattens as alignment increases
                cube.rotation.x = THREE.MathUtils.lerp(data.rotation[0] + time * 0.5, 0, alignment);
                cube.rotation.y = THREE.MathUtils.lerp(data.rotation[1] + time * 0.3, 0, alignment);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {cubeData.map((data, i) => (
                <mesh key={i} position={data.position} scale={data.scale}>
                    <boxGeometry args={[1, 1, 0.2]} />
                    <meshStandardMaterial
                        map={texture}
                        roughness={0.2}
                        metalness={0.5}
                    />
                </mesh>
            ))}
        </group>
    );
}
