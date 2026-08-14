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
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
                            <div className="w-8 h-8 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-lg">payments</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-semibold text-on-surface font-headline-sm leading-none">$45,200</div>
                            <div className="flex items-center gap-1 text-[11px] text-tertiary mt-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+8.4% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: Students (Visible Separate Box) */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">Total Students</span>
                            <div className="w-8 h-8 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-lg">group</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="text-3xl font-semibold text-on-surface font-headline-sm leading-none">1,284</div>
                            <div className="flex items-center gap-1 text-[11px] text-tertiary mt-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12.4% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3: Action Needed */}
                    <div className="md:col-span-4 bg-secondary-fixed/5 border border-secondary/15 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                        <div className="flex items-center gap-1.5 mb-2 border-b border-secondary/10 pb-1.5">
                            <span className="material-symbols-outlined text-secondary text-sm font-bold">priority_high</span>
                            <span className="font-label-md text-xs font-semibold text-on-surface uppercase tracking-wider">Action Needed</span>
                        </div>
                        <div className="space-y-2 flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/15 hover:border-outline-variant/30 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-on-surface-variant text-base">verified</span>
                                    <span className="font-body-md text-xs text-on-surface">Pending Certificates</span>
                                </div>
                                <span className="bg-error text-on-error font-label-md text-[10px] px-2 py-0.5 rounded-full font-bold">12</span>
                            </div>
                            <div className="flex justify-between items-center bg-surface-container-lowest px-3 py-2 rounded-lg border border-outline-variant/15 hover:border-outline-variant/30 transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-on-surface-variant text-base">palette</span>
                                    <span className="font-body-md text-xs text-on-surface">Gallery Approvals</span>
                                </div>
                                <span className="bg-secondary text-on-secondary font-label-md text-[10px] px-2 py-0.5 rounded-full font-bold">8</span>
                            </div>
                        </div>
                    </div>

                    {/* Smaller Metrics Cards Row (Span 12) */}
                    <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-gutter mt-2">
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">person_play</span>
                            </div>
                            <div>
                                <p className="font-label-md text-on-surface-variant text-[10px] uppercase tracking-wider">Trainers</p>
                                <p className="text-lg font-bold text-on-surface leading-tight">24</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">library_books</span>
                            </div>
                            <div>
                                <p className="font-label-md text-on-surface-variant text-[10px] uppercase tracking-wider">Courses</p>
                                <p className="text-lg font-bold text-on-surface leading-tight">18</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-4 shadow-sm flex items-center gap-3 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-2 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-lg">how_to_reg</span>
                            </div>
                            <div>
                                <p className="font-label-md text-on-surface-variant text-[10px] uppercase tracking-wider">Enrollments</p>
                                <p className="text-lg font-bold text-on-surface leading-tight">3,420</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm flex items-center gap-2 justify-center hover:bg-surface-variant/30 cursor-pointer transition-all border border-dashed border-outline-variant/40">
                            <span className="material-symbols-outlined text-on-surface-variant text-base">add</span>
                            <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-wider">Add Widget</span>
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
                                <div className="w-full bg-surface-container-low h-3 rounded-full overflow-hidden">
                                    <div className="bg-surface-variant h-full rounded-full" style={{ width: '40%' }}></div>
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

                    {/* Live Classes Today */}
                    <div className="md:col-span-12 bg-surface-container-low border border-outline-variant/30 rounded-[16px] p-6 shadow-sm mt-4">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-secondary">event</span>
                            Live Classes Today
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Live Card 1 */}
                            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-primary flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-label-md text-label-md text-on-surface font-bold">Intro to Candle Making</h4>
                                        <span className="bg-primary/10 text-primary font-label-mono text-[10px] px-2 py-0.5 rounded font-bold">10:00 AM</span>
                                    </div>
                                    <p className="font-body-md text-xs text-on-surface-variant mb-4">Trainer: Sarah Jenkins</p>
                                </div>
                                <button className="w-full bg-surface-variant text-on-surface-variant font-label-md text-sm py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant/80 transition-colors font-semibold">
                                    <span className="material-symbols-outlined text-base">videocam</span>
                                    Join Zoom
                                </button>
                            </div>
                            {/* Live Card 2 */}
                            <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-secondary flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-label-md text-label-md text-on-surface font-bold">Mastering Lippan Art</h4>
                                        <span className="bg-secondary/10 text-secondary font-label-mono text-[10px] px-2 py-0.5 rounded font-bold">2:30 PM</span>
                                    </div>
                                    <p className="font-body-md text-xs text-on-surface-variant mb-4">Trainer: Priya Patel</p>
                                </div>
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
