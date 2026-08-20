'use client';

export default function TrainerClassesPage() {
    return (
        <div className="relative min-h-screen pb-4">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs">
                <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">Live Classes</h2>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">Schedule and launch interactive Zoom Q&amp;A sessions with students.</p>
                    </div>
                    <button className="flex items-center gap-1.5 bg-primary text-primary-fixed hover:bg-surface-tint font-semibold text-xs py-2 px-4 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Schedule Live Session
                    </button>
                </header>

                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm max-w-xl space-y-4 mt-6 text-[11px]">
                    <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4">
                        <div>
                            <span className="bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                                Interactive Q&amp;A
                            </span>
                            <h3 className="font-bold text-on-surface text-xs mt-2">Lippan Clay Grid Alignment Live</h3>
                            <p className="text-on-surface-variant mt-1">Date: Aug 22, 2026 at 5:00 PM (IST)</p>
                        </div>
                        <a href="https://zoom.us" target="_blank" rel="noreferrer" className="bg-primary text-on-primary font-semibold py-1.5 px-3 rounded hover:opacity-90 transition-opacity">
                            Start Class
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
