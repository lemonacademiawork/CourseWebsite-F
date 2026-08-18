'use client';

export default function TrainerResourcesPage() {
    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Course Resources</h2>
                    <p className="text-on-surface-variant mt-1">Upload materials list spreadsheets, PDF design templates, and reference materials.</p>
                </div>
                <button className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    + Upload Resource
                </button>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm max-w-xl space-y-3">
                <div className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-lg">description</span>
                        <div>
                            <p className="font-semibold text-on-surface">Substrates Grid Layout Templates</p>
                            <p className="text-[10px] text-on-surface-variant">PDF (12.4 MB)</p>
                        </div>
                    </div>
                    <button className="text-error font-semibold hover:underline">Delete</button>
                </div>
            </div>
        </main>
    );
}
