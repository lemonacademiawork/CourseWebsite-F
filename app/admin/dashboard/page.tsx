export default function AdminDashboardOverview() {
    return (
        <main className="p-margin-mobile md:p-margin-desktop min-h-screen">

<header className="mb-10 bento-grid items-end">
<div className="bento-col-12 md:col-span-8">
<h2 className="font-headline-md text-headline-md text-on-surface">Good morning, Admin <span className="text-3xl">👋</span></h2>
<p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Here’s what’s happening at Lemon Academy today.</p>
</div>
<div className="bento-col-12 md:col-span-4 flex md:justify-end mt-4 md:mt-0 gap-4">
<button className="p-3 bg-surface-container-lowest rounded-full organic-shadow text-on-surface hover:text-primary transition-colors">
<span className="material-symbols-outlined" data-icon="search">search</span>
</button>
<button className="p-3 bg-surface-container-lowest rounded-full organic-shadow text-on-surface hover:text-primary transition-colors relative">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
</button>
</div>
</header>

<section className="bento-grid mb-10">

<div className="bento-col-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
<div className="bg-surface-container-lowest rounded-[16px] p-6 organic-shadow hover:-translate-y-1 transition-transform duration-300 group flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Revenue</p>
<h3 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mt-2">$45,200</h3>
</div>
<div className="p-3 bg-primary-container/20 rounded-xl text-primary-fixed-dim">
<span className="material-symbols-outlined text-3xl" data-icon="payments">payments</span>
</div>
</div>
<div className="mt-6 flex items-center gap-2 text-tertiary">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
<span className="font-label-md text-label-md text-sm">+8.4% from last month</span>
</div>
</div>
<div className="bg-surface-container-lowest rounded-[16px] p-6 organic-shadow hover:-translate-y-1 transition-transform duration-300 group flex flex-col justify-between">
<div className="flex justify-between items-start">
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Students</p>
<h3 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mt-2">1,284</h3>
</div>
<div className="p-3 bg-tertiary-container/30 rounded-xl text-tertiary">
<span className="material-symbols-outlined text-3xl" data-icon="group">group</span>
</div>
</div>
<div className="mt-6 flex items-center gap-2 text-tertiary">
<span className="material-symbols-outlined text-sm" data-icon="trending_up">trending_up</span>
<span className="font-label-md text-label-md text-sm">+12.4% from last month</span>
</div>
</div>
</div>

<div className="bento-col-12 md:col-span-4 bg-secondary-fixed/30 rounded-[16px] p-6 organic-shadow border border-secondary/10 flex flex-col justify-center">
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-secondary" data-icon="priority_high">priority_high</span>
                    Action Needed
                </h4>
<div className="space-y-4">
<div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="verified">verified</span>
<span className="font-label-md text-label-md text-on-surface">Pending Certificates</span>
</div>
<span className="bg-error text-on-error font-label-md text-sm px-3 py-1 rounded-full">12</span>
</div>
<div className="flex justify-between items-center bg-surface-container-lowest p-4 rounded-xl shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="palette">palette</span>
<span className="font-label-md text-label-md text-on-surface">Gallery Approvals</span>
</div>
<span className="bg-secondary text-on-secondary font-label-md text-sm px-3 py-1 rounded-full">8</span>
</div>
</div>
</div>

<div className="bento-col-12 md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-gutter">
<div className="bg-surface-container-lowest rounded-[16px] p-5 organic-shadow flex items-center gap-4">
<div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="person_play">person_play</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant text-sm uppercase">Trainers</p>
<p className="font-headline-sm text-headline-sm text-on-surface">24</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-[16px] p-5 organic-shadow flex items-center gap-4">
<div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="library_books">library_books</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant text-sm uppercase">Courses</p>
<p className="font-headline-sm text-headline-sm text-on-surface">18</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-[16px] p-5 organic-shadow flex items-center gap-4">
<div className="p-3 bg-surface-container-low rounded-xl text-on-surface-variant">
<span className="material-symbols-outlined" data-icon="how_to_reg">how_to_reg</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant text-sm uppercase">Enrollments</p>
<p className="font-headline-sm text-headline-sm text-on-surface">3,420</p>
</div>
</div>
<div className="bg-surface-container-lowest rounded-[16px] p-5 organic-shadow flex items-center gap-4 justify-center hover:bg-surface-variant/30 cursor-pointer transition-colors border border-dashed border-outline-variant">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="add">add</span>
<span className="font-label-md text-label-md text-on-surface-variant">Add Widget</span>
</div>
</div>
</section>

<section className="bento-grid mb-10">

<div className="bento-col-12 md:col-span-8 space-y-gutter">

<div className="bg-surface-container-lowest rounded-[16px] p-6 organic-shadow">
<div className="flex justify-between items-center mb-6">
<h4 className="font-headline-sm text-headline-sm text-on-surface">Revenue Overview</h4>
<select className="bg-surface-container-low border-none text-on-surface font-label-md text-label-md rounded-lg py-2 pl-4 pr-8 focus:ring-primary">
<option>This Year</option>
<option>Last 6 Months</option>
<option>This Month</option>
</select>
</div>

<div className="w-full h-64 chart-placeholder rounded-xl relative overflow-hidden flex items-end px-4 pb-4">

<svg className="absolute inset-0 w-full h-full stroke-primary fill-primary-container/20" preserveAspectRatio="none" viewBox="0 0 100 100">
<path d="M0,100 L0,70 Q20,80 40,50 T80,30 L100,20 L100,100 Z" strokeWidth="2" vectorEffect="non-scaling-stroke"></path>
</svg>
<div className="relative w-full flex justify-between text-on-surface-variant font-label-md text-xs z-10 border-t border-outline-variant pt-2 mt-auto">
<span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-[16px] p-6 organic-shadow">
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-6">Course Sales Distribution</h4>
<div className="flex items-end h-48 gap-4 mb-4 mt-8 px-4">

<div className="flex-1 flex flex-col items-center justify-end gap-2 group">
<div className="w-full bg-secondary-container rounded-t-md h-[80%] group-hover:opacity-80 transition-opacity relative">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">80%</span>
</div>
<span className="font-label-md text-[10px] md:text-xs text-center text-on-surface-variant rotate-[-45deg] md:rotate-0 mt-4 md:mt-0">Candle Making</span>
</div>
<div className="flex-1 flex flex-col items-center justify-end gap-2 group">
<div className="w-full bg-tertiary-container rounded-t-md h-[65%] group-hover:opacity-80 transition-opacity relative">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">65%</span>
</div>
<span className="font-label-md text-[10px] md:text-xs text-center text-on-surface-variant rotate-[-45deg] md:rotate-0 mt-4 md:mt-0">Lippan Art</span>
</div>
<div className="flex-1 flex flex-col items-center justify-end gap-2 group">
<div className="w-full bg-primary-container rounded-t-md h-[95%] group-hover:opacity-80 transition-opacity relative">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">95%</span>
</div>
<span className="font-label-md text-[10px] md:text-xs text-center text-on-surface-variant rotate-[-45deg] md:rotate-0 mt-4 md:mt-0">Resin Art</span>
</div>
<div className="flex-1 flex flex-col items-center justify-end gap-2 group">
<div className="w-full bg-surface-variant rounded-t-md h-[40%] group-hover:opacity-80 transition-opacity relative">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">40%</span>
</div>
<span className="font-label-md text-[10px] md:text-xs text-center text-on-surface-variant rotate-[-45deg] md:rotate-0 mt-4 md:mt-0">Crochet</span>
</div>
<div className="flex-1 flex flex-col items-center justify-end gap-2 group">
<div className="w-full bg-surface-variant rounded-t-md h-[55%] group-hover:opacity-80 transition-opacity relative">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 font-label-md text-xs opacity-0 group-hover:opacity-100 transition-opacity">55%</span>
</div>
<span className="font-label-md text-[10px] md:text-xs text-center text-on-surface-variant rotate-[-45deg] md:rotate-0 mt-4 md:mt-0">Mosaic Art</span>
</div>
</div>
</div>
</div>

<div className="bento-col-12 md:col-span-4 space-y-gutter">

<div className="bg-surface-container-lowest rounded-[16px] p-6 organic-shadow h-[400px] flex flex-col">
<div className="flex justify-between items-center mb-6">
<h4 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h4>
<button className="text-primary font-label-md text-sm hover:underline">View All</button>
</div>
<div className="flex-grow overflow-y-auto pr-2 space-y-6">

<div className="flex gap-4 relative">
<div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-outline-variant/30"></div>
<div className="w-8 h-8 rounded-full bg-secondary-fixed/50 flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest">
<span className="material-symbols-outlined text-[16px] text-secondary" data-icon="person_add">person_add</span>
</div>
<div>
<p className="font-body-md text-body-md text-on-surface text-sm"><span className="font-bold">Emma Watson</span> registered as a new student.</p>
<span className="font-label-md text-xs text-on-surface-variant mt-1 block">10 mins ago</span>
</div>
</div>

<div className="flex gap-4 relative">
<div className="absolute left-4 top-10 bottom-[-24px] w-[1px] bg-outline-variant/30"></div>
<div className="w-8 h-8 rounded-full bg-primary-container/50 flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest">
<span className="material-symbols-outlined text-[16px] text-primary" data-icon="shopping_cart">shopping_cart</span>
</div>
<div>
<p className="font-body-md text-body-md text-on-surface text-sm"><span className="font-bold">David Chen</span> purchased <span className="italic text-secondary">Advanced Resin Art</span>.</p>
<span className="font-label-md text-xs text-on-surface-variant mt-1 block">45 mins ago</span>
</div>
</div>

<div className="flex gap-4 relative">
<div className="w-8 h-8 rounded-full bg-tertiary-container/50 flex items-center justify-center shrink-0 z-10 border-2 border-surface-container-lowest">
<span className="material-symbols-outlined text-[16px] text-tertiary" data-icon="brush">brush</span>
</div>
<div>
<p className="font-body-md text-body-md text-on-surface text-sm"><span className="font-bold">Sophia Miller</span> submitted artwork to Student Gallery.</p>
<span className="font-label-md text-xs text-on-surface-variant mt-1 block">2 hours ago</span>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-low border border-outline-variant/30 rounded-[16px] p-6">
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-6 flex items-center gap-2">
<span className="material-symbols-outlined" data-icon="event">event</span>
                        Live Classes Today
                    </h4>
<div className="space-y-4">
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-primary">
<div className="flex justify-between items-start mb-2">
<h5 className="font-label-md text-label-md text-on-surface">Intro to Candle Making</h5>
<span className="bg-primary/10 text-primary font-label-md text-[10px] px-2 py-1 rounded">10:00 AM</span>
</div>
<p className="font-body-md text-xs text-on-surface-variant mb-3">Trainer: Sarah Jenkins</p>
<button className="w-full bg-surface-variant text-on-surface-variant font-label-md text-sm py-2 rounded flex justify-center items-center gap-2 hover:bg-surface-variant/80 transition-colors">
<span className="material-symbols-outlined text-[16px]" data-icon="videocam">videocam</span>
                                Join Zoom
                            </button>
</div>
<div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border-l-4 border-secondary">
<div className="flex justify-between items-start mb-2">
<h5 className="font-label-md text-label-md text-on-surface">Mastering Lippan Art</h5>
<span className="bg-secondary/10 text-secondary font-label-md text-[10px] px-2 py-1 rounded">2:30 PM</span>
</div>
<p className="font-body-md text-xs text-on-surface-variant mb-3">Trainer: Priya Patel</p>
<button className="w-full bg-secondary text-on-secondary font-label-md text-sm py-2 rounded flex justify-center items-center gap-2 hover:bg-secondary/90 transition-colors">
<span className="material-symbols-outlined text-[16px]" data-icon="videocam">videocam</span>
                                Join Zoom
                            </button>
</div>
</div>
</div>
</div>
</section>
</main>
    );
}
