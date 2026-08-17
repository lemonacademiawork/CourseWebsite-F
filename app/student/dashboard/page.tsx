'use client';

export default function StudentDashboardWelcome() {
    const hasPurchasedCourse = true; // In production this checks active course enrollment status
    return (
        <main className="flex-1 w-full bg-surface min-h-screen pb-6">
            
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-3 bg-surface shadow-sm z-40 sticky top-0 border-b border-outline-variant/10">
                <h1 className="font-bold text-base text-primary">Creative Studio</h1>
                <button className="p-1.5"><span className="material-symbols-outlined text-xl">menu</span></button>
            </div>
            
            <div className="max-w-container-max mx-auto px-4 md:px-6 py-4 space-y-4">

                {/* Welcome Header & Avatar - Compact */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-outline-variant/30">
                    <div>
                        <h2 className="text-lg font-bold text-on-surface">Welcome back, Priya</h2>
                        <p className="text-[11px] text-on-surface-variant">Your creative journey continues. You have 2 assignments pending.</p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-surface-container-lowest p-2 px-3 rounded-lg border border-outline-variant/20 shadow-sm">
                        <img className="w-8 h-8 rounded-full object-cover border border-outline-variant/50" alt="Priya Sharma" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0MR89xeuIC7t3EA5GbYFyVNN-txCeUVZp3bGgrpzto3S7ggrdnGVpv65qDZgXLJ2xBxngunkxJhKpz2kKk26xLh0PLzsIVL9CB4D1WPXoXmTG09e9hrHZXLQn6Ez1V4sgbCmiguzaWbuwKeIGcEOd_2UE6YwKBLr0g-esIt2h4kpFSeu0w7KEUcc6XGVXdSBBzVpEgHrk8Dixc07uJxFL5nfNBl7XM6B4JggFa4W91KhJTxadvoLs" />
                        <div>
                            <p className="text-xs font-bold text-on-surface leading-tight">Priya Sharma</p>
                            <p className="text-[10px] text-on-surface-variant leading-none">Graphic Design Track</p>
                        </div>
                    </div>
                </header>

                {/* Dashboard grid layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Left Column (Courses & Gallery) */}
                    <div className="lg:col-span-2 space-y-4">

                        <section>
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">Current Courses</h3>
                                <a className="text-xs text-primary hover:underline" href="#">View all</a>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 bg-tertiary-container/30 text-tertiary text-[10px] font-semibold rounded-full">Typography</span>
                                        <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                                    </div>
                                    <h4 className="text-xs font-bold leading-tight mb-1">Advanced Layouts &amp; Grid Systems</h4>
                                    <p className="text-[11px] text-on-surface-variant mb-4 flex-grow">Mastering editorial design and structured asymmetry.</p>
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                                            <span>Progress</span>
                                            <span>65%</span>
                                        </div>
                                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full" style={{width: '65%'}}></div>
                                        </div>
                                        <button className="mt-4 w-full bg-surface-container py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-dim transition-colors">Continue Learning</button>
                                    </div>
                                </div>

                                <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 bg-secondary-container/30 text-secondary text-[10px] font-semibold rounded-full">Illustration</span>
                                        <button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">more_vert</span></button>
                                    </div>
                                    <h4 className="text-xs font-bold leading-tight mb-1">Digital Painting Fundamentals</h4>
                                    <p className="text-[11px] text-on-surface-variant mb-4 flex-grow">Brush mechanics and color theory for digital artists.</p>
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-[10px] text-on-surface-variant mb-1">
                                            <span>Progress</span>
                                            <span>20%</span>
                                        </div>
                                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full" style={{width: '20%'}}></div>
                                        </div>
                                        <button className="mt-4 w-full bg-surface-container py-1.5 rounded-lg text-xs font-semibold text-on-surface hover:bg-surface-dim transition-colors">Continue Learning</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Gallery Highlights</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="aspect-square bg-surface-variant rounded-lg overflow-hidden group cursor-pointer border border-outline-variant/20">
                                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container transition-colors">
                                        <span className="material-symbols-outlined text-base">image</span>
                                    </div>
                                </div>
                                <div className="aspect-square bg-surface-variant rounded-lg overflow-hidden group cursor-pointer border border-outline-variant/20">
                                    <div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container transition-colors">
                                        <span className="material-symbols-outlined text-base">palette</span>
                                    </div>
                                </div>
                                {hasPurchasedCourse && (
                                    <div className="col-span-2 bg-surface-container-lowest rounded-lg p-3 flex flex-col justify-center border border-outline-variant/30 shadow-sm">
                                        <p className="text-xs font-bold text-on-surface mb-0.5">Upload your latest project</p>
                                        <p className="text-[10px] text-on-surface-variant mb-2">Get feedback from peers and mentors.</p>
                                        <button className="text-left text-xs font-semibold text-primary hover:underline flex items-center gap-1">Upload now <span className="material-symbols-outlined text-xs">arrow_forward</span></button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column (Live zoom & stats) */}
                    <div className="space-y-4">
                        <div className="bg-secondary text-on-secondary rounded-xl p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-1.5 mb-3 bg-white/20 w-fit px-2 py-0.5 rounded-full backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-xs">videocam</span>
                                    <span className="text-[9px] font-semibold uppercase tracking-wider">Live in 45 mins</span>
                                </div>
                                <h4 className="text-sm font-bold mb-1 leading-tight">Critique Session: Layout Studies</h4>
                                <p className="text-[11px] text-on-secondary/80 mb-4">with Instructor Sarah Jenkins</p>
                                <button className="w-full bg-white text-secondary font-semibold text-xs py-2 rounded-lg hover:bg-surface-container transition-colors shadow-sm">
                                    Join Zoom Room
                                </button>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/30 shadow-sm">
                            <h4 className="text-[10px] font-bold text-on-surface-variant mb-3 uppercase tracking-wider">This Week</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                                        <span className="material-symbols-outlined text-base">schedule</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface">4h 30m</p>
                                        <p className="text-[10px] text-on-surface-variant">Time learned</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                                        <span className="material-symbols-outlined text-base">task_alt</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-on-surface">2</p>
                                        <p className="text-[10px] text-on-surface-variant">Modules completed</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
