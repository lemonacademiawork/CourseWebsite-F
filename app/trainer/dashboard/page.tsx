export default function TrainerDashboardOverview() {
    return (
        <main className="flex-1 w-full pt-24 md:pt-12 px-margin-mobile md:px-margin-desktop pb-24 max-w-container-max mx-auto">

<header className="mb-12">
<h2 className="font-display-lg text-display-lg text-on-background mb-4">Welcome back, Elena 👋</h2>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Here’s an overview of your courses and students. The studio is quiet, perfect for planning your next creative session.</p>
</header>

<section className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-20">

<div className="md:col-span-2 bg-primary-container rounded-xl p-8 flex flex-col justify-between ambient-shadow ambient-shadow-hover transition-all duration-300">
<div className="flex items-center justify-between mb-8">
<span className="font-label-md text-label-md text-on-primary-container opacity-80 uppercase tracking-widest">Total Students</span>
<span className="material-symbols-outlined text-on-primary-container text-[32px]">groups</span>
</div>
<div>
<span className="font-display-lg text-display-lg text-on-primary-container block">450</span>
<span className="font-body-md text-body-md text-on-primary-container opacity-90 mt-2 block">+12 this week. Your community is growing.</span>
</div>
</div>

<div className="md:col-span-1 bg-secondary rounded-xl p-8 flex flex-col justify-between ambient-shadow ambient-shadow-hover transition-all duration-300">
<div className="flex items-center justify-between mb-8">
<span className="font-label-md text-label-md text-on-secondary opacity-80 uppercase tracking-widest">Upcoming</span>
<span className="material-symbols-outlined text-on-secondary text-[32px]">event</span>
</div>
<div>
<span className="font-display-lg text-display-lg text-on-secondary block">2</span>
<span className="font-body-md text-body-md text-on-secondary opacity-90 mt-2 block">Live sessions scheduled.</span>
</div>
</div>

<div className="md:col-span-1 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between ambient-shadow ambient-shadow-hover transition-all duration-300">
<div className="flex items-center justify-between mb-8">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">My Courses</span>
<span className="material-symbols-outlined text-outline text-[32px]">menu_book</span>
</div>
<div>
<span className="font-display-lg text-display-lg text-on-background block">4</span>
<span className="font-body-md text-body-md text-on-surface-variant mt-2 block">Active curricula.</span>
</div>
</div>

<div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 flex items-center justify-between ambient-shadow ambient-shadow-hover transition-all duration-300 border border-surface-variant/50">
<div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest block mb-2">Completed Students</span>
<span className="font-headline-md text-headline-md text-on-background block">120</span>
</div>
<div className="w-16 h-16 rounded-full border-4 border-tertiary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary">check_circle</span>
</div>
</div>

<div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-8 flex items-center justify-between ambient-shadow ambient-shadow-hover transition-all duration-300 border border-surface-variant/50">
<div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest block mb-2">Published Blogs</span>
<span className="font-headline-md text-headline-md text-on-background block">8</span>
</div>
<div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center">
<span className="material-symbols-outlined text-outline">article</span>
</div>
</div>
</section>

<div className="w-full h-px bg-outline-variant/30 mb-20"></div>

<section>
<div className="flex items-center justify-between mb-8">
<h3 className="font-headline-md text-headline-md text-on-background">Course Management</h3>
<button className="font-label-md text-label-md text-primary hover:text-surface-tint transition-colors flex items-center gap-1">
                    View all <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">

<article className="bg-surface-container-lowest rounded-xl overflow-hidden ambient-shadow ambient-shadow-hover transition-all duration-300 flex flex-col group">
<div className="h-48 w-full relative overflow-hidden bg-surface-variant">
<img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A beautifully arranged modern craft workspace bathed in soft, natural morning light. High-end ceramics tools rest next to a minimalist wooden block, emphasizing a tactile modern aesthetic. Cream and off-white color palette with subtle terracotta accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDFz7z8j73mQu6Sxex5rJ6jJxC3xTKGm6jr-1kk3yKUeeIH9oI7Fc-kGkulqfts2uZFyEdm9ng4qgj6_IIqZHb53VOFMUo8l49USOfYINxsr8ddjjYOJwwpmQZuKimpLNNI4lL545qerwRG0_uftKIZbSwmg8lKic9rFZo-FgvIaL7m69kUf3PJp3C72CxJRRhXS16jBxBdXM5L9FJmc1cSUIqRj1FiX6nltDW3mHb0HiRZDHk4mau" />
<div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full">
<span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Ceramics</span>
</div>
</div>
<div className="p-6 flex flex-col flex-1">
<h4 className="font-headline-sm text-headline-sm text-on-background mb-2">Introduction to Handbuilding</h4>
<p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-1 line-clamp-2">Master the fundamental techniques of pinching, coiling, and slab building.</p>
<div className="mb-6">
<div className="flex justify-between items-center mb-2">
<span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Course Progress</span>
<span className="font-label-md text-label-md text-primary text-[12px]">75%</span>
</div>
<div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full w-[75%]"></div>
</div>
</div>
<button className="w-full py-3 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
                            Manage Course
                        </button>
</div>
</article>

<article className="bg-surface-container-lowest rounded-xl overflow-hidden ambient-shadow ambient-shadow-hover transition-all duration-300 flex flex-col group">
<div className="h-48 w-full relative overflow-hidden bg-surface-variant">
<img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A serene digital illustration setup on an oak desk, featuring a tablet displaying organic, sweeping brush strokes. The lighting is soft and diffuse, creating a calming, premium creative studio atmosphere with sage green and cream tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1x6zKUZqVEBjOsvRIc47k41T3IIfqWB_R45SxFlFz0VDJNY8zhbRwQcV2Y7QZFPWUiehv_SUMYomg3Gl9QQez1tSzDbBLMmdw85jl1TTOiYR1UPOESSJtfcc2vXnhcisnDcpFNBGsfy6EoetdRd_fN1_IgEpssgm-3mskNzrXtXtEteRIG7M5ChROeRAKo_PXEALwgLH2FQUhxNDktblPEUsUmlLjQmlIzCN8OcokBUtKZfq-4bj8" />
<div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full">
<span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Digital Art</span>
</div>
</div>
<div className="p-6 flex flex-col flex-1">
<h4 className="font-headline-sm text-headline-sm text-on-background mb-2">Expressive Digital Painting</h4>
<p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-1 line-clamp-2">Translate traditional painting techniques into powerful digital workflows.</p>
<div className="mb-6">
<div className="flex justify-between items-center mb-2">
<span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Course Progress</span>
<span className="font-label-md text-label-md text-primary text-[12px]">42%</span>
</div>
<div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full w-[42%]"></div>
</div>
</div>
<button className="w-full py-3 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
                            Manage Course
                        </button>
</div>
</article>

<article className="bg-surface-container-lowest rounded-xl overflow-hidden ambient-shadow ambient-shadow-hover transition-all duration-300 flex flex-col group">
<div className="h-48 w-full relative overflow-hidden bg-surface-variant">
<img alt="Course Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="Close up of a beautifully bound sketchbook lying open on a linen cloth, filled with detailed architectural sketches. The scene is illuminated by warm, directional light, evoking a sense of focused study and premium craft design in neutral sand tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIAqcA4MocbTpNTJr80aEHZHsItToDawwszN_xNxa2P8qP-3thuIS3EUtjtGqi5qElRWw7UXaC-EwmWbEhNZvYTQz19inLQ08j8aosJ_1Yev4jSOiZNh4oB-8Hgwjfd8t70384u8UFNNAG6XFCNIq-pyrbC9bmT3AbgGytfmprzwx4o-_2hLo-TTNHwUCAg9ljmsZ5vbmrs5_Qym27-gCyb5BBBYBPWCq607r55n9xnp0AxtI0s03V" />
<div className="absolute top-4 left-4 bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1 rounded-full">
<span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Drawing</span>
</div>
</div>
<div className="p-6 flex flex-col flex-1">
<h4 className="font-headline-sm text-headline-sm text-on-background mb-2">Architectural Sketching</h4>
<p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-1 line-clamp-2">Learn to capture structure, perspective, and light with confidence.</p>
<div className="mb-6">
<div className="flex justify-between items-center mb-2">
<span className="font-label-md text-label-md text-on-surface-variant text-[12px]">Course Progress</span>
<span className="font-label-md text-label-md text-primary text-[12px]">90%</span>
</div>
<div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full w-[90%]"></div>
</div>
</div>
<button className="w-full py-3 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
                            Manage Course
                        </button>
</div>
</article>
</div>
</section>
</main>
    );
}
