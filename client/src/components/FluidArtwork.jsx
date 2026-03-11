import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform sampler2D uTexture;
  uniform float uHover;

  void main() {
    vec2 uv = vUv;
    
    // Perlin-style noise for flow
    float noise = sin(uv.x * 10.0 + uTime) * cos(uv.y * 10.0 + uTime) * 0.02;
    
    // Ripple effect based on hover
    float ripple = sin(length(uv - 0.5) * 20.0 - uTime * 2.0) * 0.01 * uHover;
    
    vec2 distortedUv = uv + noise + ripple;
    vec4 color = texture2D(uTexture, distortedUv);
    
    // Add subtle glow based on hover
    color.rgb += uHover * 0.1 * vec3(0.5, 0.7, 1.0);
    
    gl_FragColor = color;
  }
`;

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export default function FluidArtwork({ imageUrl }) {
    const meshRef = useRef();
    const texture = useMemo(() => new THREE.TextureLoader().load(imageUrl), [imageUrl]);
    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uTexture: { value: texture },
        uHover: { value: 0 }
    }), [texture]);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
            meshRef.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(
                meshRef.current.material.uniforms.uHover.value,
                meshRef.current.hovered ? 1.0 : 0.0,
                0.1
            );
        }
    });

    return (
        <mesh
            ref={meshRef}
            onPointerOver={() => (meshRef.current.hovered = true)}
            onPointerOut={() => (meshRef.current.hovered = false)}
        >
            <planeGeometry args={[3, 4, 32, 32]} />
            <shaderMaterial
                uniforms={uniforms}
                fragmentShader={fragmentShader}
                vertexShader={vertexShader}
                transparent={true}
            />
        </mesh>
    );
}
