import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const archiveArtworks = [
    { id: 101, title: 'Project Genesis', year: '2023', img: '/ai.png' },
    { id: 102, title: 'Neon Reflections', year: '2022', img: '/digital.png' },
    { id: 103, title: 'Echoes of Rome', year: '300 BC', img: '/ancient.png' },
    { id: 104, title: 'The Royal Court', year: '1420', img: '/renaissance.png' },
    { id: 105, title: 'Abstract Visions', year: '1950', img: '/modern.png' },
    { id: 106, title: 'Digital Odyssey', year: '2025', img: '/ai.png' },
];

export default function VaultArchive({ isVisible, onClose }) {
    const [render, setRender] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setRender(true);
            setTimeout(() => {
                gsap.to('.vault-ui', {
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.out'
                });

                gsap.fromTo('.vault-item',
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 1, ease: 'power3.out' }
                );
            }, 50);
        } else {
            gsap.to('.vault-ui', {
                opacity: 0,
                duration: 1,
                ease: 'power2.in',
                onComplete: () => setRender(false)
            });
        }
    }, [isVisible]);

    if (!render) return null;

    return (
        <div className="vault-ui fixed inset-0 z-[100] opacity-0 pointer-events-auto overflow-y-auto custom-scrollbar">
            <div className="min-h-screen w-full flex flex-col p-8 md:p-16 pt-32 relative">

                {/* Header */}
                <div className="flex justify-between items-end mb-16 max-w-7xl mx-auto w-full border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-display font-light text-white mb-2">The Hidden Archives</h1>
                        <p className="text-museum-accent uppercase tracking-[0.3em] text-sm">Classified Collection</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-white/5 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 rounded-full text-sm uppercase tracking-widest backdrop-blur-md"
                    >
                        Return to Surface
                    </button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto w-full pb-32">
                    {archiveArtworks.map((art, i) => (
                        <div key={i} className="vault-item group block cursor-pointer">
                            <div className="w-full aspect-square bg-[#050505] overflow-hidden border border-white/5 relative mb-4">
                                <img src={art.img} alt={art.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay pointer-events-none"></div>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <h3 className="font-display text-white text-lg">{art.title}</h3>
                                <span className="text-museum-muted">{art.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
