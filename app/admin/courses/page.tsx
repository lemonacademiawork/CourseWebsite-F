export default function AdminCourseManagement() {
    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 md:py-12 max-w-[1440px] mx-auto min-h-screen">

<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
<div>
<h2 className="font-headline-md text-headline-md text-on-background mb-2">Courses</h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-lg">Manage your creative curriculum. Track enrollments, update syllabi, and publish new artisanal workshops.</p>
</div>
<button className="flex items-center gap-2 bg-primary text-primary-fixed hover:bg-surface-tint font-label-md text-label-md py-3 px-6 rounded-full transition-colors whitespace-nowrap shadow-[0_4px_20px_rgba(45,45,45,0.05)]">
<span className="material-symbols-outlined text-[20px]">add</span>
                Create Course
            </button>
</div>

<div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_30px_rgba(45,45,45,0.03)] border border-outline-variant/30 overflow-hidden">

<div className="grid grid-cols-12 gap-4 p-6 border-b border-outline-variant bg-surface-container-low/50">
<div className="col-span-12 md:col-span-4 font-label-md text-label-md text-on-surface">Course</div>
<div className="hidden md:block col-span-2 font-label-md text-label-md text-on-surface">Trainer</div>
<div className="hidden md:block col-span-1 font-label-md text-label-md text-on-surface text-right">Price</div>
<div className="hidden md:block col-span-1 font-label-md text-label-md text-on-surface text-right">Students</div>
<div className="hidden md:block col-span-2 font-label-md text-label-md text-on-surface text-center">Status</div>
<div className="hidden lg:block col-span-2 font-label-md text-label-md text-on-surface text-right">Created</div>
</div>

<div className="flex flex-col">

<div className="table-row-hover grid grid-cols-12 gap-4 p-6 items-center border-b border-outline-variant/50 last:border-0">
<div className="col-span-12 md:col-span-4 flex items-center gap-4">
<div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="A close-up, highly detailed photograph of intricate Lippan Art on a terracotta clay surface. Small mirrored pieces reflect a soft, warm natural light, creating a serene, tactile craft studio atmosphere. The background is slightly blurred, emphasizing the textured clay patterns in off-white and warm beige tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAJ5nZnQmJxKwzI6JqoBSDakgbfeQPFc19jKBR4sA0qrHkGPtfsLMqqw9cbq79SOf1bQnUrf4M21cdJ4kWVbg_jKzSF6XkRc5zFNS8lh4XwaB5xGB77Tz2-6C0eK2BEtnomrXImbjOJiD94BRnJx7MCrfZUvbtj46r3Rh01sKJOeEyxUj1YZnoTCtxXa-qtZCsLBrUP0hvMQ_D6vwQK7-zVd_7K9wpCMwMi2n3upqMqm3QWnEUlfhN" />
</div>
<div>
<h3 className="font-label-md text-label-md text-on-background">Lippan Art Fundamentals</h3>
<p className="font-body-md text-[13px] text-on-surface-variant mt-1">Traditional Mirror Work</p>
</div>
</div>
<div className="hidden md:flex col-span-2 items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-md text-[12px] text-on-surface">AI</div>
<span className="font-body-md text-[14px] text-on-surface">Aisha Iyer</span>
</div>
<div className="hidden md:block col-span-1 font-body-md text-[15px] text-on-surface text-right">$120</div>
<div className="hidden md:block col-span-1 font-body-md text-[15px] text-on-surface text-right">342</div>
<div className="hidden md:flex col-span-2 justify-center">
<span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-md text-[12px]">Published</span>
</div>
<div className="hidden lg:block col-span-2 font-body-md text-[14px] text-on-surface-variant text-right">Oct 12, 2023</div>
</div>

