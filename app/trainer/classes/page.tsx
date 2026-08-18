'use client';

export default function TrainerClassesPage() {
    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Live Classes</h2>
                    <p className="text-on-surface-variant mt-1">Schedule and launch interactive Zoom Q&amp;A sessions with students.</p>
                </div>
                <button className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    + Schedule Live Session
                </button>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm max-w-xl space-y-4">
                <div className="flex justify-between items-start border-b pb-4">
                    <div>
                        <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                            Interactive Q&amp;A
                        </span>
                        <h3 className="font-bold text-on-surface text-sm mt-2">Lippan Clay Grid Alignment Live</h3>
                        <p className="text-on-surface-variant mt-1">Date: Aug 22, 2026 at 5:00 PM (IST)</p>
                    </div>
                    <a href="https://zoom.us" target="_blank" rel="noreferrer" className="bg-primary text-on-primary font-semibold py-1.5 px-4 rounded hover:opacity-90">
                        Start Class
                    </a>
                </div>
            </div>
        </main>
    );
}
