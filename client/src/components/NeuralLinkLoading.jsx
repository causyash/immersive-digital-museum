import { useEffect, useState } from 'react';
import gsap from 'gsap';

export default function NeuralLinkLoading() {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing Systems...');
    const [isVisible, setIsVisible] = useState(true);

    const statuses = [
        'Initializing Neural Link...',
        'Syncing Chrono-Relativity...',
        'Manifesting Physical Light...',
        'Weaving Pixel Pigments...',
        'Finalizing Virtual Consciousness...'
    ];

    useEffect(() => {
        let interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + Math.random() * 15;
                if (next >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                setStatus(statuses[Math.floor((next / 100) * statuses.length)]);
                return next;
            });
        }, 150);

        if (progress === 100) {
            gsap.to('.loader-container', {
                opacity: 0,
                duration: 1,
                ease: 'power3.inOut',
                onComplete: () => setIsVisible(false)
            });
        }

        return () => clearInterval(interval);
    }, [progress]);

    if (!isVisible) return null;

    return (
        <div className="loader-container fixed inset-0 z-[10000] bg-[#020202] flex flex-col items-center justify-center font-sans">
            {/* Cinematic Noise Background */}
            <div className="film-grain opacity-10" />

            <div className="relative w-64 md:w-96 flex flex-col items-start px-8">
                {/* Glitch Title */}
                <h1 className="text-museum-accent text-[8px] tracking-[0.4em] uppercase mb-4 font-bold opacity-50">
                    IDM | Signal Authenticated
                </h1>

                <div className="w-full h-[1px] bg-white/10 relative overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-full bg-museum-accent shadow-[0_0_15px_rgba(207,166,112,0.8)] transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex justify-between w-full mt-4">
                    <span className="text-white text-[10px] tracking-widest font-display animate-pulse uppercase">
                        {status}
                    </span>
                    <span className="text-museum-accent text-[10px] font-bold">
                        {Math.floor(progress)}%
                    </span>
                </div>
            </div>

            {/* Scanning Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-museum-accent/20 shadow-[0_0_15px_rgba(207,166,112,0.2)] animate-scan-line pointer-events-none" />
        </div>
    );
}