<div className="table-row-hover grid grid-cols-12 gap-4 p-6 items-center border-b border-outline-variant/50 last:border-0">
<div className="col-span-12 md:col-span-4 flex items-center gap-4">
<div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="An overhead view of a contemporary mosaic art piece in progress on a heavy wooden studio table. Small, irregular ceramic tiles in muted sage, deep charcoal, and soft sand colors are being arranged. Soft daylight washes over the scene, highlighting the organic texture and premium, minimalist aesthetic of the workspace." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzjDz0N50q7CIwfgh2u1czsFkhGUNlN81-qxYYwdGJL2iVxuIJJ-wa_WTX5zgxkarkH3UZSpZNmz1qbwv4heT5P3yWD8uWWsYax2oIxfAvxI2dncn8vvjYKRmruXJ6SCFrlOe7ZDJyiFImMG7uP9HEecCf0KdBVl7E8g5UUZ0gpw_LTHMTMakJmzWAC_ITSjmu2Oupv9iXIEozaT_4iDh_T7ahmMRRSv3dzBsCYyOzAK0V552z1xAw" />
</div>
<div>
<h3 className="font-label-md text-label-md text-on-background">Modern Mosaic Techniques</h3>
<p className="font-body-md text-[13px] text-on-surface-variant mt-1">Ceramic &amp; Glass</p>
</div>
</div>
<div className="hidden md:flex col-span-2 items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-md text-[12px] text-on-surface">DR</div>
<span className="font-body-md text-[14px] text-on-surface">David Ross</span>
</div>
<div className="hidden md:block col-span-1 font-body-md text-[15px] text-on-surface text-right">$185</div>
<div className="hidden md:block col-span-1 font-body-md text-[15px] text-on-surface text-right">128</div>
<div className="hidden md:flex col-span-2 justify-center">
<span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-md text-[12px]">Draft</span>
</div>
<div className="hidden lg:block col-span-2 font-body-md text-[14px] text-on-surface-variant text-right">Nov 04, 2023</div>
</div>

<div className="table-row-hover grid grid-cols-12 gap-4 p-6 items-center border-b border-outline-variant/50 last:border-0">
<div className="col-span-12 md:col-span-4 flex items-center gap-4">
<div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-outline-variant/20">
<img className="w-full h-full object-cover" data-alt="A beautifully styled still life of a hand-poured soy candle in a raw, unglazed ceramic jar, sitting on a linen cloth. The lighting is moody and warm, casting soft shadows. The overall atmosphere is calm, organic, and highly tactile, reflecting a sophisticated modern craft studio environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkwk2QeW6jxNlLpAxkAwVXWjRVSBwYZlcKp62TojyEfZMz0t3GhRRTJU9FXh-RhPEW3rTDeU9bRG2EJgyPyyPpCULfsgj66xSmXCZMuh8zTCixg_mss6o5pQhrUr4dE0zczFk9k8-Qy1ovvOeAwSysUsMwP49KriAjBeu9qDYx7G-lQwRYJ7eeuhpTxbLSlIu7Gks6-4-pDhmXdqsIERnjLL912b9u55yMkt7pf24y2nXWP-keu_jx" />
</div>
<div>
<h3 className="font-label-md text-label-md text-on-background">Hand-poured Candle Craft</h3>
<p className="font-body-md text-[13px] text-on-surface-variant mt-1">Botanical Scents</p>
</div>
</div>
<div className="hidden md:flex col-span-2 items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-label-md text-[12px] text-on-surface">EC</div>
<span className="font-body-md text-[14px] text-on-surface">Elena Cruz</span>
</div>
<div className="hidden md:block col-span-1 font-body-md text-[15px] text-on-surface text-right">$95</div>
<div className="hidden md:block col-span-1 font-body-md text-[15px] text-on-surface text-right">512</div>
<div className="hidden md:flex col-span-2 justify-center">
<span className="inline-flex items-center px-3 py-1 rounded-full bg-tertiary-fixed/40 text-on-tertiary-fixed-variant font-label-md text-[12px]">Published</span>
</div>
<div className="hidden lg:block col-span-2 font-body-md text-[14px] text-on-surface-variant text-right">Sep 22, 2023</div>
</div>
</div>

<div className="p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container-low/30">
<p className="font-body-md text-[13px] text-on-surface-variant px-2">Showing 1 to 3 of 12 courses</p>
<div className="flex gap-2">
<button className="p-2 text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-variant/50 disabled:opacity-50" disabled>
<span className="material-symbols-outlined text-[20px]">chevron_left</span>
</button>
<button className="p-2 text-outline hover:text-on-surface transition-colors rounded-lg hover:bg-surface-variant/50">
<span className="material-symbols-outlined text-[20px]">chevron_right</span>
</button>
</div>
</div>
</div>
</main>
    );
}
