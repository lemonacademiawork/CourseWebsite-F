export default function AdminCouponManagementDashboard() {
    return (
        <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full">

<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface mb-2">Coupons &amp; Offers</h2>
<p className="font-body-md text-on-surface-variant">Manage discounts, promotional codes, and track offer performance.</p>
</div>
<button className="bg-primary text-on-primary-container font-label-md text-label-md px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
<span className="material-symbols-outlined text-[20px]">add</span>
                Create New Coupon
            </button>
</header>

<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl group-hover:bg-primary-container/40 transition-all duration-500"></div>
<div className="flex items-center gap-3 mb-4 text-on-surface-variant">
<span className="material-symbols-outlined text-tertiary">check_circle</span>
<h3 className="font-label-md text-label-md text-sm">Active Coupons</h3>
</div>
<p className="font-headline-md text-headline-md text-on-surface">24</p>
<div className="mt-2 flex items-center gap-1 text-sm text-tertiary font-medium">
<span className="material-symbols-outlined text-[16px]">arrow_upward</span>
<span>12% this month</span>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/10 rounded-full blur-2xl group-hover:bg-secondary-container/30 transition-all duration-500"></div>
<div className="flex items-center gap-3 mb-4 text-on-surface-variant">
<span className="material-symbols-outlined text-secondary">currency_rupee</span>
<h3 className="font-label-md text-label-md text-sm">Total Discount Given</h3>
</div>
<p className="font-headline-md text-headline-md text-on-surface">₹45,200</p>
<div className="mt-2 flex items-center gap-1 text-sm text-on-surface-variant">
<span>Across 1,200 transactions</span>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/20 rounded-full blur-2xl group-hover:bg-tertiary-container/40 transition-all duration-500"></div>
<div className="flex items-center gap-3 mb-4 text-on-surface-variant">
<span className="material-symbols-outlined text-tertiary">confirmation_number</span>
<h3 className="font-label-md text-label-md text-sm">Total Coupon Uses</h3>
</div>
<p className="font-headline-md text-headline-md text-on-surface">3,492</p>
<div className="mt-2 flex items-center gap-1 text-sm text-tertiary font-medium">
<span className="material-symbols-outlined text-[16px]">arrow_upward</span>
<span>+450 this week</span>
</div>
</div>

<div className="glass-card rounded-xl p-6 relative overflow-hidden group">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl group-hover:bg-primary-container/40 transition-all duration-500"></div>
<div className="flex items-center gap-3 mb-4 text-on-surface-variant">
<span className="material-symbols-outlined text-primary">account_balance_wallet</span>
<h3 className="font-label-md text-label-md text-sm">Revenue Generated</h3>
</div>
<p className="font-headline-md text-headline-md text-on-surface">₹2.4L</p>
<div className="mt-2 flex items-center gap-1 text-sm text-tertiary font-medium">
<span>Attributed to offers</span>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-xl organic-shadow overflow-hidden">
<div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-white">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Active Campaigns</h3>
<div className="flex gap-2">
<button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-md transition-colors">
<span className="material-symbols-outlined">filter_list</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-md transition-colors">
<span className="material-symbols-outlined">more_vert</span>
</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="border-b border-outline-variant/50 bg-surface-container/30">
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Code</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Discount</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Type</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Applicability</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Usage</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Valid Until</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant">Status</th>
<th className="p-4 font-label-md text-label-md text-on-surface-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="font-body-md text-sm text-on-surface bg-white">

<tr className="border-b border-outline-variant/20 hover:bg-primary-container/5 transition-colors group">
<td className="p-4 font-semibold text-primary">INDEPENDENCE80</td>
<td className="p-4">₹80 OFF</td>
<td className="p-4">Fixed Amount</td>
<td className="p-4">All Courses</td>
<td className="p-4">
<div className="flex items-center gap-2">
<span>342 / ��</span>
<div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary w-1/3"></div>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Aug 16, 2024</td>
<td className="p-4">
<span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-container text-on-tertiary-container inline-flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                    Active
                                </span>
</td>
<td className="p-4 text-right">
<div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors tooltip-trigger" title="Edit">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-secondary transition-colors" title="View Analytics">
<span className="material-symbols-outlined text-[18px]">bar_chart</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-outline transition-colors" title="Pause">
<span className="material-symbols-outlined text-[18px]">pause</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</td>
</tr>

<tr className="border-b border-outline-variant/20 hover:bg-primary-container/5 transition-colors group">
<td className="p-4 font-semibold text-primary">SUMMER20</td>
<td className="p-4">20% OFF</td>
<td className="p-4">Percentage</td>
<td className="p-4">Design Courses</td>
<td className="p-4">
<div className="flex items-center gap-2">
<span>150 / 200</span>
<div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-secondary w-3/4"></div>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Aug 31, 2024</td>
<td className="p-4">
<span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-tertiary-container text-on-tertiary-container inline-flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                    Active
                                </span>
</td>
<td className="p-4 text-right">
<div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors tooltip-trigger" title="Edit">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-secondary transition-colors" title="View Analytics">
<span className="material-symbols-outlined text-[18px]">bar_chart</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-outline transition-colors" title="Pause">
<span className="material-symbols-outlined text-[18px]">pause</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</td>
</tr>

<tr className="border-b border-outline-variant/20 hover:bg-primary-container/5 transition-colors group">
<td className="p-4 font-semibold text-on-surface-variant">NEWUSER500</td>
<td className="p-4 text-on-surface-variant">₹500 OFF</td>
<td className="p-4 text-on-surface-variant">Fixed Amount</td>
<td className="p-4 text-on-surface-variant">First Purchase</td>
<td className="p-4 text-on-surface-variant">
<div className="flex items-center gap-2">
<span>500 / 500</span>
<div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-outline w-full"></div>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Jul 01, 2024</td>
<td className="p-4">
<span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-variant text-on-surface-variant inline-flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                                    Expired
                                </span>
</td>
<td className="p-4 text-right">
<div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-1.5 text-on-surface-variant hover:text-secondary transition-colors" title="View Analytics">
<span className="material-symbols-outlined text-[18px]">bar_chart</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 border-t border-outline-variant/30 flex justify-between items-center text-sm text-on-surface-variant bg-surface-container/20">
<span>Showing 1 to 3 of 24 entries</span>
<div className="flex gap-2">
<button className="px-3 py-1 rounded border border-outline-variant hover:bg-surface-variant transition-colors disabled:opacity-50" disabled>Previous</button>
<button className="px-3 py-1 rounded border border-outline-variant hover:bg-surface-variant transition-colors">Next</button>
</div>
</div>
</section>
</main>
    );
}
