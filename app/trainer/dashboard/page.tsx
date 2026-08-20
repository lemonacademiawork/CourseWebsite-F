export default function TrainerDashboardOverview() {
    return (
        <div className="relative min-h-screen pb-4">
            {/* Abstract Background Pattern (Subtle & Premium) */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs">
                {/* Welcome Header */}
                <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">
                            Welcome back, Elena 👋
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-on-surface hover:text-primary transition-all">
                            <span className="material-symbols-outlined text-lg">search</span>
                        </button>
                        <button className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-on-surface hover:text-primary relative transition-all">
                            <span className="material-symbols-outlined text-lg">notifications</span>
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border border-surface-lowest"></span>
                        </button>
                        <div className="w-9 h-9 rounded-full bg-secondary-container text-on-secondary-container border-2 border-surface-lowest flex items-center justify-center font-bold text-sm shadow-sm">
                            E
                        </div>
                    </div>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-min mb-6">
                    
                    {/* KPI 1: Students */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Total Students</span>
                            <div className="w-7 h-7 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-base">groups</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">450</div>
                            <div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                                <span className="text-primary font-semibold">+12 this week</span>
                                <span>• growing community</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: Active Curricula */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Active Curricula</span>
                            <div className="w-7 h-7 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-base">menu_book</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">4</div>
                            <div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                                <span>Published active workshops</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3: Live Sessions */}
                    <div className="md:col-span-4 bg-secondary-fixed/5 border border-secondary/15 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface uppercase tracking-wider">Upcoming Schedule</span>
                            <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-base">event</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">2</div>
                            <div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
                                <span>Live sessions scheduled today</span>
                            </div>
                        </div>
                    </div>

                    {/* Smaller Metrics Cards Row (Span 12) */}
                    <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">check_circle</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">Completed Students</p>
                                <p className="text-sm font-bold text-on-surface leading-tight">120</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">article</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">Published Blogs</p>
                                <p className="text-sm font-bold text-on-surface leading-tight">8</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">folder</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">Resource Files</p>
                                <p className="text-sm font-bold text-on-surface leading-tight">15</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-1.5 justify-center hover:bg-surface-variant/30 cursor-pointer transition-all border border-dashed border-outline-variant/40">
                            <span className="material-symbols-outlined text-on-surface-variant text-sm">add</span>
                            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">Add Course</span>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-outline-variant/30 mb-6"></div>

                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-on-surface">Course Management</h3>
                        <button className="text-[11px] font-semibold text-primary hover:text-surface-tint transition-colors flex items-center gap-1">
                            View all <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        
                        <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-[11px]">
                            <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                                <img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDFz7z8j73mQu6Sxex5rJ6jJxC3xTKGm6jr-1kk3yKUeeIH9oI7Fc-kGkulqfts2uZFyEdm9ng4qgj6_IIqZHb53VOFMUo8l49USOfYINxsr8ddjjYOJwwpmQZuKimpLNNI4lL545qerwRG0_uftKIZbSwmg8lKic9rFZo-FgvIaL7m69kUf3PJp3C72CxJRRhXS16jBxBdXM5L9FJmc1cSUIqRj1FiX6nltDW3mHb0HiRZDHk4mau" />
                                <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px]">
                                    <span className="font-semibold text-on-surface-variant">Ceramics</span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-on-surface text-xs mb-1">Introduction to Handbuilding</h4>
                                <p className="text-on-surface-variant mb-4 flex-1 line-clamp-2">Master the fundamental techniques of pinching, coiling, and slab building.</p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1 text-[10px]">
                                        <span className="text-on-surface-variant">Course Progress</span>
                                        <span className="font-bold text-primary">75%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full w-[75%]"></div>
                                    </div>
                                </div>
                                <button className="w-full py-2 rounded-lg border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors">
                                    Manage Course
                                </button>
                            </div>
                        </article>

                        <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-[11px]">
                            <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                                <img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1x6zKUZqVEBjOsvRIc47k41T3IIfqWB_R45SxFlFz0VDJNY8zhbRwQcV2Y7QZFPWUiehv_SUMYomg3Gl9QQez1tSzDbBLMmdw85jl1TTOiYR1UPOESSJtfcc2vXnhcisnDcpFNBGsfy6EoetdRd_fN1_IgEpssgm-3mskNzrXtXtEteRIG7M5ChROeRAKo_PXEALwgLH2FQUhxNDktblPEUsUmlLjQmlIzCN8OcokBUtKZfq-4bj8" />
                                <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px]">
                                    <span className="font-semibold text-on-surface-variant">Digital Art</span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-on-surface text-xs mb-1">Expressive Digital Painting</h4>
                                <p className="text-on-surface-variant mb-4 flex-1 line-clamp-2">Translate traditional painting techniques into powerful digital workflows.</p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1 text-[10px]">
                                        <span className="text-on-surface-variant">Course Progress</span>
                                        <span className="font-bold text-primary">42%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full w-[42%]"></div>
                                    </div>
                                </div>
                                <button className="w-full py-2 rounded-lg border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors">
                                    Manage Course
                                </button>
                            </div>
                        </article>

                        <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group text-[11px]">
                            <div className="h-40 w-full relative overflow-hidden bg-surface-variant">
                                <img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIAqcA4MocbTpNTJr80aEHZHsItToDawwszN_xNxa2P8qP-3thuIS3EUtjtGqi5qElRWw7UXaC-EwmWbEhNZvYTQz19inLQ08j8aosJ_1Yev4jSOiZNh4oB-8Hgwjfd8t70384u8UFNNAG6XFCNIq-pyrbC9bmT3AbgGytfmprzwx4o-_2hLo-TTNHwUCAg9ljmsZ5vbmrs5_Qym27-gCyb5BBBYBPWCq607r55n9xnp0AxtI0s03V" />
                                <div className="absolute top-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px]">
                                    <span className="font-semibold text-on-surface-variant">Drawing</span>
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-on-surface text-xs mb-1">Architectural Sketching</h4>
                                <p className="text-on-surface-variant mb-4 flex-1 line-clamp-2">Learn to capture structure, perspective, and light with confidence.</p>
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1 text-[10px]">
                                        <span className="text-on-surface-variant">Course Progress</span>
                                        <span className="font-bold text-primary">90%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full w-[90%]"></div>
                                    </div>
                                </div>
                                <button className="w-full py-2 rounded-lg border border-outline text-on-surface font-semibold hover:bg-surface-container transition-colors">
                                    Manage Course
                                </button>
                            </div>
                        </article>
                    </div>
                </section>
            </div>
        </div>
    );
}
