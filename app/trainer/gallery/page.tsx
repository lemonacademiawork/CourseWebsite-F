'use client';

export default function TrainerGalleryPage() {
    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Gallery Submissions</h2>
                    <p className="text-on-surface-variant mt-1">Upload photos of finished craft products and student exhibition reviews.</p>
                </div>
                <button className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    + Add Gallery Image
                </button>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm max-w-xl text-center text-on-surface-variant py-10">
                No gallery images uploaded yet.
            </div>
        </main>
    );
}
