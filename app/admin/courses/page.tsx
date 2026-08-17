'use client';
import { useState } from 'react';

interface CourseItem {
    id: number;
    title: string;
    category: string;
    trainer: string;
    price: number;
    studentsCount: number;
    status: 'Published' | 'Draft';
    createdDate: string;
}

export default function AdminCourseManagement() {
    const [courses, setCourses] = useState<CourseItem[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form states
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [trainer, setTrainer] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newCourse: CourseItem = {
            id: Date.now(),
            title: title.trim(),
            category: category.trim() || 'General Craft',
            trainer: trainer.trim() || 'Guest Instructor',
            price: Number(price),
            studentsCount: 0,
            status,
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };

        setCourses([...courses, newCourse]);
        setTitle('');
        setCategory('');
        setTrainer('');
        setPrice(0);
        setIsCreating(false);
    };

    return (
        <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-on-background mb-1">Courses</h2>
                    <p className="text-xs text-on-surface-variant max-w-lg">Manage your creative curriculum. Track enrollments, update syllabi, and publish new artisanal workshops.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-1.5 bg-primary text-primary-fixed hover:bg-surface-tint font-semibold text-xs py-2 px-4 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    {isCreating ? 'Cancel' : 'Create Course'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm mb-6 max-w-xl">
                    <h3 className="text-sm font-bold text-on-surface mb-3">Add New Course</h3>
                    <form onSubmit={handleCreateCourse} className="space-y-3">
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Course Title</label>
                            <input 
                                type="text" 
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                placeholder="e.g. Advanced Pottery Wheel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Category</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                    placeholder="e.g. Pottery"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Trainer Name</label>
                                <input 
                                    type="text" 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                    placeholder="e.g. Elena Cruz"
                                    value={trainer}
                                    onChange={(e) => setTrainer(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Price (Rs.)</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                    min={0}
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-on-surface-variant mb-1">Status</label>
                                <select 
                                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value as any)}
                                >
                                    <option value="Draft">Draft</option>
                                    <option value="Published">Published</option>
                                </select>
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Save Course
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline-variant bg-surface-container-low/50">
                    <div className="col-span-12 md:col-span-4 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Course</div>
                    <div className="hidden md:block col-span-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Trainer</div>
                    <div className="hidden md:block col-span-1 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">Price</div>
                    <div className="hidden md:block col-span-1 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">Students</div>
                    <div className="hidden md:block col-span-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-center">Status</div>
                </div>

                <div className="flex flex-col divide-y divide-outline-variant/20">
                    {courses.map((course) => (
                        <div key={course.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-surface-container-low/30 transition-colors">
                            <div className="col-span-12 md:col-span-4 flex items-center gap-3">
                                <div>
                                    <h3 className="font-bold text-on-background">{course.title}</h3>
                                    <p className="text-[10px] text-on-surface-variant mt-0.5">{course.category}</p>
                                </div>
                            </div>
                            <div className="hidden md:flex col-span-3 items-center gap-2">
                                <span className="text-on-surface">{course.trainer}</span>
                            </div>
                            <div className="hidden md:block col-span-1 text-on-surface text-right font-semibold">Rs. {course.price}</div>
                            <div className="hidden md:block col-span-1 text-on-surface text-right">{course.studentsCount}</div>
                            <div className="hidden md:flex col-span-3 justify-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    course.status === 'Published' 
                                        ? 'bg-tertiary-fixed/40 text-on-tertiary-fixed-variant' 
                                        : 'bg-surface-variant text-on-surface-variant'
                                }`}>
                                    {course.status}
                                </span>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="py-8 text-center text-on-surface-variant">
                            No courses available. Click "Create Course" to add one.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
