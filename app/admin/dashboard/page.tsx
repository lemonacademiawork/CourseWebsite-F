export default function AdminDashboardOverview() {
    return (
        <div className="relative min-h-screen">
            {/* Abstract Background Pattern (Subtle) */}
            <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 relative z-10">
                {/* Welcome Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <p className="font-label-md text-label-md text-secondary uppercase tracking-wider mb-2">Creative Workspace</p>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Good morning, Admin.</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">Here's the pulse of the academy today. Ready to inspire?</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-on-surface hover:text-primary">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-on-surface hover:text-primary relative">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-3 right-3 w-2 h-2 bg-secondary rounded-full"></span>
                        </button>
                        <div className="w-12 h-12 rounded-full bg-surface-container-highest border-2 border-surface-lowest overflow-hidden">
                            <img alt="Admin Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiZ4bmrxwarPOLvbBAsfKmoeRmL05QcB7t86lrFefM6zAXjJCneFxbt0x6IcGjLmHnwjxgnpitPDruTQ__ItHv0vr8v-t9StQwan-mLdx6zEPy80RbJa6UhB912a2K6gd3BD4OzXpUtSJdzxLcpJiPq6cP2K0VPIAK4TrF2zL_MxqdQh0Asw3uN96s4UJ49j1uNVa14BEaVj4fgOMFehpg8fOKGXQBZmuM7y5bJtGCY5LMNow97gf7" />
                        </div>
                    </div>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-min">
                    {/* KPI 1: Revenue */}
                    <div className="md:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
                            <div className="w-8 h-8 rounded-full bg-primary-container/30 flex items-center justify-center text-primary-fixed-dim">
                                <span className="material-symbols-outlined text-sm">payments</span>
                            </div>
                        </div>
                        <div>
                            <div className="font-headline-md text-headline-md text-on-surface mb-1">$42,500</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-tertiary">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12.5% this month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: Students */}
                    <div className="md:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Creators</span>
                            <div className="w-8 h-8 rounded-full bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-sm">groups</span>
                            </div>
                        </div>
                        <div>
                            <div className="font-headline-md text-headline-md text-on-surface mb-1">1,284</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-tertiary">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+48 new this week</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3: Courses */}
                    <div className="md:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Masterclasses</span>
                            <div className="w-8 h-8 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                                <span className="material-symbols-outlined text-sm">palette</span>
                            </div>
                        </div>
                        <div>
                            <div className="font-headline-md text-headline-md text-on-surface mb-1">36</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-on-surface-variant">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                <span>3 pending review</span>
                            </div>
                        </div>
                    </div>

                    {/* Interactive Revenue Chart (Area) */}
                    <div className="md:col-span-8 bg-surface-container-lowest ambient-shadow rounded-xl p-8 flex flex-col min-h-[360px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Growth Trajectory</h3>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-xs font-label-md text-on-surface-variant hover:bg-surface-container rounded-md transition-colors">Week</button>
                                <button className="px-3 py-1 text-xs font-label-md bg-surface-variant text-on-surface rounded-md transition-colors">Month</button>
                                <button className="px-3 py-1 text-xs font-label-md text-on-surface-variant hover:bg-surface-container rounded-md transition-colors">Year</button>
                            </div>
                        </div>
                        {/* Abstract Chart Representation */}
                        <div className="flex-grow relative w-full flex items-end min-h-[220px]">
                            <div className="absolute inset-0 border-b border-l border-surface-variant opacity-50 flex flex-col justify-between pb-8">
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                            </div>
                            <div className="w-full h-[80%] relative overflow-hidden rounded-bl-lg">
                                <svg className="w-full h-full absolute bottom-0 left-0" preserveAspectRatio="none" viewBox="0 0 100 50">
                                    <defs>
                                        <linearGradient id="chartGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                                            <stop offset="0%" stopColor="#ffe17a" stopOpacity="0.4"></stop>
                                            <stop offset="100%" stopColor="#ffe17a" stopOpacity="0.0"></stop>
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,50 L0,30 C20,40 30,10 50,25 C70,40 80,15 100,5 L100,50 Z" fill="url(#chartGrad)" stroke="#715c00" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Studio Pulse (Action Needed) */}
                    <div className="md:col-span-4 bg-surface-container-low ambient-shadow rounded-xl p-8 flex flex-col border border-surface-variant/50">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">vital_signs</span>
                            Studio Pulse
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="group flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-outline-variant/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary">
                                        <span className="material-symbols-outlined">workspace_premium</span>
                                    </div>
                                    <div>
                                        <h4 className="font-label-md text-label-md text-on-surface">Review Certificates</h4>
                                        <p className="text-xs text-on-surface-variant mt-0.5">Pending approvals</p>
                                    </div>
                                </div>
                                <span className="bg-secondary text-on-secondary text-xs font-bold px-2.5 py-1 rounded-full">12</span>
                            </div>
                            <div className="group flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-outline-variant/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                                        <span className="material-symbols-outlined">palette</span>
                                    </div>
                                    <div>
                                        <h4 className="font-label-md text-label-md text-on-surface">Gallery Submissions</h4>
                                        <p className="text-xs text-on-surface-variant mt-0.5">New artwork uploaded</p>
                                    </div>
                                </div>
                                <span className="bg-tertiary text-on-tertiary text-xs font-bold px-2.5 py-1 rounded-full">5</span>
                            </div>
                            <div className="group flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-all cursor-pointer border border-transparent hover:border-outline-variant/30">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-fixed-dim">
                                        <span className="material-symbols-outlined">person_add</span>
                                    </div>
                                    <div>
                                        <h4 className="font-label-md text-label-md text-on-surface">Trainer Applications</h4>
                                        <p className="text-xs text-on-surface-variant mt-0.5">Awaiting interview</p>
                                    </div>
                                </div>
                                <span className="bg-surface-variant text-on-surface-variant text-xs font-bold px-2.5 py-1 rounded-full">2</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Studio Vibes (Activity Feed) */}
                    <div className="md:col-span-8 bg-surface-container-lowest ambient-shadow rounded-xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Studio Vibes</h3>
                            <button className="text-sm font-label-md text-primary hover:underline">View All</button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {/* Feed Item 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-surface-variant">
                                    <img alt="Student Sarah Jenkins Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSdg39ix0SJRvJCL0yOZgTOPmnwqSeqaR1qRKcZz-RulA8Se3AHNQEa3dsV9aRlGa1EnOc_pDniYjfQIy0lMOk0uGCQYXSA6QwSYzLLP8CJ296n_0hySC1JN30AzyflfL-wLeA837OPD3V9GgG8WE1Y94-YwGWzZsH2ZHOHcM9VL3q57_8dkqUNZ-AimkDQlsLebgmMREB0CcuXxRbNYMCDXHMF5_UJMRt0nZrd9IMTIt1qgyl91gl" />
                                </div>
                                <div className="flex-grow pb-4 border-b border-surface-variant/50">
                                    <p className="font-body-md text-on-surface"><span className="font-label-md text-label-md">Sarah Jenkins</span> enrolled in <span className="text-secondary italic">Advanced Typography</span>.</p>
                                    <p className="text-xs text-on-surface-variant mt-1">2 hours ago</p>
                                </div>
                            </div>
                            {/* Feed Item 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-surface-variant">
                                    <img alt="Student Marcus Thorne Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2zRYMKB_3dcjvCr1-QgpeXpTmWGkWy2tkVI_PFXX3XaptPZFxTfD-r98jJELmNSLhhwO_ze_tTQptik497wHO7-NWWyFylNnuhxBc22peChfNiE1gp7fkLPX0DD3-oirHYxh9ZbZ7L_M3Qs6ycoQhu0rKDpa531gWJJGeUG84qxGXBfIeQIxmQ4euENGzuBqMUx1BrP4MyJ8Y8TaL3Ha-Qt3ncZs6aggzMEZyLMI7kZVgBz-4kNOw" />
                                </div>
                                <div className="flex-grow pb-4 border-b border-surface-variant/50">
                                    <p className="font-body-md text-on-surface"><span className="font-label-md text-label-md">Marcus Thorne</span> submitted a project to the <span className="text-tertiary italic">Student Gallery</span>.</p>
                                    <p className="text-xs text-on-surface-variant mt-1">5 hours ago</p>
                                </div>
                            </div>
                            {/* Feed Item 3 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-primary-container flex items-center justify-center text-primary-fixed-dim">
                                    <span className="material-symbols-outlined text-sm">campaign</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-body-md text-on-surface">System generated <span className="font-label-md text-label-md">Monthly Earnings Report</span> for trainers.</p>
                                    <p className="text-xs text-on-surface-variant mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Happening Now (Live Classes) */}
                    <div className="md:col-span-4 bg-surface-container-lowest ambient-shadow rounded-xl p-8">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-error">radio_button_checked</span>
                            Live Now
                        </h3>
                        <div className="flex flex-col gap-4">
                            {/* Class Card */}
                            <div className="border border-outline-variant rounded-lg p-4 hover:border-primary transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-label-md px-2 py-1 bg-surface-container rounded text-on-surface-variant">Illustration</span>
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-error"></span>
                                    </span>
                                </div>
                                <h4 className="font-headline-sm text-[18px] leading-snug text-on-surface mb-1 group-hover:text-primary transition-colors">Digital Watercolor Basics</h4>
                                <p className="text-sm text-on-surface-variant mb-4">with Elena Rostova</p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex -space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-surface-variant border-2 border-surface-lowest"></div>
                                        <div className="w-6 h-6 rounded-full bg-surface-dim border-2 border-surface-lowest"></div>
                                        <div className="w-6 h-6 rounded-full bg-surface-container-highest border-2 border-surface-lowest flex items-center justify-center text-[10px] text-on-surface-variant">+42</div>
                                    </div>
                                    <button className="text-xs font-label-md text-primary">Monitor</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
