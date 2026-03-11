export default function NavigationMap({ activeIndex = 0, isOutro = false, halls = [] }) {
    if (halls.length === 0) return null;

    return (
        <div className={`fixed bottom-12 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-700 ease-in-out`}>
            <div className={`bg-museum-surface/80 backdrop-blur-md rounded-full border border-museum-border shadow-2xl flex items-center justify-center transition-all duration-700 ease-in-out overflow-hidden ${isOutro ? 'scale-0 opacity-0 px-2 py-2 w-10 delay-300' : 'scale-100 opacity-100 px-8 py-3 w-[600px] mix-blend-difference pb-4 delay-0'}`}>
                <div className={`flex items-center transition-all duration-700 ${isOutro ? 'gap-0' : 'gap-6'}`}>
                    {halls.map((hall, index) => (
                        <div key={index} className="flex items-center flex-shrink-0 transition-all duration-700" style={{ gap: isOutro ? '0px' : '16px' }}>
                            <div className="flex flex-col items-center group relative">
                                <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isOutro ? 'bg-museum-accent scale-100 shadow-[0_0_15px_rgba(207,166,112,1)]' : index === activeIndex ? 'bg-museum-accent scale-150 shadow-[0_0_10px_rgba(207,166,112,0.8)] dot-active' : 'bg-museum-muted'}`} />
                                <span className={`text-xs mt-2 uppercase tracking-[0.2em] font-display font-light absolute top-6 transition-opacity duration-300 ${!isOutro && index === activeIndex ? 'text-museum-accent opacity-100' : 'opacity-0 text-museum-muted'}`}>
                                    {hall.title.split(' ')[0]}
                                </span>
                            </div>
                            {index < halls.length - 1 && (
                                <div className={`h-[1px] bg-museum-border/50 transition-all duration-700 ${isOutro ? 'w-0 opacity-0' : 'w-8 opacity-100'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
