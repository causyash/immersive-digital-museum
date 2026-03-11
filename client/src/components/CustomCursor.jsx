import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const [hoverText, setHoverText] = useState('');

    useEffect(() => {
        const cursor = cursorRef.current;
        const dot = dotRef.current;

        // Listen for mouse move
        const moveCursor = (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power3.out' });
        };

        window.addEventListener('mousemove', moveCursor);

        // Add interactivity to links and buttons
        const handleHover = (e) => {
            const target = e.target.closest('a, button, .artwork-card');
            if (target) {
                if (target.classList.contains('artwork-card')) {
                    setHoverText('View Art');
                    gsap.to(cursor, { scale: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.8)', duration: 0.3 });
                } else {
                    setHoverText('');
                    gsap.to(cursor, { scale: 1.5, backgroundColor: 'rgba(255,255,255,0.8)', duration: 0.3 });
                }
            } else {
                setHoverText('');
                gsap.to(cursor, { scale: 1, backgroundColor: 'transparent', borderColor: 'rgba(207, 166, 112, 0.5)', duration: 0.3 });
            }
        };

        window.addEventListener('mouseover', handleHover);
        window.addEventListener('mouseout', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
            window.removeEventListener('mouseout', handleHover);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-museum-accent/50 pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center backdrop-blur-sm transition-colors duration-300"
            >
                {hoverText && <span className="text-[5px] font-bold tracking-widest uppercase text-white scale-33">{hoverText}</span>}
            </div>
            <div
                ref={dotRef}
                className="fixed top-0 left-0 w-2 h-2 bg-museum-accent rounded-full pointer-events-none z-[10000] shadow-[0_0_10px_rgba(207,166,112,0.8)] transform -translate-x-1/2 -translate-y-1/2"
            />
        </>
    );
}
