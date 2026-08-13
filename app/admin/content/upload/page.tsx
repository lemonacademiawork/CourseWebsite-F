"use client";
export default function AdminUploadScheduleCreative() {
    return (
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-background">
<div className="p-margin-mobile md:p-margin-desktop w-full max-w-container-max mx-auto flex-1 pb-32">

<div className="mb-10">

<div className="flex justify-between items-end">
<h2 className="font-headline-md text-headline-md text-on-surface">Upload New Creative</h2>
</div>
</div>

<div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">

<div className="xl:col-span-7 flex flex-col gap-8">

<section className="bg-surface-container-lowest rounded-[16px] organic-shadow p-8">
<div className="flex items-center gap-3 mb-6 border-b border-surface-container-high pb-4">
<span className="material-symbols-outlined text-primary">edit_note</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Basic Information</h3>
</div>
<div className="space-y-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Creative Title</label>
<input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all font-body-md placeholder:text-outline" placeholder="e.g., Summer Mastery Campaign" type="text" />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Description (Internal)</label>
<textarea className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all font-body-md placeholder:text-outline resize-none" placeholder="Brief note about this creative's purpose..." rows={3}></textarea>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Category</label>
<div className="relative">
<select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all font-body-md appearance-none">
<option>Homepage Hero</option>
<option>Course Banner</option>
<option>Sidebar Promo</option>
</select>
<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">CTA Destination URL</label>
<input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all font-body-md placeholder:text-outline" placeholder="https://" type="url" />
</div>
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">CTA Button Text</label>
<input className="w-full md:w-1/2 bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 transition-all font-body-md placeholder:text-outline" placeholder="e.g., Enroll Now" type="text" />
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-[16px] organic-shadow p-8">
<div className="flex items-center gap-3 mb-6 border-b border-surface-container-high pb-4">
<span className="material-symbols-outlined text-primary">imagesmode</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Creative Assets</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="file-drop-zone border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-surface-container-low group">
<div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary-container">desktop_windows</span>
</div>
<p className="font-label-md text-label-md text-on-surface mb-1">Desktop Creative</p>
<p className="text-sm text-on-surface-variant mb-4">1920 x 1080px (Max 5MB)</p>
<span className="text-primary font-label-md text-label-md group-hover:underline">Browse Files</span>
</div>

<div className="file-drop-zone border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-surface-container-low group">
<div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4 group-hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-on-primary-container">smartphone</span>
</div>
<p className="font-label-md text-label-md text-on-surface mb-1">Mobile Creative</p>
<p className="text-sm text-on-surface-variant mb-4">1080 x 1920px (Max 3MB)</p>
<span className="text-primary font-label-md text-label-md group-hover:underline">Browse Files</span>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded-[16px] organic-shadow p-8">
<div className="flex items-center gap-3 mb-6 border-b border-surface-container-high pb-4">
<span className="material-symbols-outlined text-primary">calendar_clock</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Scheduling</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="space-y-4">
<h4 className="font-label-md text-label-md text-on-surface">Start Campaign</h4>
<div className="flex gap-4">
<div className="relative flex-1">
<input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 font-body-md" type="date" />
</div>
<div className="relative w-1/3">
<input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 font-body-md" type="time" />
</div>
</div>
</div>
<div className="space-y-4">
<h4 className="font-label-md text-label-md text-on-surface">End Campaign</h4>
<div className="flex gap-4">
<div className="relative flex-1">
<input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 font-body-md" type="date" />
</div>
<div className="relative w-1/3">
<input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary/50 font-body-md" type="time" />
</div>
</div>
</div>
</div>
</section>
</div>

<div className="xl:col-span-5 relative">
<div className="sticky top-8 bg-surface-container-lowest rounded-[16px] organic-shadow p-6 flex flex-col h-[800px]">

<div className="flex items-center justify-between mb-6">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant">visibility</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Live Preview</h3>
</div>
<div className="flex bg-surface-container-low rounded-full p-1 border border-outline-variant/30">
<button className="w-10 h-8 rounded-full flex items-center justify-center bg-surface-container-lowest shadow-sm text-primary transition-all" id="btn-desktop">
<span className="material-symbols-outlined text-sm">desktop_windows</span>
</button>
<button className="w-10 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-all" id="btn-tablet">
<span className="material-symbols-outlined text-sm">tablet_mac</span>
</button>
<button className="w-10 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-all" id="btn-mobile">
<span className="material-symbols-outlined text-sm">smartphone</span>
</button>
</div>
</div>

<div className="flex-1 bg-surface-container-high rounded-xl overflow-hidden relative flex items-center justify-center p-4">

<div className="w-full h-full bg-surface-container-lowest shadow-md transition-all duration-500 ease-in-out flex flex-col border border-outline-variant/20 overflow-hidden relative rounded-md" id="preview-viewport">

<div className="h-12 bg-surface border-b border-surface-container-highest flex items-center px-4 justify-between shrink-0">
<div className="w-24 h-4 bg-surface-container-highest rounded-full"></div>
<div className="flex gap-2">
<div className="w-12 h-2 bg-surface-container-highest rounded-full hidden sm:block"></div>
<div className="w-12 h-2 bg-surface-container-highest rounded-full hidden sm:block"></div>
</div>
</div>

<div className="w-full h-48 sm:h-64 relative bg-surface-container-high group flex items-center justify-center overflow-hidden shrink-0">

<div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-multiply" data-alt="A highly aesthetic, premium digital art banner featuring soft, generative abstract shapes in warm terracotta and bright lemon yellow hues against a creamy off-white background. The lighting is diffused and modern, creating a welcoming, high-end editorial atmosphere suitable for a creative learning academy. The composition is balanced and inspiring, designed to evoke creativity and focus." style={{backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuBKS6Kk7n1FZboZ10_UD-q6i0f0Gj7kPYjRpwwkA7V7jHeGUNJgoB-PXobr0Kj1UEpl96787O8-SCTCIGxKeuKRbGeoum-hNInfgGwGQ3VOzhmNmCgi_CqsZS1alwIoqw9YfuJWXJEEg4ISGm1HKrwsalQTHraJwBME-5KjwqGzSAPbsbgPhbRE31oJtr3SD9kNpg2Q0fJNNIG-WZBWjdzodKzDZ4lTw-aO6eNT2ssDfluKr2bEBcNU)`}}></div>
<div className="relative z-10 text-center p-4">
<h4 className="font-headline-sm text-headline-sm text-on-surface drop-shadow-sm">Summer Mastery</h4>
<button className="mt-4 px-6 py-2 bg-primary text-on-primary-container font-label-md text-label-md rounded-lg shadow-sm">Enroll Now</button>
</div>
</div>

<div className="p-6 flex-1 bg-surface">
<div className="w-3/4 h-6 bg-surface-container-highest rounded-md mb-4"></div>
<div className="w-full h-3 bg-surface-container-high rounded-sm mb-2"></div>
<div className="w-5/6 h-3 bg-surface-container-high rounded-sm mb-2"></div>
<div className="w-full h-3 bg-surface-container-high rounded-sm mb-6"></div>
<div className="grid grid-cols-2 gap-4">
<div className="aspect-video bg-surface-container-highest rounded-md"></div>
<div className="aspect-video bg-surface-container-highest rounded-md"></div>
</div>
</div>
</div>
</div>

<div className="mt-4 text-center">
<p className="text-sm text-on-surface-variant flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-xs">info</span>
                                Previewing <span className="font-semibold text-on-surface" id="preview-text">Desktop</span> Layout
                            </p>
</div>
</div>
</div>
</div>
</div>

<div className="fixed bottom-0 md:left-64 right-0 bg-surface/90 backdrop-blur-md border-t border-surface-container-highest p-4 px-margin-mobile md:px-margin-desktop z-40">
<div className="max-w-container-max mx-auto flex justify-between items-center">
<button className="text-on-surface-variant hover:text-error transition-colors font-label-md flex items-center gap-2">
<span className="material-symbols-outlined text-sm">delete</span>
                    Discard
                </button>
<div className="flex items-center gap-4">
<button className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                        Save Draft
                    </button>
<button className="px-6 py-2.5 rounded-lg bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-sm">schedule</span>
                        Schedule
                    </button>
<button className="px-8 py-2.5 rounded-lg bg-primary text-on-primary-container font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm">
                        Publish Creative
                    </button>
</div>
</div>
</div>
</main>
    );
}
