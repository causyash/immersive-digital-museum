import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ParticleArtwork({ imageUrl, isActive }) {
    const pointsRef = useRef();

    // Create a particle grid
    const count = 64; // 64x64 grid = 4096 particles
    const points = useMemo(() => {
        const p = new Float32Array(count * count * 3);
        const uvs = new Float32Array(count * count * 2);
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const idx = (i * count + j);
                // Initial grid position
                p[idx * 3] = (i / count - 0.5) * 3;
                p[idx * 3 + 1] = (j / count - 0.5) * 4;
                p[idx * 3 + 2] = 0;

                uvs[idx * 2] = i / count;
                uvs[idx * 2 + 1] = j / count;
            }
        }
        return { positions: p, uvs };
    }, []);

    const texture = useMemo(() => new THREE.TextureLoader().load(imageUrl), [imageUrl]);

    const shaderArgs = useMemo(() => ({
        uniforms: {
            uTime: { value: 0 },
            uTexture: { value: texture },
            uActive: { value: 0 },
            uCursor: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform float uActive;
            uniform vec2 uCursor;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Idea 4: Particle Dispersion logic
                // Particles fly away based on time and uActive state
                float noise = sin(pos.x * 10.0 + uTime) * cos(pos.y * 10.0 + uTime);
                
                // Dispersion effect: particles float away into 3D space
                if (uActive > 0.5) {
                    pos.z += sin(uTime + pos.x * 5.0) * 2.0;
                    pos.x += cos(uTime + pos.y * 5.0) * 1.0;
                    pos.y += sin(uTime + pos.z * 5.0) * 1.0;
                }
                
                // Subtle breathing animation
                pos.z += noise * 0.05;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = 4.0 * (1.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform float uActive;

            void main() {
                vec4 color = texture2D(uTexture, vUv);
                if (color.a < 0.1) discard;
                
                // Make particles glow
                gl_FragColor = vec4(color.rgb * 1.5, color.a);
            }
        `
    }), [texture]);

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
            pointsRef.current.material.uniforms.uActive.value = isActive ? 1.0 : 0.0;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={points.positions.length / 3}
                    array={points.positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-uv"
                    count={points.uvs.length / 2}
                    array={points.uvs}
                    itemSize={2}
                />
            </bufferGeometry>
            <shaderMaterial
                args={[shaderArgs]}
                transparent={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
}
