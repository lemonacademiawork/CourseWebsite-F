'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EnrolledCourse {
    id: string;
    title: string;
    category: string;
    instructor: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    imageUrl: string;
}

export default function MyCoursesPage() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);

    useEffect(() => {
        const purchased = localStorage.getItem('purchased_courses');
        if (purchased) {
            try {
                setCourses(JSON.parse(purchased));
            } catch {
                setCourses([]);
            }
        }
    }, []);

    return (
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 text-xs min-h-screen">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">My Courses</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Access your purchased workshops, tutorials, and certificates.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map((course) => (
                        <div key={course.id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/35 shadow-sm flex flex-col h-full">
                            <div className="relative h-40 w-full bg-surface-container">
                                <img 
                                    alt={course.title} 
                                    className="w-full h-full object-cover" 
                                    src={course.imageUrl} 
                                />
                                <div className="absolute top-3 left-3 bg-primary/20 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full text-[10px] text-white font-bold uppercase tracking-wider">
                                    {course.category}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-grow">
                                <h3 className="text-sm font-bold text-on-surface leading-snug">{course.title}</h3>
                                <p className="text-[10px] text-on-surface-variant mt-1">Instructor: {course.instructor}</p>
                                
                                <div className="mt-6 space-y-1.5">
                                    <div className="flex justify-between text-[10px] text-on-surface-variant">
                                        <span>Progress: {course.lessonsCompleted}/{course.totalLessons} Lessons</span>
                                        <span className="font-bold">{course.progress}%</span>
                                    </div>
                                    <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-outline-variant/20 flex gap-2">
                                    <Link 
                                        href={`/my-courses/${course.id}`}
                                        className="flex-1 text-center bg-primary text-on-primary font-semibold text-xs py-2 rounded-lg hover:opacity-95 transition-opacity"
                                    >
                                        Resume Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl">
                            <p className="mb-4">You are not enrolled in any courses yet.</p>
                            <Link href="/courses" className="bg-primary text-on-primary px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-opacity">
                                Explore Courses
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
