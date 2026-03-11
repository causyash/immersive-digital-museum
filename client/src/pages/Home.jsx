import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SceneManager from '../scene/SceneManager';
import ArtGalleryHall from '../components/ArtGalleryHall';
import NavigationMap from '../components/NavigationMap';

gsap.registerPlugin(ScrollTrigger);

const halls = [
    { id: 'ancient', title: 'Ancient Art Hall', theme: 'warm' },
    { id: 'renaissance', title: 'Renaissance Hall', theme: 'classic' },
    { id: 'modern', title: 'Modern Art Hall', theme: 'bright' },
    { id: 'digital', title: 'Digital Art Hall', theme: 'neon' },
    { id: 'ai', title: 'AI Generated Art Hall', theme: 'futuristic' },
];

export default function Home() {
    const containerRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isOutro, setIsOutro] = useState(false);

    useEffect(() => {
        const sections = gsap.utils.toArray('.gallery-section');
        const sectionsCount = sections.length;

        let scrollTween = gsap.to(sections, {
            xPercent: -100 * (sectionsCount - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                pin: true,
                scrub: 1,
                // Optional: remove snapping to avoid visual glitches or use directional snap
                // snap: 1 / (sectionsCount - 1),
                end: () => '+=' + scrollWrapperRef.current.offsetWidth * sectionsCount,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const index = Math.round(progress * (sectionsCount - 1));
                    setActiveIndex(index);
                }
            }
        });

        const outroTween = gsap.to('.mask-layer', {
            clipPath: 'circle(150% at 50% 90%)',
            ease: 'none',
            scrollTrigger: {
                trigger: '.outro-trigger',
                start: 'top bottom', // As soon as the Outro section starts entering from the bottom
                end: 'top top',      // Pin scale when it reaches the top
                scrub: 1,
                onEnter: () => setIsOutro(true),
                onLeaveBack: () => setIsOutro(false),
            }
        });

        return () => {
            scrollTween.kill();
            outroTween.kill();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    useEffect(() => {
        if (isOutro) {
            gsap.to('.outro-text', {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                delay: 0.4
            });
        } else {
            gsap.to('.outro-text', {
                y: 40,
                opacity: 0,
                duration: 0.3
            });
        }
    }, [isOutro]);

    return (
        <div className="bg-museum-bg text-museum-text">
            <NavigationMap activeIndex={activeIndex} isOutro={isOutro} />

            <div ref={containerRef} className="relative w-full h-screen">
                {/* 3D Scene rendered in background */}
                <div className="canvas-container">
                    <SceneManager scrollProgress={activeIndex / (halls.length - 1)} />
                </div>

                {/* Horizontal Scroll Wrapper */}
                <div ref={scrollWrapperRef} className="w-full h-screen flex flex-row overflow-hidden absolute top-0 left-0 z-10 pointer-events-none">
                    {halls.map((hall, index) => (
                        <div key={hall.id} className="gallery-section w-screen h-screen flex-shrink-0 flex items-center justify-center relative pointer-events-auto">
                            <ArtGalleryHall index={index} hall={hall} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Cinematic Transition Section */}
            <div className="outro-trigger w-full h-screen relative z-50 bg-[#020202] overflow-hidden flex items-center justify-center pointer-events-none">
                <div className="mask-layer absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center text-museum-text pointer-events-auto origin-bottom" style={{ clipPath: 'circle(0% at 50% 90%)' }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-museum-accent/10 to-transparent pointer-events-none"></div>
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-museum-accent/50 to-transparent"></div>
                    <h2 className="text-5xl md:text-7xl font-display font-medium mb-8 transform translate-y-10 opacity-0 outro-text text-white">The Collection Awaits</h2>
                    <p className="text-xl max-w-2xl text-center mb-12 transform translate-y-10 opacity-0 outro-text text-museum-muted font-light px-8">
                        Discover the depths of digital artistry and explore our entire archive of masterpieces spanning multiple eras.
                    </p>
                    <button className="px-10 py-4 bg-white/10 border border-white/20 backdrop-blur-md text-white font-medium rounded-full text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-300 transform translate-y-10 opacity-0 outro-text">
                        Enter The Archives
                    </button>
                </div>
            </div>
        </div>
    );
}
