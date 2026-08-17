export default function AdminDashboardOverview() {
    return (
        <div className="relative min-h-screen pb-4">
            {/* Abstract Background Pattern (Subtle & Premium) */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10">
                {/* Welcome Header */}
                <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">
                            Welcome Admin
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
                        <div className="w-9 h-9 rounded-full bg-surface-container-highest border-2 border-surface-lowest overflow-hidden shadow-sm">
                            <img alt="Admin Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiZ4bmrxwarPOLvbBAsfKmoeRmL05QcB7t86lrFefM6zAXjJCneFxbt0x6IcGjLmHnwjxgnpitPDruTQ__ItHv0vr8v-t9StQwan-mLdx6zEPy80RbJa6UhB912a2K6gd3BD4OzXpUtSJdzxLcpJiPq6cP2K0VPIAK4TrF2zL_MxqdQh0Asw3uN96s4UJ49j1uNVa14BEaVj4fgOMFehpg8fOKGXQBZmuM7y5bJtGCY5LMNow97gf7" />
                        </div>
                    </div>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 auto-rows-min">
                    
                    {/* KPI 1: Revenue (Visible Separate Box) */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
                            <div className="w-7 h-7 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-base">payments</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">Rs. 45,200</div>
                            <div className="flex items-center gap-1 text-[10px] text-tertiary mt-1">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                <span>+8.4% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 2: Students (Visible Separate Box) */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Total Students</span>
                            <div className="w-7 h-7 rounded-lg bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined text-base">group</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">1,284</div>
                            <div className="flex items-center gap-1 text-[10px] text-tertiary mt-1">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                <span>+12.4% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* KPI 3: Action Needed */}
                    <div className="md:col-span-4 bg-secondary-fixed/5 border border-secondary/15 rounded-xl p-3.5 flex flex-col justify-between shadow-sm">
                        <div className="flex items-center gap-1.5 mb-1.5 border-b border-secondary/10 pb-1">
                            <span className="material-symbols-outlined text-secondary text-xs font-bold">priority_high</span>
                            <span className="font-semibold text-[10px] text-on-surface uppercase tracking-wider">Action Needed</span>
                        </div>
                        <div className="space-y-1.5 flex-grow flex flex-col justify-center">
                            <div className="flex justify-between items-center bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/15 hover:border-outline-variant/30 transition-colors">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-on-surface-variant text-sm">verified</span>
                                    <span className="text-[11px] font-medium text-on-surface">Pending Certificates</span>
                                </div>
                                <span className="bg-error text-on-error text-[9px] px-1.5 py-0.5 rounded-full font-bold">12</span>
                            </div>
                            <div className="flex justify-between items-center bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/15 hover:border-outline-variant/30 transition-colors">
                                <div className="flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-on-surface-variant text-sm">palette</span>
                                    <span className="text-[11px] font-medium text-on-surface">Gallery Approvals</span>
                                </div>
                                <span className="bg-secondary text-on-secondary text-[9px] px-1.5 py-0.5 rounded-full font-bold">8</span>
                            </div>
                        </div>
                    </div>

                    {/* Smaller Metrics Cards Row (Span 12) */}
                    <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-3 mt-1">
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">person_play</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">Trainers</p>
                                <p className="text-sm font-bold text-on-surface leading-tight">24</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">library_books</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">Courses</p>
                                <p className="text-sm font-bold text-on-surface leading-tight">18</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform duration-200">
                            <div className="p-1.5 bg-surface-container-low rounded-lg text-on-surface-variant flex items-center justify-center">
                                <span className="material-symbols-outlined text-base">how_to_reg</span>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">Enrollments</p>
                                <p className="text-sm font-bold text-on-surface leading-tight">3,420</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest rounded-xl p-2.5 px-3 shadow-sm flex items-center gap-1.5 justify-center hover:bg-surface-variant/30 cursor-pointer transition-all border border-dashed border-outline-variant/40">
                            <span className="material-symbols-outlined text-on-surface-variant text-sm">add</span>
                            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-medium">Add Widget</span>
                        </div>
                    </div>

                    {/* Revenue Overview (Area Chart) */}
                    <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm flex flex-col h-[200px] mt-1">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold text-on-surface">Revenue Overview</h3>
                            <select defaultValue="This Year" className="bg-surface-container-low border border-outline-variant/40 text-on-surface text-[11px] rounded-md py-1 pl-2 pr-6 focus:ring-primary focus:border-primary">
                                <option>This Year</option>
                                <option>Last 6 Months</option>
                                <option>This Month</option>
                            </select>
                        </div>
                        {/* Abstract Chart Representation */}
                        <div className="flex-grow relative w-full flex flex-col justify-end min-h-[110px]">
                            <div className="absolute inset-0 border-b border-l border-surface-variant opacity-50 flex flex-col justify-between pb-6">
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                                <div className="w-full h-px bg-surface-variant opacity-30"></div>
                            </div>
                            <div className="w-full h-[70px] relative overflow-hidden rounded-bl-lg">
                                <svg className="w-full h-full absolute bottom-0 left-0 stroke-primary fill-primary-container/20" preserveAspectRatio="none" viewBox="0 0 100 50">
                                    <path d="M0,50 L0,30 Q20,38 40,25 T80,12 L100,8 L100,50 Z" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
                                </svg>
                            </div>
                            <div className="relative w-full flex justify-between text-on-surface-variant text-[10px] z-10 border-t border-outline-variant/30 pt-1.5">
                                <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                            </div>
                        </div>
                    </div>

                    {/* Course Sales Distribution */}
                    <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm flex flex-col h-[200px] mt-1 justify-between">
                        <h3 className="text-xs font-bold text-on-surface mb-2">Course Sales</h3>
                        <div className="space-y-1.5 flex-grow flex flex-col justify-center">
                            {/* Bar 1 */}
                            <div className="space-y-0.5">
                                <div className="flex justify-between text-[10px] text-on-surface-variant">
                                    <span>Candle Making</span>
                                    <span className="font-bold text-on-surface">80%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-secondary-container h-full rounded-full" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                            {/* Bar 2 */}
                            <div className="space-y-0.5">
                                <div className="flex justify-between text-[10px] text-on-surface-variant">
                                    <span>Lippan Art</span>
                                    <span className="font-bold text-on-surface">65%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-tertiary-container h-full rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            {/* Bar 3 */}
                            <div className="space-y-0.5">
                                <div className="flex justify-between text-[10px] text-on-surface-variant">
                                    <span>Resin Art</span>
                                    <span className="font-bold text-on-surface">95%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary-container h-full rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>
                            {/* Bar 4 */}
                            <div className="space-y-0.5">
                                <div className="flex justify-between text-[10px] text-on-surface-variant">
                                    <span>Crochet</span>
                                    <span className="font-bold text-on-surface">40%</span>
                                </div>
                                <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-surface-variant h-full rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Live Classes Today */}
                    <div className="md:col-span-12 bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 shadow-sm mt-1">
                        <h3 className="text-xs font-bold text-on-surface mb-3 flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-secondary text-base">event</span>
                            Live Classes Today
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Live Card 1 */}
                            <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm border-l-4 border-primary flex justify-between items-center">
                                <div>
                                    <h4 className="text-xs text-on-surface font-bold">Intro to Candle Making</h4>
                                    <p className="text-[10px] text-on-surface-variant">Trainer: Sarah Jenkins</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-primary/10 text-primary font-mono text-[9px] px-2 py-0.5 rounded font-bold">10:00 AM</span>
                                    <button className="bg-surface-variant text-on-surface-variant text-xs py-1.5 px-3 rounded flex items-center gap-1.5 hover:bg-surface-variant/80 transition-colors font-semibold">
                                        <span className="material-symbols-outlined text-xs">videocam</span>
                                        Join
                                    </button>
                                </div>
                            </div>
                            {/* Live Card 2 */}
                            <div className="bg-surface-container-lowest p-3 rounded-lg shadow-sm border-l-4 border-secondary flex justify-between items-center">
                                <div>
                                    <h4 className="text-xs text-on-surface font-bold">Mastering Lippan Art</h4>
                                    <p className="text-[10px] text-on-surface-variant">Trainer: Priya Patel</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="bg-secondary/10 text-secondary font-mono text-[9px] px-2 py-0.5 rounded font-bold">2:30 PM</span>
                                    <button className="bg-secondary text-on-secondary text-xs py-1.5 px-3 rounded flex items-center gap-1.5 hover:bg-secondary/90 transition-colors font-semibold shadow-sm">
                                        <span className="material-symbols-outlined text-xs">videocam</span>
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
