"use client";
export default function TrainerApplicationPortfolioUpload() {
    return (
        <main className="w-full max-w-[800px] mx-auto">

<header className="text-center mb-12">
<h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-2">Trainer Application</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">Step 4 of 6: Your Portfolio</p>
</header>

<div className="mb-12">
<div className="flex items-center justify-between relative">

<div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-2 bg-[#E9D8C4] rounded-full z-0"></div>

<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[60%] h-2 bg-primary rounded-full z-0 transition-all duration-500"></div>

<div className="z-10 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-on-primary font-label-md text-label-md shadow-sm">
<span className="material-symbols-outlined" style={{fontSize: '16px'}}>check</span>
</div>
<div className="z-10 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-on-primary font-label-md text-label-md shadow-sm">
<span className="material-symbols-outlined" style={{fontSize: '16px'}}>check</span>
</div>
<div className="z-10 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-on-primary font-label-md text-label-md shadow-sm">
<span className="material-symbols-outlined" style={{fontSize: '16px'}}>check</span>
</div>

<div className="z-10 bg-surface-container-lowest border-2 border-primary w-10 h-10 rounded-full flex items-center justify-center text-primary font-label-md text-label-md shadow-md ring-4 ring-primary-container/20">
                    4
                </div>
<div className="z-10 bg-surface-container-highest w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant font-label-md text-label-md">
                    5
                </div>
<div className="z-10 bg-surface-container-highest w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant font-label-md text-label-md">
                    6
                </div>
</div>
<div className="flex justify-between mt-3 text-xs text-on-surface-variant font-label-md text-label-md opacity-70 px-1">
<span>Basics</span>
<span>Experience</span>
<span>Teaching</span>
<span className="text-primary opacity-100 font-bold">Portfolio</span>
<span>Availability</span>
<span>Review</span>
</div>
</div>

<div className="bg-surface-container-lowest rounded-[24px] p-6 md:p-10 card-shadow border border-outline-variant/30">
<div className="mb-8">
<h2 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface mb-3">Showcase Your Craft</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                    Upload 2-3 high-quality examples of your creative work. This helps us understand your style, technical proficiency, and what you can bring to the Lemon Academy community.
                </p>
</div>
<form action="#" className="space-y-8" method="POST">

<div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="md:col-span-7 flex flex-col gap-4">
<div className="relative w-full aspect-[4/3] rounded-[16px] overflow-hidden group">
<img alt="Uploaded artwork 1" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-alt="A beautifully crafted wooden chair in a bright, modern studio. The chair features clean, minimalist lines and a warm, honey-toned finish. It is placed on a light concrete floor against a creamy off-white wall. Sunlight streams in from a large window out of frame, casting soft, inviting shadows. The aesthetic is tactile modernism, emphasizing craftsmanship and premium materials." src="https://lh3.googleusercontent.com/aida-public/AB6AXuARCvCyRe-d2IvEjipFs014XEyJg4UQg1_215efBY0EFOBuSYOMq-9fc20MaF1fzJTe7G_HUP6NuY1YTnClUmr1w3a3HpWi8fbnSdRULMZZGl0cx3WDfhAb8Y-sjzSUPGmmZDVeJlUy6RKhieLOUnitBehoewteOrQJxlmelI-4z53duOwZYOET1BlQ5MBxSthrYbNMf4UmqGug5XzLYxAA-roJzZWlO5clX9lzWWaHNa0-wzqd7OQl" />

<div className="absolute inset-0 bg-on-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
<button className="bg-surface-container-lowest text-on-surface rounded-full p-2 shadow-md hover:text-primary transition-colors" type="button">
<span className="material-symbols-outlined">edit</span>
</button>
<button className="bg-error text-on-error rounded-full p-2 shadow-md hover:bg-error-container hover:text-on-error-container transition-colors" type="button">
<span className="material-symbols-outlined">delete</span>
</button>
</div>
</div>
<div className="space-y-2">
<label className="block font-label-md text-label-md text-on-surface" htmlFor="desc-1">Title &amp; Description (Optional)</label>
<input className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-on-surface-variant/50" id="desc-1" name="desc-1" type="text" value="Minimalist Lounge Chair - Ash Wood" />
</div>
</div>

<div className="md:col-span-5 flex flex-col gap-4">
<label className="cursor-pointer h-full min-h-[200px] md:min-h-[auto]" htmlFor="file-upload-2">
<div className="upload-dashed w-full h-full aspect-[4/4] flex flex-col items-center justify-center p-6 text-center text-on-surface-variant">
<div className="w-12 h-12 bg-primary-container/30 rounded-full flex items-center justify-center mb-3 text-primary">
<span className="material-symbols-outlined" style={{fontSize: '24px'}}>add_photo_alternate</span>
</div>
<span className="font-label-md text-label-md mb-1 text-on-surface">Upload Artwork #2</span>
<span className="text-sm opacity-70">JPEG, PNG, or WebP up to 5MB</span>
</div>
<input className="sr-only" id="file-upload-2" name="file-upload-2" type="file" />
</label>
<div className="space-y-2 mt-auto">
<label className="block font-label-md text-label-md text-on-surface opacity-50" htmlFor="desc-2">Title &amp; Description</label>
<input className="w-full bg-surface-container-low/50 border border-outline-variant/30 rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface/50 cursor-not-allowed" disabled id="desc-2" name="desc-2" placeholder="Add description..." type="text" />
</div>
</div>

<div className="md:col-span-12 flex flex-col gap-4">
<label className="cursor-pointer" htmlFor="file-upload-3">
<div className="upload-dashed w-full h-32 flex flex-row items-center justify-center p-6 text-center text-on-surface-variant gap-4">
<div className="w-10 h-10 bg-primary-container/30 rounded-full flex items-center justify-center text-primary">
<span className="material-symbols-outlined" style={{fontSize: '20px'}}>add</span>
</div>
<div className="flex flex-col items-start">
<span className="font-label-md text-label-md text-on-surface">Upload Artwork #3 (Optional)</span>
<span className="text-sm opacity-70">Add one more piece to complete your showcase.</span>
</div>
</div>
<input className="sr-only" id="file-upload-3" name="file-upload-3" type="file" />
</label>
</div>
</div>
<hr className="border-t border-[#E9D8C4] opacity-50 my-8" />

<div className="flex items-center justify-between pt-4">
<button className="px-6 py-3 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2" type="button">
<span className="material-symbols-outlined" style={{fontSize: '18px'}}>arrow_back</span>
                        Back
                    </button>
<div className="flex gap-4">
<button className="px-6 py-3 rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors" type="button">
                            Save Draft
                        </button>
<button className="px-8 py-3 rounded-lg bg-primary text-on-primary-fixed font-label-md text-label-md shadow-sm hover:opacity-90 hover:shadow-md transition-all flex items-center gap-2" type="button">
                            Next Step
                            <span className="material-symbols-outlined" style={{fontSize: '18px'}}>arrow_forward</span>
</button>
</div>
</div>
</form>
</div>
</main>
    );
}
