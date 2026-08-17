'use client';
import Link from 'next/link';

interface EnrolledCourse {
    id: number;
    title: string;
    category: string;
    instructor: string;
    progress: number;
    imageUrl: string;
    lessonsCompleted: number;
    totalLessons: number;
    slug: string;
}

const ENROLLED_COURSES: EnrolledCourse[] = [];

export default function StudentEnrolledCourses() {
    return (
        <main className="flex-grow w-full bg-surface min-h-screen pb-6">
            <div className="max-w-container-max mx-auto px-4 md:px-6 py-6 space-y-6">
                
                <header className="pb-4 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">My Enrolled Courses</h2>
                        <p className="text-xs text-on-surface-variant mt-1">Access your enrolled masterclasses, tutorials, and continue your creative learning journey.</p>
                    </div>
                    <Link href="/courses" className="bg-primary text-on-primary font-semibold text-xs py-2 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm self-start sm:self-auto">
                        Browse More Courses
                    </Link>
                </header>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ENROLLED_COURSES.map((course) => (
                        <div key={course.id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col h-full">
                            {/* ... */}
                        </div>
                    ))}
                    {ENROLLED_COURSES.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-on-surface-variant text-xs">
                            You are not enrolled in any courses yet. Browse classes to start learning!
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
