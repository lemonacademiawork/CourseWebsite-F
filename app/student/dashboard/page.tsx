export default function StudentDashboardWelcome() {
    return (
        <main className="flex-1 h-screen overflow-y-auto bg-surface relative">

<div className="md:hidden flex items-center justify-between p-4 bg-surface shadow-sm z-40 sticky top-0">
<h1 className="font-display-lg text-headline-sm text-primary">Creative Studio</h1>
<button className="p-2"><span className="material-symbols-outlined">menu</span></button>
</div>
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 space-y-12">

<header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-outline-variant/30">
<div>
<h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-2">Welcome back, Priya</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Your creative journey continues. You have 2 assignments pending and a live class starting soon.</p>
</div>
<div className="flex items-center gap-4 bg-surface-container-lowest p-3 rounded-xl ambient-shadow">
<img className="w-12 h-12 rounded-full object-cover border-2 border-surface-container" data-alt="A small, circular profile portrait of a young Indian woman smiling warmly, set against a soft, bright studio background. The lighting is warm and inviting, fitting a modern creative academy aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0MR89xeuIC7t3EA5GbYFyVNN-txCeUVZp3bGgrpzto3S7ggrdnGVpv65qDZgXLJ2xBxngunkxJhKpz2kKk26xLh0PLzsIVL9CB4D1WPXoXmTG09e9hrHZXLQn6Ez1V4sgbCmiguzaWbuwKeIGcEOd_2UE6YwKBLr0g-esIt2h4kpFSeu0w7KEUcc6XGVXdSBBzVpEgHrk8Dixc07uJxFL5nfNBl7XM6B4JggFa4W91KhJTxadvoLs" />
<div>
<p className="font-label-md text-label-md text-on-surface">Priya Sharma</p>
<p className="font-body-md text-[13px] text-on-surface-variant">Graphic Design Track</p>
</div>
</div>
</header>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

<div className="lg:col-span-2 space-y-12">

<section>
<div className="flex justify-between items-end mb-6">
<h3 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface">Current Courses</h3>
<a className="font-label-md text-label-md text-primary hover:underline" href="#">View all</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="bg-surface-container-lowest rounded-xl p-6 ambient-shadow hover-lift flex flex-col h-full">
<div className="flex justify-between items-start mb-4">
<span className="px-3 py-1 bg-tertiary-container/30 text-tertiary font-label-md text-[12px] rounded-full">Typography</span>
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<h4 className="font-headline-sm text-[20px] leading-tight mb-2">Advanced Layouts &amp; Grid Systems</h4>
<p className="font-body-md text-[14px] text-on-surface-variant mb-6 flex-grow">Mastering editorial design and structured asymmetry.</p>
<div className="mt-auto">
<div className="flex justify-between font-label-md text-[12px] text-on-surface-variant mb-2">
<span>Progress</span>
<span>65%</span>
</div>
<div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{width: '65%'}}></div>
</div>
<button className="mt-6 w-full bg-surface-container py-2 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-dim transition-colors">Continue Learning</button>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 ambient-shadow hover-lift flex flex-col h-full">
<div className="flex justify-between items-start mb-4">
<span className="px-3 py-1 bg-secondary-container/30 text-secondary font-label-md text-[12px] rounded-full">Illustration</span>
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<h4 className="font-headline-sm text-[20px] leading-tight mb-2">Digital Painting Fundamentals</h4>
<p className="font-body-md text-[14px] text-on-surface-variant mb-6 flex-grow">Brush mechanics and color theory for digital artists.</p>
<div className="mt-auto">
<div className="flex justify-between font-label-md text-[12px] text-on-surface-variant mb-2">
<span>Progress</span>
<span>20%</span>
</div>
<div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full" style={{width: '20%'}}></div>
</div>
<button className="mt-6 w-full bg-surface-container py-2 rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-dim transition-colors">Continue Learning</button>
</div>
</div>
</div>
</section>

<section>
<h3 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface mb-6">Gallery Highlights</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
<div className="aspect-square bg-surface-variant rounded-lg overflow-hidden group cursor-pointer">
<div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined">image</span>
</div>
</div>
<div className="aspect-square bg-surface-variant rounded-lg overflow-hidden group cursor-pointer">
<div className="w-full h-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined">palette</span>
</div>
</div>
<div className="col-span-2 bg-surface-container-lowest rounded-lg p-4 flex flex-col justify-center ambient-shadow">
<p className="font-label-md text-label-md text-on-surface mb-1">Upload your latest project</p>
<p className="font-body-md text-[12px] text-on-surface-variant mb-3">Get feedback from peers and mentors.</p>
<button className="text-left font-label-md text-primary hover:underline flex items-center gap-1">Upload now <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
</div>
</div>
</section>
</div>

<div className="space-y-6">

<div className="bg-secondary text-on-secondary rounded-2xl p-6 ambient-shadow relative overflow-hidden">

<div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
<div className="relative z-10">
<div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
<span className="material-symbols-outlined text-[16px]">videocam</span>
<span className="font-label-md text-[12px] uppercase tracking-wider">Live in 45 mins</span>
</div>
<h4 className="font-headline-sm text-[22px] mb-2 leading-tight">Critique Session: Layout Studies</h4>
<p className="font-body-md text-[14px] text-on-secondary/80 mb-6">with Instructor Sarah Jenkins</p>
<button className="w-full bg-white text-secondary font-label-md text-label-md py-3 rounded-xl hover:bg-surface-container transition-colors">
                                Join Zoom Room
                            </button>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 ambient-shadow">
<h4 className="font-label-md text-label-md text-on-surface-variant mb-4 uppercase tracking-wider">This Week</h4>
<div className="space-y-4">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
<span className="material-symbols-outlined">schedule</span>
</div>
<div>
<p className="font-headline-sm text-[20px] text-on-surface">4h 30m</p>
<p className="font-body-md text-[12px] text-on-surface-variant">Time learned</p>
</div>
</div>
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
<span className="material-symbols-outlined">task_alt</span>
</div>
<div>
<p className="font-headline-sm text-[20px] text-on-surface">2</p>
<p className="font-body-md text-[12px] text-on-surface-variant">Modules completed</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
    );
}
