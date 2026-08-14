export default function AdminDashboardOverviewReimagined() {
    return (
        <section className="flex-grow flex flex-col gap-8 w-full min-w-0 p-margin-mobile md:p-margin-desktop min-h-screen">
            {/* Journal CMS Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-primary/20 pb-8 relative">
                <div className="flex flex-col gap-2 max-w-2xl">
                    <div className="flex items-center gap-4">
                        <span className="font-display-xl text-display-xl text-surface-tint/20 absolute -z-10 -mt-12 -ml-8 select-none">03</span>
                        <h1 className="font-headline-md text-headline-md text-primary leading-tight">Journal CMS</h1>
                    </div>
                    <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">Curate and manage the artistic monographs and editorial pieces published in the academy's journal.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-label-mono text-label-mono uppercase tracking-widest hover:bg-secondary transition-colors duration-300 flex-shrink-0">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Entry
                </button>
            </header>

            {/* Bento Grid Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
                {/* Stats Card 1 */}
                <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-primary/20 p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary-fixed/30 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest relative z-10">Total Entries</span>
                    <div className="flex items-baseline gap-2 relative z-10 mt-4">
                        <span className="font-headline-md text-headline-md text-primary">142</span>
                        <span className="font-annotation text-annotation text-on-tertiary-container ml-2">+12 this month</span>
                    </div>
                </div>
                {/* Stats Card 2 */}
                <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-primary/20 p-6 flex flex-col justify-between min-h-[160px] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-container/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110 duration-500"></div>
                    <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest relative z-10">Drafts Pending</span>
                    <div className="flex items-baseline gap-2 relative z-10 mt-4">
                        <span className="font-headline-md text-headline-md text-primary">08</span>
                        <span className="font-annotation text-annotation text-secondary ml-2">Requires review</span>
                    </div>
                </div>
                {/* Quick Action */}
                <div className="col-span-1 md:col-span-4 bg-surface-container-lowest border border-primary/20 p-6 flex flex-col justify-between min-h-[160px] cursor-pointer hover:bg-surface-container transition-colors duration-300">
                    <div className="flex justify-between items-start">
                        <span className="font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">Recent Activity</span>
                        <span className="material-symbols-outlined text-primary/50">arrow_outward</span>
                    </div>
                    <p className="font-body-md text-body-md text-primary font-medium mt-4">"The Aesthetics of Silence" was published by E. Chief 2 hours ago.</p>
                </div>

                {/* Main Table Section */}
                <div className="col-span-1 md:col-span-12 bg-surface-container-lowest border border-primary/20 flex flex-col mt-8">
                    <div className="p-6 border-b border-primary/10 flex justify-between items-center bg-surface-container/30">
                        <h2 className="font-headline-md text-headline-md text-primary">Published Monologues</h2>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/50 text-[18px]">search</span>
                                <input className="pl-10 pr-4 py-2 bg-transparent border-b border-primary/30 focus:border-primary focus:outline-none font-body-md text-body-md w-64 text-primary placeholder:text-primary/40 rounded-none transition-colors duration-300" placeholder="Search entries..." type="text" />
                            </div>
                            <button className="material-symbols-outlined text-primary/70 hover:text-primary transition-colors">filter_list</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-primary/10 bg-background/50">
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal w-12">No.</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Title &amp; Author</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Category</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Status</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal">Date</th>
                                    <th className="py-4 px-6 font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant font-normal text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary/5">
                                {/* Row 1 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6 font-label-mono text-label-mono text-primary/40">01</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <img alt="The Architecture of Nothingness Artwork" className="w-12 h-16 object-cover border border-primary/10 grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMwaww_eznpyrMTpqzfx26vdOP7PMjM1LibVeIjS7lMygzClEibTBLA6xT4879En2ybMegEQ_CR_JWlDCpFom4DSXG1_ooUD-co5lQFuM64x-MyVJ6TCSKXSPSGDOyFxx5xhgDph7KVrMnKadpd1SGwaGjYl1nhH2Tu5zYxIBGcCVtVdjXdD2eEFqvsPiBjc1uC68xYRksyzVioWsZGGKR0Xge0-6b5WZFmpWcz5zAHOC5JBv58Sap" />
                                            <div className="flex flex-col">
                                                <span className="font-body-md text-body-md font-medium text-primary">The Architecture of Nothingness</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">by Julian K.</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">Philosophy</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-tertiary-fixed text-tertiary-container font-label-mono text-[10px] uppercase tracking-widest bg-tertiary-fixed/10">
                                            <span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-none"></span> Published
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant">Oct 24, 2024</td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-primary hover:text-secondary font-label-mono text-[12px] uppercase tracking-widest border-b border-transparent hover:border-secondary transition-all">Edit</button>
                                    </td>
                                </tr>
                                {/* Row 2 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6 font-label-mono text-label-mono text-primary/40">02</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-16 bg-surface-container border border-primary/10 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary/20">image</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-body-md text-body-md font-medium text-primary">Tactile Textures in Digital Spaces</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">by Sarah Jenkins</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">Design</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-secondary-container text-secondary font-label-mono text-[10px] uppercase tracking-widest bg-secondary-container/10">
                                            <span className="w-1.5 h-1.5 bg-secondary-container rounded-none"></span> Draft
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant">Oct 22, 2024</td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-primary hover:text-secondary font-label-mono text-[12px] uppercase tracking-widest border-b border-transparent hover:border-secondary transition-all">Edit</button>
                                    </td>
                                </tr>
                                {/* Row 3 */}
                                <tr className="hover:bg-surface-container-low transition-colors duration-200 group">
                                    <td className="py-4 px-6 font-label-mono text-label-mono text-primary/40">03</td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-4">
                                            <img alt="Curating the Void Artwork" className="w-12 h-16 object-cover border border-primary/10 grayscale group-hover:grayscale-0 transition-all duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3WSW9py--uzFdj0jt0BjpwLU6b85_ZTCcwzBrf2wMHPGCExTFxNl1XkBmAhRrfyBSDnLjDfhqLvapUb6fRdn2HOGCrfpBGGbeFwOYnBJIRlH8yl0e1_AfUNAmcUdCt2xUuHSGZJqsT3ZiXwlGfDYOuXb0B8hlgsjo-Xt4RPzPG-CPSmDo7nmXBIF1wW3lXrflbqmDSg1Mw5nIjBl4nz77E6GTR3QCrhVJGHdJLkpftHXZ6D1ubva9" />
                                            <div className="flex flex-col">
                                                <span className="font-body-md text-body-md font-medium text-primary">Curating the Void</span>
                                                <span className="font-annotation text-annotation text-on-surface-variant">by Marcus Thorne</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">Exhibition</td>
                                    <td className="py-4 px-6">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-tertiary-fixed text-tertiary-container font-label-mono text-[10px] uppercase tracking-widest bg-tertiary-fixed/10">
                                            <span className="w-1.5 h-1.5 bg-tertiary-fixed rounded-none"></span> Published
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 font-label-mono text-label-mono text-on-surface-variant">Oct 15, 2024</td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-primary hover:text-secondary font-label-mono text-[12px] uppercase tracking-widest border-b border-transparent hover:border-secondary transition-all">Edit</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-primary/10 flex justify-between items-center bg-surface-container-low/50">
                        <span className="font-label-mono text-label-mono text-on-surface-variant">Showing 1-3 of 142</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-primary/20 text-primary font-label-mono text-[12px] hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-primary">Prev</button>
                            <button className="px-3 py-1 border border-primary/20 text-primary font-label-mono text-[12px] hover:bg-primary hover:text-on-primary transition-colors">Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
