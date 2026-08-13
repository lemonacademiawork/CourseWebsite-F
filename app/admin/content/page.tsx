export default function AdminCreativeContentManagement() {
    return (
        <main className="flex-1 ml-0 p-margin-mobile md:p-margin-desktop min-h-screen">

<header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h1 className="font-headline-md text-headline-md text-on-surface mb-2">Creatives &amp; Marketing</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Manage banners, campaigns, and announcements.</p>
</div>
<button className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-organic flex items-center gap-2 w-fit">
<span className="material-symbols-outlined icon-fill">upload</span>
                Upload Creative
            </button>
</header>

<section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-organic border border-outline-variant/20 hover-lift flex flex-col justify-between">
<div className="flex items-center justify-between mb-4">
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Campaigns</h3>
<span className="material-symbols-outlined text-tertiary">celebration</span>
</div>
<div className="flex items-end gap-3">
<span className="font-headline-md text-headline-md text-on-surface">12</span>
<span className="font-body-md text-body-md text-tertiary bg-tertiary-container/30 px-2 py-1 rounded-md mb-1">+2 this week</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-organic border border-outline-variant/20 hover-lift flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/20 rounded-full blur-2xl"></div>
<div className="flex items-center justify-between mb-4 relative z-10">
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Live Banners</h3>
<span className="material-symbols-outlined text-primary">web_asset</span>
</div>
<div className="flex items-end gap-3 relative z-10">
<span className="font-headline-md text-headline-md text-on-surface">45</span>
<span className="font-body-md text-body-md text-primary bg-primary-container/30 px-2 py-1 rounded-md mb-1">Optimal</span>
</div>
</div>
<div className="bg-surface-container-lowest p-6 rounded-xl shadow-organic border border-outline-variant/20 hover-lift flex flex-col justify-between">
<div className="flex items-center justify-between mb-4">
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Scheduled</h3>
<span className="material-symbols-outlined text-secondary">schedule</span>
</div>
<div className="flex items-end gap-3">
<span className="font-headline-md text-headline-md text-on-surface">8</span>
<span className="font-body-md text-body-md text-secondary bg-secondary-container/30 px-2 py-1 rounded-md mb-1">Upcoming</span>
</div>
</div>
</section>

<section className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-outline-variant/30 pb-4">

<div className="flex overflow-x-auto w-full lg:w-auto gap-8 pb-2 hide-scrollbar">
<button className="font-label-md text-label-md text-primary border-b-2 border-primary pb-2 whitespace-nowrap">All Creatives</button>
<button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Homepage Banners</button>
<button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Festival Campaigns</button>
<button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors pb-2 whitespace-nowrap">Announcements</button>
</div>

<div className="flex w-full lg:w-auto gap-4">
<div className="relative flex-1 lg:w-64">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all shadow-sm" placeholder="Search creatives..." type="text" />
</div>
<button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low text-on-surface-variant hover:bg-surface-variant transition-colors shadow-sm border border-outline-variant/20">
<span className="material-symbols-outlined">filter_list</span>
</button>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">

<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic border border-outline-variant/20 hover-lift group flex flex-col h-full">
<div className="relative h-48 w-full bg-surface-container-high overflow-hidden">
<div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A vibrant, high-quality digital illustration for a modern EdTech festival campaign. The scene features abstract, glowing geometric shapes and celebratory spark-like elements against a soft, creamy background. The style is modern craft studio minimalism with subtle off-white and warm orange (citrus) accents. The lighting is bright and optimistic, suitable for a light-mode UI." style={{backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuBsmY25vHyk8ZVg3m1jZL1-fOQ88Ye5hso7RflU0zXGPDnY1iZGyo64wRXrlBqTEoFJPKJlVxz9Ivl-O-JJqBXY3mJMWS_poOUNXZ1Z-re-fvDEcJH9krZjV_rXfX7DzYvwL2BsJmziS9VJd4ZlemXwcqDTiXYv-B6QFjpdY0PRhmECzBQV4TqrL1RRPRc4EYIVv9HxMtkJZxVP9xOgzcExuYAPuTlRY59elNjOTVORvRHEY_r5DozQ)`}}></div>
<div className="absolute top-3 left-3 flex gap-2">
<span className="bg-surface-container-lowest/90 backdrop-blur-sm text-primary font-label-md text-[12px] px-2 py-1 rounded border border-primary/20 flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[14px]">circle</span> Live
                        </span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-primary shadow-sm border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
<div className="p-5 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div>
<span className="text-tertiary font-label-md text-[12px] tracking-wider uppercase mb-1 block">Homepage Hero</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">Diwali 2026 Masterclass</h4>
</div>
</div>
<div className="mt-auto pt-4 flex items-center justify-between text-on-surface-variant font-body-md text-[14px] border-t border-outline-variant/20">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Oct 15 - Nov 5</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">devices</span> D/M</span>
</div>
</div>
</article>

<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic border border-outline-variant/20 hover-lift group flex flex-col h-full">
<div className="relative h-48 w-full bg-surface-container-high overflow-hidden">
<div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500" data-alt="A serene, minimalist digital banner design featuring a clean typography layout for an announcement. The background is a soft, warm off-white, with elegant terracotta and charcoal abstract brushstrokes framing the edges. The aesthetic is premium editorial, tactile modernism, lit softly to evoke a calm, inspiring light-mode environment." style={{backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuCmh-MTtUE7GJjR3Sid2X5AvCcg-rYsuh9dxEn8w-x89d2ZP9tAHVgChhhoeTIxLXf2b2bozb_VPofGRyMl29lWysIGdJNhCNHfrmT01NILTDWhnuCNH8tMcgn56oQLIfuTxrjZJ4C3NXT5TyYMwx84PAeESW6W1GXRtcO88NyEJqrsFiWvUYeb4xmykP73N5J4XMLgGRPpLUdEAgVrl93rHRZfoEnorNWp8l9Exgiv6zpX3rTtVgif)`}}></div>
<div className="absolute top-3 left-3 flex gap-2">
<span className="bg-secondary-container/90 backdrop-blur-sm text-on-secondary-container font-label-md text-[12px] px-2 py-1 rounded border border-secondary/20 flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[14px]">schedule</span> Scheduled
                        </span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-primary shadow-sm border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
<div className="p-5 flex-1 flex flex-col">
<div className="flex justify-between items-start mb-2">
<div>
<span className="text-tertiary font-label-md text-[12px] tracking-wider uppercase mb-1 block">Announcement</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">New UI/UX Curriculum Launch</h4>
</div>
</div>
<div className="mt-auto pt-4 flex items-center justify-between text-on-surface-variant font-body-md text-[14px] border-t border-outline-variant/20">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Starts Nov 10</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">devices</span> Desktop Only</span>
</div>
</div>
</article>

<article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-organic border border-outline-variant/20 hover-lift group flex flex-col h-full">
<div className="relative h-48 w-full bg-surface-container-high overflow-hidden">
<div className="bg-cover bg-center w-full h-full group-hover:scale-105 transition-transform duration-500 grayscale opacity-80" data-alt="A dynamic digital course banner displaying abstract representations of UI design elements, like wireframes and color swatches, floating in a clean, off-white space. Accents of warm lemon-yellow and sage green provide a modern, tactile studio feel. The lighting is bright and diffuse, creating a premium light-mode visual." style={{backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuB2IVucgsJnZCdusxSPvTVXLPU3Q3iwyEJX_bFlqEuoNLMWhzOYhg-lTsCIEM5kaX2SwL2_FfqdtNhbNYNfFhlCiZ40EM2nYwDV9_UqyvATGkFRf8cRZDkGc4IxrY0pwNsr6hhz_PX-ynWteyc5WstDqmR1VNml6evnfrzXGHmfmzJfHAtOWNVOBGugN2zaJImB8WTGnPvlOVQ2WdzTNls2w4n0nm-7feVDGFGm9JIafjm5BtyzpdFs)`}}></div>
<div className="absolute inset-0 bg-surface/10"></div>
<div className="absolute top-3 left-3 flex gap-2">
<span className="bg-surface-variant/90 backdrop-blur-sm text-on-surface-variant font-label-md text-[12px] px-2 py-1 rounded border border-outline-variant/30 flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[14px]">inventory_2</span> Archived
                        </span>
</div>
<button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center text-on-surface hover:text-primary shadow-sm border border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-opacity">
<span className="material-symbols-outlined text-[18px]">more_vert</span>
</button>
</div>
<div className="p-5 flex-1 flex flex-col opacity-75">
<div className="flex justify-between items-start mb-2">
<div>
<span className="text-tertiary font-label-md text-[12px] tracking-wider uppercase mb-1 block">Promo Banner</span>
<h4 className="font-headline-sm text-headline-sm text-on-surface line-clamp-1">Summer Creative Workshop</h4>
</div>
</div>
<div className="mt-auto pt-4 flex items-center justify-between text-on-surface-variant font-body-md text-[14px] border-t border-outline-variant/20">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_today</span> Jun 1 - Jun 30</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">devices</span> Mobile Only</span>
</div>
</div>
</article>
</section>
</main>
    );
}
