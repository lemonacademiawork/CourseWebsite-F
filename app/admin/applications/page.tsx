export default function AdminTrainerApplicationsDashboard() {
    return (
        <div className="relative min-h-screen pb-12">
            {/* Abstract Background Pattern (Subtle & Premium) */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 relative z-10">
                {/* Welcome Header */}
                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-variant/30 pb-6">
                    <div>
                        <p className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-1">Creative Workspace</p>
                        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface flex items-center gap-2">
                            Trainer Applications <span className="text-3xl">📝</span>
                        </h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">Review and manage new instructor requests to join Lemon Academy.</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/40 rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" placeholder="Search applicants..." type="text" />
                        </div>
                        <button className="bg-surface-container-highest text-on-surface p-2.5 rounded-lg hover:bg-surface-variant transition-colors flex items-center justify-center border border-outline-variant/40 shadow-sm">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </header>

                {/* KPI Cards Bento Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-10">
                    {/* Stat Card 1 */}
                    <div className="glass-card rounded-[16px] p-6 flex flex-col justify-between min-h-[160px] shadow-organic">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Applications</span>
                            <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface">
                                <span className="material-symbols-outlined">inbox</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-lg text-display-lg text-on-surface font-semibold leading-none">142</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-tertiary mt-2">
                                <span className="material-symbols-outlined text-sm">trending_up</span>
                                <span>+12% from last month</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="glass-card rounded-[16px] p-6 flex flex-col justify-between min-h-[160px] shadow-organic relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary-container/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110 duration-500"></div>
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">New This Week</span>
                            <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">fiber_new</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-lg text-display-lg text-on-surface font-semibold leading-none">28</div>
                            <p className="text-xs text-on-surface-variant mt-2 font-label-md">Awaiting initial triage</p>
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="glass-card rounded-[16px] p-6 flex flex-col justify-between min-h-[160px] shadow-organic">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">In Review</span>
                            <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 flex items-center justify-center text-tertiary">
                                <span className="material-symbols-outlined">pending_actions</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-lg text-display-lg text-on-surface font-semibold leading-none">15</div>
                            <div className="flex items-center gap-1 font-label-md text-label-md text-secondary mt-2">
                                <span className="material-symbols-outlined text-sm">priority_high</span>
                                <span>Requires Attention</span>
                            </div>
                        </div>
                    </div>

                    {/* Stat Card 4 */}
                    <div className="glass-card rounded-[16px] p-6 flex flex-col justify-between min-h-[160px] shadow-organic">
                        <div className="flex justify-between items-start">
                            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Approved YTD</span>
                            <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-display-lg text-display-lg text-on-surface font-semibold leading-none">98</div>
                            <p className="text-xs text-on-surface-variant mt-2 font-label-md">Onboarded successfully</p>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-[16px] shadow-sm flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-surface-container/30">
                        <h3 className="font-headline-sm text-headline-sm text-primary font-semibold">Recent Applications</h3>
                        <button className="font-label-md text-label-md text-primary flex items-center gap-1 hover:underline font-bold">
                            View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-primary/10 bg-background/50">
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Applicant</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Category</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Experience</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal hidden sm:table-cell">Date Submitted</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Status</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5 font-body-md text-body-md">
                                {/* Row 1 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <img alt="Elena Rodriguez Avatar" className="w-10 h-10 rounded-full object-cover border border-primary/10 grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu15p6NeFQ_Lg6hJ-hj3dsuK_mZeQvsiR0bmbxGiLbWavRxIrNJ5EVBFdB5UMyby-652e0qtvVMLDzerPftI9uJjNKQuGAkSoDtg8ZVK07jTmMumPLtXNotdkfyaJoKH5CiW3avqvSkV7ZQvXtlC1hkLQBY-U_CkAOpV0gRg15pQycuPBeqsB9VvZb0Rs_c5Nd_SuKuyEW3Fnnv_BvoUVPwDQwztoQAihRBMkP99OJbvrpAe9sY-On" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">Elena Rodriguez</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">elena.r@email.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-on-surface-variant font-semibold">Digital Illustration</td>
                                    <td className="py-4 px-6 text-on-surface-variant">5 Years</td>
                                    <td className="py-4 px-6 text-on-surface-variant hidden sm:table-cell">Oct 24, 2024</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-primary-fixed/40 text-primary font-label-mono text-[10px] uppercase tracking-widest bg-primary-container/10">
                                            <span className="w-1.5 h-1.5 bg-primary rounded-none"></span> New
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="font-label-mono text-[12px] uppercase tracking-widest text-primary hover:text-secondary border border-primary/20 px-4 py-2 hover:bg-primary hover:text-on-primary transition-all duration-300">Review</button>
                                    </td>
                                </tr>

                                {/* Row 2 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <img alt="Marcus Chen Avatar" className="w-10 h-10 rounded-full object-cover border border-primary/10 grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZmPDqbF00Fb5jmesjeN9872krcPLkXAwAHyuJSOcpmZ4vobw4-k-Y_Cq8dtkG4a0T4p11iO0DuNTBVsXWcjX2olBOHDfVz2g3meu78z0EQJBIRy9FQlcw89c-8Ciy2Hms3rNubI86zMvs08SoY3oOK5J6B8O_mRzyNvX57x0YRE4_t8eWQpYtlXXGmzGey2aJAMH5oSEiwkZLxekY1dAOzmK_WEgNcHqwL6uf_JZiPodln2oo6BjA" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">Marcus Chen</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">m.chen.art@email.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-on-surface-variant font-semibold">Ceramics &amp; Sculpture</td>
                                    <td className="py-4 px-6 text-on-surface-variant">8 Years</td>
                                    <td className="py-4 px-6 text-on-surface-variant hidden sm:table-cell">Oct 22, 2024</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-tertiary-fixed/40 text-tertiary font-label-mono text-[10px] uppercase tracking-widest bg-tertiary-fixed/10">
                                            <span className="w-1.5 h-1.5 bg-tertiary rounded-none"></span> In Review
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="font-label-mono text-[12px] uppercase tracking-widest text-primary hover:text-secondary border border-primary/20 px-4 py-2 hover:bg-primary hover:text-on-primary transition-all duration-300">Continue</button>
                                    </td>
                                </tr>

                                {/* Row 3 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-surface-container border border-primary/10 flex items-center justify-center text-primary font-bold">
                                                SW
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">Sarah Williams</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">sarah.w.design@email.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-on-surface-variant font-semibold">Typography</td>
                                    <td className="py-4 px-6 text-on-surface-variant">3 Years</td>
                                    <td className="py-4 px-6 text-on-surface-variant hidden sm:table-cell">Oct 20, 2024</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-error/30 text-error font-label-mono text-[10px] uppercase tracking-widest bg-error-container/10">
                                            <span className="w-1.5 h-1.5 bg-error rounded-none"></span> Missing Info
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="font-label-mono text-[12px] uppercase tracking-widest text-primary hover:text-secondary border border-primary/20 px-4 py-2 hover:bg-primary hover:text-on-primary transition-all duration-300">View Details</button>
                                    </td>
                                </tr>

                                {/* Row 4 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <img alt="David O'Connor Avatar" className="w-10 h-10 rounded-full object-cover border border-primary/10 grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4lVfBPq9Qif-p86n4H8i-uC0g6C-8aokW0JFjxF3l7HJke8VQnN6DCnFBpmnGTA0qTlfSVit3kWMwwJc_NZ7Tgqh8rBmXz8D81Cp5uJJUkx5Ffg-dSUeQ3fhPCBQWyCrbzPBMaNi-kxpeZvuezwccZfT36sSfk_pwQ5ziNTjqnpATCDMZhJ6o8KIB38Ksjd299-O17R7wHeCjzgBtSU4s9WRaX0Z96iOtkjmrK_Mhhp9eDPqcCRmg" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-primary">David O'Connor</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">doconnor.photo@email.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-on-surface-variant font-semibold">Photography</td>
                                    <td className="py-4 px-6 text-on-surface-variant">15+ Years</td>
                                    <td className="py-4 px-6 text-on-surface-variant hidden sm:table-cell">Oct 18, 2024</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-tertiary-fixed/40 text-tertiary font-label-mono text-[10px] uppercase tracking-widest bg-tertiary-fixed/10">
                                            <span className="w-1.5 h-1.5 bg-tertiary rounded-none"></span> In Review
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="font-label-mono text-[12px] uppercase tracking-widest text-primary hover:text-secondary border border-primary/20 px-4 py-2 hover:bg-primary hover:text-on-primary transition-all duration-300">Continue</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
                        <span className="font-label-mono text-label-mono text-on-surface-variant">Showing 1 to 4 of 142 entries</span>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-mono text-xs">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container font-label-mono text-xs">2</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container font-label-mono text-xs">3</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
