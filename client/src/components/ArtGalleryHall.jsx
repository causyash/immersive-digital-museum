import { Link } from 'react-router-dom';

const dummyImages = [
    'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1577083165313-1bf5ee055db3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1578301978693-85fa9c026f33?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=80&w=800'
];

export default function ArtGalleryHall({ index, hall }) {
    // Select an image based on the hall index
    const imageUrl = dummyImages[index % dummyImages.length];

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

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col items-center justify-center p-8 relative">
            <div className="absolute top-20 left-10 opacity-20 text-[10vw] font-display font-light pointer-events-none whitespace-nowrap z-0">
                {hall.title}
            </div>

            <div className="z-10 w-full flex items-center justify-center gap-16">
                <div className="w-1/3 flex flex-col space-y-4">
                    <h2 className="text-5xl font-display font-medium text-museum-accent">{hall.title}</h2>
                    <p className="text-museum-muted text-lg tracking-wide max-w-md">
                        Explore the timeless pieces spanning history. Notice the masterful strokes and depth that continue to inspire.
                    </p>
                </div>

                <Link to={`/artwork/${index}`} className="w-1/2 md:w-1/3 artwork-card block transition-all duration-300 ease-out"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transition: 'transform 0.1s ease-out' }}
                >
                    <div className="relative aspect-[3/4] bg-neutral-900 border-[12px] border-[#111] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
                        <img src={imageUrl} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500" alt="Artwork" />
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 pt-20">
                            <h3 className="text-2xl font-display">Masterpiece #{index + 1}</h3>
                            <p className="text-museum-accent text-sm uppercase tracking-widest mt-1">View Details</p>
                        </div>

                        {/* Glossy reflection logic */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50 mix-blend-overlay"></div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
