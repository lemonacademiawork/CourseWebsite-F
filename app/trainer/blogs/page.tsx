'use client';

export default function TrainerBlogsPage() {
    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Artisan Blogs</h2>
                    <p className="text-on-surface-variant mt-1">Publish and manage your creative diaries, process documentation, and materials tips.</p>
                </div>
                <button className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity">
                    + Write Article
                </button>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm max-w-xl text-center text-on-surface-variant py-10">
                You haven't written any blog posts yet. Write your first creative article today!
            </div>
        </main>
    );
}
