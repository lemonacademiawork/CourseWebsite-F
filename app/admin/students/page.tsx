export default function AdminStudentManagement() {
    return (
        <main className="flex-1 p-margin-mobile md:p-margin-desktop w-full max-w-full">

<header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Students</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Manage student enrollments, progress, and account details.</p>
</div>
<div className="flex flex-wrap items-center gap-3">
<button className="px-5 py-2.5 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">upload_file</span>
                    Import Excel
                </button>
<button className="px-5 py-2.5 rounded-full border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">download</span>
                    Export Students
                </button>
<button className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-[18px]">add</span>
                    Add Student
                </button>
</div>
</header>

<section className="mb-8 flex flex-col lg:flex-row items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-xl shadow-[0_4px_20px_rgba(45,45,45,0.05)] border border-surface-container-high">
<div className="w-full lg:w-96 relative">
<span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-12 pr-4 py-3 bg-surface rounded-full border-none focus:ring-2 focus:ring-primary-container text-body-md placeholder:text-outline font-body-md transition-shadow" placeholder="Search by name, email or phone..." type="text" />
</div>
<div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
<button className="px-4 py-2 rounded-full bg-surface-variant text-on-surface font-label-md text-label-md whitespace-nowrap">All Students</button>
<button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface hover:text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Active</button>
<button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface hover:text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Pending Payment</button>
<button className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface hover:text-on-surface font-label-md text-label-md transition-colors whitespace-nowrap">Alumni</button>
<button className="px-3 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-[20px]">tune</span>
</button>
</div>
</section>

<section className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(45,45,45,0.05)] border border-surface-container-high overflow-hidden">
<div className="w-full overflow-x-auto table-container">
<table className="w-full text-left border-collapse min-w-[1000px]">
<thead>
<tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
<th className="py-4 px-6 font-semibold">Student</th>
<th className="py-4 px-6 font-semibold">Contact</th>
<th className="py-4 px-6 font-semibold">Courses</th>
<th className="py-4 px-6 font-semibold">Join Date</th>
<th className="py-4 px-6 font-semibold">Status</th>
<th className="py-4 px-6 font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface divide-y divide-surface-variant">

<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-variant shrink-0">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a young female creative student in a brightly lit modern studio, smiling gently, dressed in a warm casual sweater. Soft, warm natural lighting emphasizing a premium, clean aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuByypWae98SyJzNyi_EdCB6yw5RRyBtWiPfVdT80QakSUhDw9qa7LNFlrJLoiTg7ADe9mLGAAzXvdrvbgMwTyveFYd_2mD2rawYYfLGVfsvtaYUSyxuzycLhgNgI35pGjxxhj7ZtDsCJjZj9X5by6dzZvSuRoltS33s82cxLz5bOadpGtOuE961KNyG2u30RaSHkE3-_er1tfkFXUuVlnxHrCzM9ZxpRrSK83zWmYL_Gv9FkcS_ARxa" />
</div>
<div>
<p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Elena Rodriguez</p>
<p className="text-[13px] text-on-surface-variant">ID: #LA-8492</p>
</div>
</div>
</td>
<td className="py-4 px-6">
<p className="text-on-surface">elena.r@example.com</p>
<p className="text-[13px] text-on-surface-variant">+1 (555) 293-1029</p>
</td>
<td className="py-4 px-6">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-secondary-container/20 text-on-secondary-container flex items-center justify-center font-label-md text-[12px]">3</span>
<span className="text-on-surface-variant">Active</span>
</div>
</td>
<td className="py-4 px-6 text-on-surface-variant">Oct 12, 2023</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant font-label-md text-[12px]">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Paid
                                </span>
</td>
<td className="py-4 px-6 text-right">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-full transition-colors tooltip-trigger" title="View Details">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 rounded-full transition-colors tooltip-trigger" title="Edit">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors tooltip-trigger" title="Disable">
<span className="material-symbols-outlined text-[20px]">block</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-primary-container/5 transition-colors group">
<td className="py-4 px-6">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-variant shrink-0 flex items-center justify-center bg-surface-variant text-on-surface-variant font-headline-sm">
                                        MJ
                                    </div>
<div>
<p className="font-semibold text-on-surface group-hover:text-primary transition-colors">Marcus Johnson</p>
<p className="text-[13px] text-on-surface-variant">ID: #LA-8493</p>
</div>
</div>
</td>
<td className="py-4 px-6">
<p className="text-on-surface">marcus.j@example.com</p>
<p className="text-[13px] text-on-surface-variant">+44 7700 900077</p>
</td>
<td className="py-4 px-6">
<div className="flex items-center gap-2">
<span className="w-6 h-6 rounded-full bg-secondary-container/20 text-on-secondary-container flex items-center justify-center font-label-md text-[12px]">1</span>
<span className="text-on-surface-variant">Active</span>
</div>
</td>
<td className="py-4 px-6 text-on-surface-variant">Nov 05, 2023</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-md text-[12px]">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Pending
                                </span>
</td>
<td className="py-4 px-6 text-right">
<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-full transition-colors tooltip-trigger" title="View Details">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/20 rounded-full transition-colors tooltip-trigger" title="Edit">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors tooltip-trigger" title="Disable">
<span className="material-symbols-outlined text-[20px]">block</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="px-6 py-4 border-t border-surface-variant flex items-center justify-between bg-surface-container-lowest">
<p className="font-body-md text-[14px] text-on-surface-variant">Showing 1 to 10 of 245 students</p>
<div className="flex items-center gap-2">
<button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors disabled:opacity-50" disabled>
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-md text-[14px] flex items-center justify-center">1</button>
<button className="w-8 h-8 rounded-full hover:bg-surface-variant text-on-surface-variant font-label-md text-[14px] flex items-center justify-center transition-colors">2</button>
<button className="w-8 h-8 rounded-full hover:bg-surface-variant text-on-surface-variant font-label-md text-[14px] flex items-center justify-center transition-colors">3</button>
<span className="text-on-surface-variant px-1">...</span>
<button className="w-8 h-8 rounded-full hover:bg-surface-variant text-on-surface-variant font-label-md text-[14px] flex items-center justify-center transition-colors">25</button>
<button className="w-8 h-8 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
</section>
</main>
    );
}
