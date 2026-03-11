import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Heart, Eye } from 'lucide-react';

export default function ArtworkDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fake load
        setTimeout(() => setLoading(false), 800);
    }, [id]);

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center bg-museum-bg text-white">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-museum-bg text-museum-text py-20 px-8 relative">
            <Link to="/" className="fixed top-8 left-8 text-white flex items-center gap-2 hover:text-museum-accent transition-colors z-50 mix-blend-difference">
                <ArrowLeft size={24} /> Back to Gallery
            </Link>

            <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full aspect-[3/4] bg-neutral-900 rounded-sm overflow-hidden shadow-2xl relative">
                        <img src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?w=800&q=80" alt="Artwork" className="w-full h-full object-cover" />

                        {/* Glossy Reflection overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                    </div>
                </div>

                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-display font-light mb-2">The Digital Horizon</h1>
                        <p className="text-2xl text-museum-accent">Alexander Reed</p>
                        <p className="text-museum-muted">2026 • AI Generated Art</p>
                    </div>

                    <div className="w-full h-[1px] bg-neutral-800"></div>

                    <p className="text-lg leading-relaxed text-neutral-300">
                        A mesmerizing exploration of the boundaries between organic and synthetic reality. The piece invites viewers to reflect upon the inevitable fusion of human emotion and algorithmic generation in a timeless void.
                    </p>

                    <div className="flex gap-6 pt-4">
                        <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors px-6 py-3 rounded-full border border-white/10">
                            <Heart size={20} />
                            <span>4.2k Likes</span>
                        </button>
                        <div className="flex items-center gap-3 px-6 py-3 text-museum-muted">
                            <Eye size={20} />
                            <span>12.8k Views</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
