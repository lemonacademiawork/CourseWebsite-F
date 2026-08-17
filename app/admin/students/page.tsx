export default function AdminStudentManagement() {
    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen">

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Students</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Manage student enrollments, progress, and account details.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg border border-outline text-on-surface font-semibold text-xs hover:bg-surface-variant transition-colors flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">upload_file</span>
                        Import Excel
                    </button>
                    <button className="px-3 py-1.5 rounded-lg border border-outline text-on-surface font-semibold text-xs hover:bg-surface-variant transition-colors flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Export Students
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Add Student
                    </button>
                </div>
            </header>

            <section className="mb-4 flex flex-col lg:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-3 rounded-lg shadow-sm border border-outline-variant/30">
                <div className="w-full lg:w-80 relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                    <input className="w-full pl-9 pr-4 py-1.5 bg-surface rounded-lg border-none focus:ring-2 focus:ring-primary-container text-xs placeholder:text-outline transition-shadow" placeholder="Search by name, email or phone..." type="text" />
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                    <button className="px-3 py-1.5 rounded-lg bg-surface-variant text-on-surface font-semibold text-xs whitespace-nowrap">All Students</button>
                    <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface hover:text-on-surface font-semibold text-xs transition-colors whitespace-nowrap">Active</button>
                    <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface hover:text-on-surface font-semibold text-xs transition-colors whitespace-nowrap">Pending Payment</button>
                    <button className="px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface hover:text-on-surface font-semibold text-xs transition-colors whitespace-nowrap">Alumni</button>
                    <button className="p-1.5 rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface transition-colors flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                    </button>
                </div>
            </section>

            <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="w-full overflow-x-auto table-container">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant text-xs uppercase tracking-wider">
                                <th className="py-3 px-4 font-semibold">Student</th>
                                <th className="py-3 px-4 font-semibold">Contact</th>
                                <th className="py-3 px-4 font-semibold">Courses</th>
                                <th className="py-3 px-4 font-semibold">Join Date</th>
                                <th className="py-3 px-4 font-semibold">Status</th>
                                <th className="py-3 px-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-xs text-on-surface divide-y divide-surface-variant">

                            <tr className="hover:bg-primary-container/5 transition-colors group">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/50 shrink-0">
                                            <img className="w-full h-full object-cover" data-alt="A professional headshot of a young female creative student in a brightly lit modern studio, smiling gently, dressed in a warm casual sweater. Soft, warm natural lighting emphasizing a premium, clean aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuByypWae98SyJzNyi_EdCB6yw5RRyBtWiPfVdT80QakSUhDw9qa7LNFlrJLoiTg7ADe9mLGAAzXvdrvbgMwTyveFYd_2mD2rawYYfLGVfsvtaYUSyxuzycLhgNgI35pGjxxhj7ZtDsCJjZj9X5by6dzZvSuRoltS33s82cxLz5bOadpGtOuE961KNyG2u30RaSHkE3-_er1tfkFXUuVlnxHrCzM9ZxpRrSK83zWmYL_Gv9FkcS_ARxa" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-on-surface group-hover:text-primary transition-colors">Elena Rodriguez</p>
                                            <p className="text-[10px] text-on-surface-variant">ID: #LA-8492</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <p className="text-on-surface">elena.r@example.com</p>
                                    <p className="text-[10px] text-on-surface-variant">+1 (555) 293-1029</p>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-secondary-container/20 text-on-secondary-container flex items-center justify-center font-semibold text-[10px]">3</span>
                                        <span className="text-on-surface-variant">Active</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-on-surface-variant">Oct 12, 2023</td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-semibold">
                                        <span className="w-1 h-1 rounded-full bg-tertiary"></span> Paid
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-full transition-colors tooltip-trigger" title="View Details">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button className="p-1 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 rounded-full transition-colors tooltip-trigger" title="Edit">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors tooltip-trigger" title="Disable">
                                            <span className="material-symbols-outlined text-[18px]">block</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr className="hover:bg-primary-container/5 transition-colors group">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant/50 shrink-0 flex items-center justify-center bg-surface-variant text-on-surface-variant font-bold text-[11px]">
                                            MJ
                                        </div>
                                        <div>
                                            <p className="font-bold text-on-surface group-hover:text-primary transition-colors">Marcus Johnson</p>
                                            <p className="text-[10px] text-on-surface-variant">ID: #LA-8493</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <p className="text-on-surface">marcus.j@example.com</p>
                                    <p className="text-[10px] text-on-surface-variant">+44 7700 900077</p>
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-5 h-5 rounded-full bg-secondary-container/20 text-on-secondary-container flex items-center justify-center font-semibold text-[10px]">1</span>
                                        <span className="text-on-surface-variant">Active</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-on-surface-variant">Nov 05, 2023</td>
                                <td className="py-3 px-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-semibold">
                                        <span className="w-1 h-1 rounded-full bg-secondary"></span> Pending
                                    </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-full transition-colors tooltip-trigger" title="View Details">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        <button className="p-1 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 rounded-full transition-colors tooltip-trigger" title="Edit">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors tooltip-trigger" title="Disable">
                                            <span className="material-symbols-outlined text-[18px]">block</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-3 border-t border-outline-variant/30 flex items-center justify-between bg-surface-container-lowest">
                    <p className="text-xs text-on-surface-variant">Showing 1 to 10 of 245 students</p>
                    <div className="flex items-center gap-1.5">
                        <button className="w-7 h-7 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                        </button>
                        <button className="w-7 h-7 rounded-lg bg-primary-container text-on-primary-container font-semibold text-xs flex items-center justify-center">1</button>
                        <button className="w-7 h-7 rounded-lg hover:bg-surface-variant text-on-surface-variant font-semibold text-xs flex items-center justify-center transition-colors">2</button>
                        <button className="w-7 h-7 rounded-lg hover:bg-surface-variant text-on-surface-variant font-semibold text-xs flex items-center justify-center transition-colors">3</button>
                        <span className="text-on-surface-variant px-0.5 text-xs">...</span>
                        <button className="w-7 h-7 rounded-lg hover:bg-surface-variant text-on-surface-variant font-semibold text-xs flex items-center justify-center transition-colors">25</button>
                        <button className="w-7 h-7 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors">
                            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
