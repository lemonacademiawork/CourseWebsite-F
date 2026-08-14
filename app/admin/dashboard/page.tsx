export default function AdminDashboardOverview() {
    return (
        <div className="relative min-h-screen pb-12">
            {/* Abstract Background Pattern (Subtle & Premium) */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 relative z-10">
                {/* Welcome Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-variant/30 pb-6">
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">
                            Welcome Admin
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-on-surface hover:text-primary transition-all">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-on-surface hover:text-primary relative transition-all">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-secondary rounded-full border border-surface-lowest"></span>
                        </button>
                        <div className="w-12 h-12 rounded-full bg-surface-container-highest border-2 border-surface-lowest overflow-hidden shadow-sm">
                            <img alt="Admin Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiZ4bmrxwarPOLvbBAsfKmoeRmL05QcB7t86lrFefM6zAXjJCneFxbt0x6IcGjLmHnwjxgnpitPDruTQ__ItHv0vr8v-t9StQwan-mLdx6zEPy80RbJa6UhB912a2K6gd3BD4OzXpUtSJdzxLcpJiPq6cP2K0VPIAK4TrF2zL_MxqdQh0Asw3uN96s4UJ49j1uNVa14BEaVj4fgOMFehpg8fOKGXQBZmuM7y5bJtGCY5LMNow97gf7" />
                        </div>
                    </div>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-min">
                    
                    {/* KPI 1: Revenue (Visible Separate Box) */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-[16px] p-6 flex flex-col justify-between min-h-[180px] shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
                            <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">payments</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-lg text-display-lg text-on-surface font-semibold leading-none">$45,200</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-tertiary mt-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+8.4% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: Students (Visible Separate Box) */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-[16px] p-6 flex flex-col justify-between min-h-[180px] shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Students</span>
                            <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-lg text-display-lg text-on-surface font-semibold leading-none">1,284</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-tertiary mt-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12.4% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3: Action Needed */}
                    <div className="md:col-span-4 bg-secondary-fixed/10 border border-secondary/15 rounded-[16px] p-6 flex flex-col justify-between min-h-[180px] shadow-sm">
                        <div className="flex items-center gap-2 mb-3 border-b border-secondary/10 pb-2">
                            <span className="material-symbols-outlined text-secondary font-bold">priority_high</span>
                            <span className="font-headline-sm text-[20px] font-semibold text-on-surface">Action Needed</span>
                        </div>
                        <div className="space-y-3 flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/10">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-on-surface-variant text-base">verified</span>
                                    <span className="font-label-md text-label-md text-on-surface text-sm">Pending Certificates</span>
                                </div>
                                <span className="bg-error text-on-error font-label-md text-xs px-2.5 py-0.5 rounded-full font-bold">12</span>
                            </div>
                            <div className="flex justify-between items-center bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/10">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-on-surface-variant text-base">palette</span>
                                    <span className="font-label-md text-label-md text-on-surface text-sm">Gallery Approvals</span>
                                </div>
                                <span className="bg-secondary text-on-secondary font-label-md text-xs px-2.5 py-0.5 rounded-full font-bold">8</span>
                            </div>
                        </div>
                    </div>

                    {/* Smaller Metrics Cards Row (Span 12) */}
                    <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-gutter mt-2">
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-[16px] p-5 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined">person_play</span>
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface-variant text-xs uppercase tracking-wider">Trainers</p>
                                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">24</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-[16px] p-5 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined">library_books</span>
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface-variant text-xs uppercase tracking-wider">Courses</p>
                                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">18</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-[16px] p-5 shadow-sm flex items-center gap-4 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined">how_to_reg</span>
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface-variant text-xs uppercase tracking-wider">Enrollments</p>
                                <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">3,420</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-[16px] p-5 shadow-sm flex items-center gap-3 justify-center hover:bg-surface-variant/30 cursor-pointer transition-all border border-dashed border-outline-variant">
                            <span className="material-symbols-outlined text-on-surface-variant">add</span>
                            <span className="font-label-md text-label-md text-on-surface-variant">Add Widget</span>
                        </div>
                    </div>

                    {/* Revenue Overview (Area Chart) */}
                    <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-6 shadow-sm flex flex-col min-h-[360px] mt-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Revenue Overview</h3>
                            <select defaultValue="This Year" className="bg-surface-container-low border border-outline-variant/40 text-on-surface font-label-md text-label-md rounded-lg py-2 pl-4 pr-8 focus:ring-primary focus:border-primary">
                                <option>This Year</option>
                                <option>Last 6 Months</option>
                                <option>This Month</option>
                            </select>
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
                                <svg className="w-full h-full absolute bottom-0 left-0 stroke-primary fill-primary-container/20" preserveAspectRatio="none" viewBox="0 0 100 50">
                                    <path d="M0,50 L0,30 Q20,38 40,25 T80,12 L100,8 L100,50 Z" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                </svg>
                            </div>
                            <div className="relative w-full flex justify-between text-on-surface-variant font-label-md text-xs z-10 border-t border-outline-variant/30 pt-2 mt-auto">
                                <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Sales Distribution (Horizontal Progress Chart - Avoids Div Overflow) */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-6 shadow-sm flex flex-col mt-4 justify-between min-h-[360px]">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-6">Course Sales</h3>
                        <div className="space-y-4 flex-grow flex flex-col justify-center">
                            {/* Bar 1 */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                    <span>Candle Making</span>
                                    <span className="font-bold text-on-surface">80%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                                    <div className="bg-secondary-container h-full rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                            {/* Bar 2 */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                    <span>Lippan Art</span>
                                    <span className="font-bold text-on-surface">65%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                                    <div className="bg-tertiary-container h-full rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            {/* Bar 3 */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                    <span>Resin Art</span>
                                    <span className="font-bold text-on-surface">95%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                                    <div className="bg-primary-container h-full rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                            {/* Bar 4 */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                    <span>Crochet</span>
                                    <span className="font-bold text-on-surface">40%</span>
                                </div>
                                <div className="w-full bg-surface-variant h-full rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            {/* Bar 5 */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs font-label-md text-on-surface-variant">
                                    <span>Mosaic Art</span>
                                    <span className="font-bold text-on-surface">55%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                                    <div className="bg-surface-variant h-full rounded-full" style={{ width: '55%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Studio Vibes (Activity Feed) */}
                    <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] p-8 shadow-sm mt-4">
                        <div className="flex justify-between items-center mb-6 border-b border-surface-variant/30 pb-4">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Recent Studio Vibes</h3>
                            <button className="text-sm font-label-md text-primary hover:underline font-bold">View All</button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {/* Feed Item 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-surface-variant">
                                    <img alt="Student Sarah Jenkins Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSdg39ix0SJRvJCL0yOZgTOPmnwqSeqaR1qRKcZz-RulA8Se3AHNQEa3dsV9aRlGa1EnOc_pDniYjfQIy0lMOk0uGCQYXSA6QwSYzLLP8CJ296n_0hySC1JN30AzyflfL-wLeA837OPD3V9GgG8WE1Y94-YwGWzZsH2ZHOHcM9VL3q57_8dkqUNZ-AimkDQlsLebgmMREB0CcuXxRbNYMCDXHMF5_UJMRt0nZrd9IMTIt1qgyl91gl" />
                                </div>
                                <div className="flex-grow pb-4 border-b border-surface-variant/40">
                                    <p className="font-body-md text-on-surface"><span className="font-label-md text-label-md font-semibold text-primary">Sarah Jenkins</span> enrolled in <span className="text-secondary italic font-semibold">Advanced Typography</span>.</p>
                                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">schedule</span> 2 hours ago
                                    </p>
                                </div>
                            </div>
                            {/* Feed Item 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-surface-variant">
                                    <img alt="Student Marcus Thorne Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2zRYMKB_3dcjvCr1-QgpeXpTmWGkWy2tkVI_PFXX3XaptPZFxTfD-r98jJELmNSLhhwO_ze_tTQptik497wHO7-NWWyFylNnuhxBc22peChfNiE1gp7fkLPX0DD3-oirHYxh9ZbZ7L_M3Qs6ycoQhu0rKDpa531gWJJGeUG84qxGXBfIeQIxmQ4euENGzuBqMUx1BrP4MyJ8Y8TaL3Ha-Qt3ncZs6aggzMEZyLMI7kZVgBz-4kNOw" />
                                </div>
                                <div className="flex-grow pb-4 border-b border-surface-variant/40">
                                    <p className="font-body-md text-on-surface"><span className="font-label-md text-label-md font-semibold text-primary">Marcus Thorne</span> submitted a project to the <span className="text-tertiary italic font-semibold">Student Gallery</span>.</p>
                                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">schedule</span> 5 hours ago
                                    </p>
                                </div>
                            </div>
                            {/* Feed Item 3 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-primary-container flex items-center justify-center text-primary-fixed-dim">
                                    <span className="material-symbols-outlined text-lg">campaign</span>
                                </div>
                                <div className="flex-grow">
                                    <p className="font-body-md text-on-surface">System generated <span className="font-label-md text-label-md font-semibold text-primary">Monthly Earnings Report</span> for trainers.</p>
                                    <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-xs">schedule</span> Yesterday
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Classes Today */}
                    <div className="md:col-span-4 bg-surface-container-low border border-outline-variant/30 rounded-[16px] p-6 shadow-sm mt-4">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">event</span>
                            Live Classes Today
                        </h3>
                        <div className="space-y-4">
                            {/* Live Card 1 */}
                            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-primary">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-label-md text-label-md text-on-surface font-bold">Intro to Candle Making</h4>
                                    <span className="bg-primary/10 text-primary font-label-mono text-[10px] px-2 py-0.5 rounded font-bold">10:00 AM</span>
                                </div>
                                <p className="font-body-md text-xs text-on-surface-variant mb-4">Trainer: Sarah Jenkins</p>
                                <button className="w-full bg-surface-variant text-on-surface-variant font-label-md text-sm py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant/80 transition-colors font-semibold">
                                    <span className="material-symbols-outlined text-base">videocam</span>
                                    Join Zoom
                                </button>
                            </div>
                            {/* Live Card 2 */}
                            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-secondary">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-label-md text-label-md text-on-surface font-bold">Mastering Lippan Art</h4>
                                    <span className="bg-secondary/10 text-secondary font-label-mono text-[10px] px-2 py-0.5 rounded font-bold">2:30 PM</span>
                                </div>
                                <p className="font-body-md text-xs text-on-surface-variant mb-4">Trainer: Priya Patel</p>
                                <button className="w-full bg-secondary text-on-secondary font-label-md text-sm py-2 rounded flex justify-center items-center gap-2 hover:bg-secondary/90 transition-colors font-semibold shadow-sm">
                                    <span className="material-symbols-outlined text-base">videocam</span>
                                    Join Zoom
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
