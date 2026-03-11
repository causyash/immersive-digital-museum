import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function VortexTransition({ isActive, onComplete }) {
    const vortexRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            // Animate curtains/circles into a vortex
            gsap.to(vortexRef.current, {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'expo.inOut',
                onComplete: onComplete
            });
        }
    }, [isActive]);

    return (
        <div
            ref={vortexRef}
            className="fixed inset-0 z-[10000] pointer-events-none opacity-0 scale-150 flex items-center justify-center overflow-hidden"
        >
            {/* The Vortex Rings */}
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute border-[20px] border-white/20 rounded-full animate-vortex-spin"
                    style={{
                        width: `${(i + 1) * 20}%`,
                        height: `${(i + 1) * 20}%`,
                        animationDelay: `${i * 0.1}s`,
                        boxShadow: '0 0 100px rgba(255,255,255,0.1) inset'
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-black/60 mix-blend-overlay" />
        </div>
    );
}
