"use client";
export default function TrainerCourseContentEditor() {
    return (
        <main className="flex-1 p-margin-mobile md:p-margin-desktop min-h-screen">

<header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
<div>
<div className="flex items-center gap-2 text-on-surface-variant mb-2">
<a className="hover:text-primary transition-colors flex items-center gap-1" href="#">
<span className="material-symbols-outlined text-sm">arrow_back</span> Back to Courses
                    </a>
</div>
<h2 className="font-headline-md text-headline-md md:font-display-lg md:text-display-lg text-on-surface">The Art of Lippan</h2>
<p className="text-on-surface-variant mt-2 font-body-lg text-body-lg">Course Content Management</p>
</div>
<div className="flex gap-4">
<button className="border border-outline text-on-surface py-2 px-6 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors flex items-center gap-2">
<span className="material-symbols-outlined">visibility</span> Preview
                </button>
<button className="bg-primary text-on-primary py-2 px-6 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined">publish</span> Publish Changes
                </button>
</div>
</header>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">

<div className="lg:col-span-2 flex flex-col gap-6">

<div className="flex flex-wrap gap-4 mb-2">
<button className="bg-surface-container-lowest text-on-surface border border-outline-variant py-2 px-4 rounded-full font-label-md text-label-md hover:border-primary hover:text-primary transition-colors flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-lg">add_circle</span> Add Module
                    </button>
<button className="bg-surface-container-lowest text-on-surface border border-outline-variant py-2 px-4 rounded-full font-label-md text-label-md hover:border-primary hover:text-primary transition-colors flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-lg">reorder</span> Reorder All
                    </button>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(45,45,45,0.05)] border border-surface-container-highest transition-transform hover:-translate-y-1 duration-300">
<div className="flex justify-between items-start mb-6 pb-4 border-b border-surface-container-high">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-outline drag-handle">drag_indicator</span>
<div>
<span className="text-tertiary font-label-md text-label-md bg-tertiary-fixed px-2 py-1 rounded-sm mb-1 inline-block">Module 1</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Introduction to Mud Work</h3>
</div>
</div>
<div className="flex gap-2">
<button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-variant/50 transition-colors"><span className="material-symbols-outlined">edit</span></button>
<button className="text-error hover:bg-error-container/50 p-2 rounded-full transition-colors"><span className="material-symbols-outlined">delete</span></button>
</div>
</div>

<div className="pl-10 flex flex-col gap-3">

<div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-surface-variant group">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-outline-variant drag-handle opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
<div className="bg-primary-container text-on-primary-container p-2 rounded-md">
<span className="material-symbols-outlined fill-icon text-sm">play_circle</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">1.1 History and Origins</p>
<p className="text-sm text-on-surface-variant">Video • 12:45</p>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
</div>

<div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-surface-variant group">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-outline-variant drag-handle opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
<div className="bg-secondary-fixed text-on-secondary-fixed p-2 rounded-md">
<span className="material-symbols-outlined fill-icon text-sm">description</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">1.2 Material Gathering Guide</p>
<p className="text-sm text-on-surface-variant">PDF Document • 2.4 MB</p>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
</div>

<button className="mt-2 border border-dashed border-outline-variant text-on-surface-variant py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface hover:text-primary hover:border-primary transition-colors">
<span className="material-symbols-outlined">add</span> Add Lesson to Module 1
                        </button>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0_4px_20px_rgba(45,45,45,0.05)] border border-surface-container-highest transition-transform hover:-translate-y-1 duration-300">
<div className="flex justify-between items-start mb-6 pb-4 border-b border-surface-container-high">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-outline drag-handle">drag_indicator</span>
<div>
<span className="text-tertiary font-label-md text-label-md bg-tertiary-fixed px-2 py-1 rounded-sm mb-1 inline-block">Module 2</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Preparing the Clay Dough</h3>
</div>
</div>
<div className="flex gap-2">
<button className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-variant/50 transition-colors"><span className="material-symbols-outlined">edit</span></button>
<button className="text-error hover:bg-error-container/50 p-2 rounded-full transition-colors"><span className="material-symbols-outlined">delete</span></button>
</div>
</div>

<div className="pl-10 flex flex-col gap-3">
<div className="flex items-center justify-between bg-surface p-4 rounded-lg border border-surface-variant group">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-outline-variant drag-handle opacity-0 group-hover:opacity-100 transition-opacity">drag_indicator</span>
<div className="bg-primary-container text-on-primary-container p-2 rounded-md">
<span className="material-symbols-outlined fill-icon text-sm">play_circle</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">2.1 The Perfect Mix Ratio</p>
<p className="text-sm text-on-surface-variant">Video • 18:20</p>
</div>
</div>
<button className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
</div>
<button className="mt-2 border border-dashed border-outline-variant text-on-surface-variant py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface hover:text-primary hover:border-primary transition-colors">
<span className="material-symbols-outlined">add</span> Add Lesson to Module 2
                        </button>
</div>
</div>
</div>

<div className="lg:col-span-1">
<div className="sticky top-8 bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-6 shadow-sm border border-surface-variant">
<h3 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-2 text-on-surface">
<span className="material-symbols-outlined">edit_square</span> Add New Lesson
                    </h3>
<form className="flex flex-col gap-5">
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Lesson Title</label>
<input className="w-full bg-surface border-outline-variant rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary placeholder:text-outline-variant/60" placeholder="e.g. Mirror Placement Techniques" type="text" />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">Select Module</label>
<select defaultValue="Module 2: Preparing the Clay Dough" className="w-full bg-surface border-outline-variant rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary">
<option>Module 1: Introduction to Mud Work</option>
<option>Module 2: Preparing the Clay Dough</option>
<option>Module 3: Shaping and Patterns</option>
</select>
</div>
<div className="border-t border-surface-variant pt-5">
<label className="block font-label-md text-label-md text-on-surface-variant mb-3">Content Type</label>
<div className="grid grid-cols-2 gap-3 mb-4">
<label className="flex items-center justify-center gap-2 p-3 border border-primary bg-primary-container/10 rounded-lg cursor-pointer transition-colors">
<input defaultChecked className="hidden" name="content_type" type="radio" />
<span className="material-symbols-outlined text-primary">play_circle</span>
<span className="font-label-md text-label-md text-primary">Video</span>
</label>
<label className="flex items-center justify-center gap-2 p-3 border border-outline-variant hover:bg-surface rounded-lg cursor-pointer transition-colors">
<input className="hidden" name="content_type" type="radio" />
<span className="material-symbols-outlined text-on-surface-variant">description</span>
<span className="font-label-md text-label-md text-on-surface-variant">Resource</span>
</label>
</div>

<div className="bg-surface p-4 rounded-lg border border-surface-variant">
<label className="block font-label-md text-label-md text-on-surface-variant mb-2">YouTube Video URL</label>
<div className="flex gap-2">
<span className="bg-surface-variant p-3 rounded-lg text-on-surface-variant flex items-center justify-center">
<span className="material-symbols-outlined">link</span>
</span>
<input className="flex-1 bg-surface-container-lowest border-outline-variant rounded-lg p-3 text-on-surface focus:ring-primary focus:border-primary" placeholder="https://youtube.com/watch?v=..." type="url" />
</div>
</div>
</div>
<button className="mt-4 w-full bg-secondary text-on-secondary py-3 px-4 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors shadow-sm" type="button">
                            Save Lesson
                        </button>
</form>
</div>
</div>
</div>
</main>
    );
}
