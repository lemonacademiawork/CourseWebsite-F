'use client';

export default function TrainerBlogsPage() {
    return (
        <div className="relative min-h-screen pb-4">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs">
                <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">Artisan Blogs</h2>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">Publish and manage your creative diaries, process documentation, and materials tips.</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-primary text-primary-fixed hover:bg-surface-tint font-semibold text-xs py-2 px-4 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Write Article
                    </button>
                </header>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6 shadow-sm max-w-xl text-center text-on-surface-variant py-10 mt-6 text-[11px]">
                    You haven't written any blog posts yet. Write your first creative article today!
                </div>
            </div>
        </div>
    );
}
