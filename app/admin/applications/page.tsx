export default function AdminTrainerApplicationsDashboard() {
    return (
        <main className="flex-1 p-margin-mobile md:p-margin-desktop bg-surface min-h-screen">

<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Trainer Applications</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Review and manage new instructor requests to join Lemon Academy.</p>
</div>
<div className="flex gap-4 w-full md:w-auto">
<div className="relative w-full md:w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" placeholder="Search applicants..." type="text" />
</div>
<button className="bg-surface-container-highest text-on-surface p-2 rounded-lg hover:bg-surface-variant transition-colors flex items-center justify-center hidden md:flex">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
</button>
</div>
</header>

<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">

<div className="bg-surface-container-lowest rounded-xl p-6 organic-shadow hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface" data-icon="inbox">inbox</span>
</div>
<span className="font-label-md text-label-md text-secondary bg-secondary-container/20 px-2 py-1 rounded-full">+12%</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">142</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Total Applications</p>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 organic-shadow hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full relative overflow-hidden">
<div className="absolute right-0 top-0 w-32 h-32 bg-primary-container/10 rounded-bl-full -z-10"></div>
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-lg bg-primary-container/30 flex items-center justify-center">
<span className="material-symbols-outlined text-primary" data-icon="fiber_new">fiber_new</span>
</div>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">28</h3>
<p className="font-body-md text-body-md text-on-surface-variant">New This Week</p>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 organic-shadow hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-lg bg-tertiary-container/30 flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary" data-icon="pending_actions">pending_actions</span>
</div>
<span className="font-label-md text-label-md text-tertiary bg-tertiary-container/20 px-2 py-1 rounded-full">Requires Attention</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">15</h3>
<p className="font-body-md text-body-md text-on-surface-variant">In Review</p>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 organic-shadow hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between h-full">
<div className="flex justify-between items-start mb-4">
<div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface" data-icon="check_circle">check_circle</span>
</div>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">98</h3>
<p className="font-body-md text-body-md text-on-surface-variant">Approved YTD</p>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl organic-shadow overflow-hidden">
<div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-bright">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Applications</h3>
<button className="font-label-md text-label-md text-primary flex items-center gap-1 hover:underline">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
<th className="p-4 font-label-md text-label-md text-on-surface-variant font-semibold">Applicant</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant font-semibold">Category</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant font-semibold">Experience</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant font-semibold hidden sm:table-cell">Date Submitted</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant font-semibold text-right">Action</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md">

<tr className="border-b border-outline-variant/30 hover:bg-primary-fixed/5 transition-colors group">
<td className="p-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a young creative professional woman with curly hair in an art studio, natural light, modern editorial style, high resolution, soft minimalist aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu15p6NeFQ_Lg6hJ-hj3dsuK_mZeQvsiR0bmbxGiLbWavRxIrNJ5EVBFdB5UMyby-652e0qtvVMLDzerPftI9uJjNKQuGAkSoDtg8ZVK07jTmMumPLtXNotdkfyaJoKH5CiW3avqvSkV7ZQvXtlC1hkLQBY-U_CkAOpV0gRg15pQycuPBeqsB9VvZb0Rs_c5Nd_SuKuyEW3Fnnv_BvoUVPwDQwztoQAihRBMkP99OJbvrpAe9sY-On" />
<div>
<p className="font-semibold text-on-surface">Elena Rodriguez</p>
<p className="text-sm text-on-surface-variant">elena.r@email.com</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Digital Illustration</td>
<td className="p-4 text-on-surface-variant">5 Years</td>
<td className="p-4 text-on-surface-variant hidden sm:table-cell">Oct 24, 2024</td>
<td className="p-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface-container text-on-surface font-label-md text-xs">
<span className="w-2 h-2 rounded-full bg-primary"></span> New
                                </span>
</td>
<td className="p-4 text-right">
<button className="font-label-md text-label-md text-on-surface px-4 py-2 rounded-lg border border-outline hover:bg-surface-container transition-colors">Review</button>
</td>
</tr>

<tr className="border-b border-outline-variant/30 hover:bg-primary-fixed/5 transition-colors group">
<td className="p-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="Portrait of a male ceramic artist with a beard, wearing an apron, in a bright pottery studio, soft minimal lighting, editorial photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZmPDqbF00Fb5jmesjeN9872krcPLkXAwAHyuJSOcpmZ4vobw4-k-Y_Cq8dtkG4a0T4p11iO0DuNTBVsXWcjX2olBOHDfVz2g3meu78z0EQJBIRy9FQlcw89c-8Ciy2Hms3rNubI86zMvs08SoY3oOK5J6B8O_mRzyNvX57x0YRE4_t8eWQpYtlXXGmzGey2aJAMH5oSEiwkZLxekY1dAOzmK_WEgNcHqwL6uf_JZiPodln2oo6BjA" />
<div>
<p className="font-semibold text-on-surface">Marcus Chen</p>
<p className="text-sm text-on-surface-variant">m.chen.art@email.com</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Ceramics &amp; Sculpture</td>
<td className="p-4 text-on-surface-variant">8 Years</td>
<td className="p-4 text-on-surface-variant hidden sm:table-cell">Oct 22, 2024</td>
<td className="p-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label-md text-xs">
<span className="w-2 h-2 rounded-full bg-tertiary"></span> In Review
                                </span>
</td>
<td className="p-4 text-right">
<button className="font-label-md text-label-md text-on-surface px-4 py-2 rounded-lg border border-outline hover:bg-surface-container transition-colors">Continue</button>
</td>
</tr>

<tr className="border-b border-outline-variant/30 hover:bg-primary-fixed/5 transition-colors group">
<td className="p-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">
                                        SW
                                    </div>
<div>
<p className="font-semibold text-on-surface">Sarah Williams</p>
<p className="text-sm text-on-surface-variant">sarah.w.design@email.com</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Typography</td>
<td className="p-4 text-on-surface-variant">3 Years</td>
<td className="p-4 text-on-surface-variant hidden sm:table-cell">Oct 20, 2024</td>
<td className="p-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-xs">
<span className="w-2 h-2 rounded-full bg-error"></span> Missing Info
                                </span>
</td>
<td className="p-4 text-right">
<button className="font-label-md text-label-md text-on-surface px-4 py-2 rounded-lg border border-outline hover:bg-surface-container transition-colors">View Details</button>
</td>
</tr>

<tr className="hover:bg-primary-fixed/5 transition-colors group">
<td className="p-4">
<div className="flex items-center gap-3">
<img className="w-10 h-10 rounded-full object-cover" data-alt="Portrait of an older male photographer with grey hair, holding a vintage camera in a minimalist white studio space, high contrast soft light, premium editorial feel." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4lVfBPq9Qif-p86n4H8i-uC0g6C-8aokW0JFjxF3l7HJke8VQnN6DCnFBpmnGTA0qTlfSVit3kWMwwJc_NZ7Tgqh8rBmXz8D81Cp5uJJUkx5Ffg-dSUeQ3fhPCBQWyCrbzPBMaNi-kxpeZvuezwccZfT36sSfk_pwQ5ziNTjqnpATCDMZhJ6o8KIB38Ksjd299-O17R7wHeCjzgBtSU4s9WRaX0Z96iOtkjmrK_Mhhp9eDPqcCRmg" />
<div>
<p className="font-semibold text-on-surface">David O'Connor</p>
<p className="text-sm text-on-surface-variant">doconnor.photo@email.com</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Photography</td>
<td className="p-4 text-on-surface-variant">15+ Years</td>
<td className="p-4 text-on-surface-variant hidden sm:table-cell">Oct 18, 2024</td>
<td className="p-4">
<span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-tertiary-container/30 text-tertiary font-label-md text-xs">
<span className="w-2 h-2 rounded-full bg-tertiary"></span> In Review
                                </span>
</td>
<td className="p-4 text-right">
<button className="font-label-md text-label-md text-on-surface px-4 py-2 rounded-lg border border-outline hover:bg-surface-container transition-colors">Continue</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 border-t border-outline-variant/30 flex justify-between items-center bg-surface-bright">
<p className="text-sm text-on-surface-variant">Showing 1 to 4 of 142 entries</p>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container disabled:opacity-50" disabled>
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</section>
</main>
    );
}
