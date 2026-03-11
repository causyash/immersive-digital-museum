export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-museum-surface text-museum-text p-10 font-sans">
            <h1 className="text-4xl font-display mb-8">Museum Administration</h1>
            <p className="text-museum-muted mb-12">Manage exhibitions, artwork uploads and view analytics.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-museum-bg p-8 rounded-xl border border-museum-border">
                    <h2 className="text-xl font-bold mb-4">Add Artwork</h2>
                    <button className="w-full bg-museum-text text-museum-bg py-3 font-semibold rounded hover:bg-white/90 transition-colors">
                        Upload Image
                    </button>
                </div>
                <div className="bg-museum-bg p-8 rounded-xl border border-museum-border">
                    <h2 className="text-xl font-bold mb-4">Manage Exhibitions</h2>
                    <button className="w-full border border-museum-border text-museum-text py-3 font-semibold rounded hover:bg-white/5 transition-colors">
                        View All
                    </button>
                </div>
            </div>
        </div>
    );
}
