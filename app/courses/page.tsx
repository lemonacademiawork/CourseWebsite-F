'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ExploreCoursesLemonAcademy() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/v1/courses');
                if (res.ok) {
                    const json = await res.json();
                    // Handle standard array wrap in data wrapper: { success: true, data: [...] }
                    const courseList = json.data || json;
                    if (Array.isArray(courseList)) {
                        const mapped = courseList.map((c: any) => ({
                            id: c.id || c._id,
                            title: c.title || c.name || 'Untitled Course',
                            category: c.category?.name || c.category || 'General Craft',
                            categorySlug: c.category?.slug || '',
                            instructor: c.trainer?.name || c.trainer || 'Guest Instructor',
                            description: c.description || '',
                            imageUrl: c.thumbnailUrl || c.imageUrl || c.image || c.coverImage || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
                            price: c.discountedPrice || c.price || 0,
                            studentsCount: c.studentsCount || c.enrolledStudents || 45
                        }));
                        setCourses(mapped);
                        setLoading(false);
                        return;
                    }
                }
            } catch (err) {
                console.warn('Backend courses fetch failed.', err);
            }
            setCourses([]);
            setLoading(false);
        };
        fetchCourses();
    }, []);

    const handleCategoryToggle = (slug: string) => {
        setSelectedCategories(prev =>
            prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
        );
    };

    const filteredCourses = courses.filter((course) => {
        if (selectedCategories.length === 0) return true;
        return selectedCategories.includes(course.categorySlug) || 
               selectedCategories.some(cat => course.category.toLowerCase().includes(cat.toLowerCase()));
    });

    return (
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 text-xs">
            <div className="flex flex-col md:flex-row gap-8">
                
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-8 bg-surface-container-low p-6 rounded-xl border border-surface-variant">
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-4 font-bold">Categories</h3>
                            <div className="space-y-3">
                                {[
                                    { name: 'Lippan Art', slug: 'lippan-art' },
                                    { name: 'Mosaic Art', slug: 'mosaic-art' },
                                    { name: 'Crochet & Fiber Arts', slug: 'crochet-fiber-arts' },
                                    { name: 'Resin Art', slug: 'resin-art' },
                                    { name: 'Pottery', slug: 'pottery' }
                                ].map((cat) => (
                                    <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                                        <input 
                                            className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-4 h-4" 
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.slug)}
                                            onChange={() => handleCategoryToggle(cat.slug)}
                                        />
                                        <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">
                                            {cat.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <hr className="border-t border-outline-variant" />
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-4 font-bold">Level</h3>
                            <div className="space-y-3">
                                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                    <label key={level} className="flex items-center gap-3 cursor-pointer group">
                                        <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-4 h-4" type="checkbox" />
                                        <span className="font-body-md text-on-surface-variant group-hover:text-primary transition-colors">{level}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Courses Grid Content */}
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-body-md text-on-surface-variant">
                            Showing {filteredCourses.length} creative courses
                        </span>
                        <select className="bg-surface-container-low border border-outline-variant rounded-md py-1.5 pl-3 pr-8 font-body-md text-on-surface focus:ring-primary focus:border-primary">
                            <option>Sort by: Recommended</option>
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-8 shadow-sm">
                            {/* Premium Spinner with Pulse Glow */}
                            <div className="relative flex items-center justify-center">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <div className="absolute w-12 h-12 rounded-full border border-primary/10 animate-ping"></div>
                            </div>
                            <div className="text-center space-y-1 max-w-sm">
                                <p className="font-bold text-on-surface text-sm">Waking up the backend server...</p>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Our free-tier server takes about 30 seconds to wake up from sleep mode. Thank you for waiting!
                                </p>
                            </div>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="text-center py-16 text-on-surface-variant bg-surface-container-lowest border border-outline-variant/30 rounded-2xl">
                            No courses matching the selected filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map((course) => {
                                const initials = (course.instructor || 'Guest').split(' ').map((n: string) => n[0]).join('');
                                const courseUrl = `/courses/${course.id}`;
                                return (
                                    <div key={course.id} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col h-full border border-outline-variant/20">
                                        <div className="relative h-44 overflow-hidden bg-surface-variant">
                                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} src={course.imageUrl} />
                                            <div className="absolute top-3 left-3 bg-tertiary-fixed px-2.5 py-0.5 rounded-full text-on-tertiary-fixed text-[10px] font-semibold uppercase tracking-wider">
                                                {course.category}
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow justify-between gap-4">
                                            <div className="space-y-2">
                                                <h3 className="font-bold text-on-surface text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                                    <Link href={courseUrl}>{course.title}</Link>
                                                </h3>
                                                <p className="text-on-surface-variant line-clamp-2 text-[11px] leading-relaxed">
                                                    {course.description || "Master new artisanal skills from the foundation to intermediate levels."}
                                                </p>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[10px] font-bold">{initials}</div>
                                                    <span className="text-on-surface-variant font-medium text-[11px]">{course.instructor}</span>
                                                </div>
                                                <div className="flex justify-between items-center border-t border-surface-variant/45 pt-3">
                                                    <div className="flex items-center text-primary-fixed-dim">
                                                        <span className="material-symbols-outlined filled text-xs">star</span>
                                                        <span className="material-symbols-outlined filled text-xs">star</span>
                                                        <span className="material-symbols-outlined filled text-xs">star</span>
                                                        <span className="material-symbols-outlined filled text-xs">star</span>
                                                        <span className="material-symbols-outlined text-xs">star_half</span>
                                                        <span className="text-on-surface font-semibold ml-1 text-[10px]">4.8</span>
                                                        <span className="text-on-surface-variant ml-1 text-[10px]">({course.studentsCount})</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold text-primary text-sm">Rs. {course.price}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
