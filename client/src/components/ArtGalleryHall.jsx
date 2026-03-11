import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import FluidArtwork from './FluidArtwork';
import ParticleArtwork from './ParticleArtwork';
import AnamorphosisArt from './AnamorphosisArt';
import VortexTransition from './VortexTransition';

const dummyImages = [
    '/ancient.png',
    '/renaissance.png',
    '/modern.png',
    '/digital.png',
    '/ai.png'
];

export default function ArtGalleryHall({ index, hall }) {
    const navigate = useNavigate();
    const [isVortexActive, setIsVortexActive] = useState(false);
    const [eraShift, setEraShift] = useState(0); // For Idea 6

    // Select an image based on the hall index
    const imageUrl = dummyImages[index % dummyImages.length] || dummyImages[0];

    const eras = ['Classic', 'Industrial', 'Digital'];

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Parallax tilt effect
        const rotateX = ((y / rect.height) - 0.5) * -15; // Max 15 degree tilt
        const rotateY = ((x / rect.width) - 0.5) * 15;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e) => {
        const card = e.currentTarget;
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const handleArtworkClick = () => {
        setIsVortexActive(true);
    };

    const onVortexComplete = () => {
        navigate(`/artwork/${index}`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col items-center justify-center p-8 relative">
            <VortexTransition isActive={isVortexActive} onComplete={onVortexComplete} />

            <div className={`absolute top-20 left-10 opacity-20 text-[10vw] font-display font-light pointer-events-none whitespace-nowrap z-0 transition-all duration-1000 animate-liquid ${hall.id === 'renaissance' && eraShift === 2 ? 'text-blue-500 blur-md' : 'text-white'}`}>
                {hall.id === 'renaissance' ? eras[eraShift] : hall.title}
            </div>

            <div className="z-10 w-full flex items-center justify-center gap-16">
                <div className="w-1/3 flex flex-col space-y-4">
                    <h2 className="text-5xl font-display font-medium text-museum-accent transition-all duration-700">
                        {hall.id === 'renaissance' ? `${eras[eraShift]} Era` : hall.title}
                    </h2>
                    <p className="text-museum-muted text-lg tracking-wide max-w-md">
                        Explore the timeless pieces spanning history. Notice the masterful strokes and depth that continue to inspire.
                    </p>

                    {hall.id === 'renaissance' && (
                        <button
                            onClick={() => setEraShift((prev) => (prev + 1) % eras.length)}
                            className="w-fit px-6 py-2 border border-museum-accent/30 rounded-full text-[10px] uppercase tracking-[0.3em] hover:bg-museum-accent hover:text-black transition-all duration-500 mt-4"
                        >
                            Temporal Shift
                        </button>
                    )}
                </div>

                <div
                    onClick={handleArtworkClick}
                    className="w-1/2 md:w-1/3 artwork-card block cursor-pointer transition-all duration-300 ease-out"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transition: 'transform 0.1s ease-out' }}
                >
                    <div className="relative aspect-[3/4] bg-[#020202] border-[12px] border-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">

                        <div className="w-full h-full">
                            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                                <ambientLight intensity={1.5} />
                                {hall.id === 'ai' ? (
                                    <ParticleArtwork imageUrl={imageUrl} isActive={true} />
                                ) : hall.id === 'modern' ? (
                                    <AnamorphosisArt imageUrl={imageUrl} />
                                ) : (
                                    <FluidArtwork imageUrl={imageUrl} />
                                )}
                            </Canvas>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-20 pointer-events-none">
                            <h3 className="text-2xl font-display">Masterpiece #{index + 1}</h3>
                            <p className="text-museum-accent text-sm uppercase tracking-widest mt-1">View Details</p>
                        </div>

                        {/* Glossy reflection logic */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50 mix-blend-overlay"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
