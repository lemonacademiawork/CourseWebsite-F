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

const ENROLLED_COURSES: EnrolledCourse[] = [
    {
        id: 1,
        title: "Advanced Layouts & Grid Systems",
        category: "Typography",
        instructor: "Sarah Jenkins",
        progress: 65,
        imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600&h=300",
        lessonsCompleted: 13,
        totalLessons: 20,
        slug: "layouts-grid-systems"
    },
    {
        id: 2,
        title: "Digital Painting Fundamentals",
        category: "Illustration",
        instructor: "Emma Lin",
        progress: 20,
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600&h=300",
        lessonsCompleted: 4,
        totalLessons: 20,
        slug: "digital-painting-fundamentals"
    }
];

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
                                        href={`/student/dashboard`}
                                        className="flex-1 text-center bg-primary text-on-primary font-semibold text-xs py-2 rounded-lg hover:opacity-95 transition-opacity"
                                    >
                                        Resume Course
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </main>
    );
}
