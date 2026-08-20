'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CourseDetail {
    id: string;
    title: string;
    category: string;
    instructor: string;
    progress: number;
    lessonsCompleted: number;
    totalLessons: number;
    imageUrl: string;
}

import { CourseSession, getSessionStatus, initializeMockSessions } from '../../../components/sessionUtils';

export default function CourseLearningPortal({ params }: { params: Promise<{ courseId: string }> }) {
    const resolvedParams = use(params);
    const courseId = resolvedParams.courseId;
    const router = useRouter();
    const [course, setCourse] = useState<CourseDetail | null>(null);
    const [activeTab, setActiveTab] = useState<'lessons' | 'zoom' | 'resources' | 'certificate'>('lessons');
    const [sessions, setSessions] = useState<CourseSession[]>([]);
    const [courseResources, setCourseResources] = useState<any[]>([]);
    const [resourcesLoading, setResourcesLoading] = useState(false);

    useEffect(() => {
        if (activeTab === 'resources') {
            setResourcesLoading(true);
            fetch(`https://lemonwebsite-backend.onrender.com/api/v1/courses/${courseId}/resources`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        const normalized = data.map((item: any) => ({
                            id: item._id || item.id,
                            title: item.title || item.name || 'Untitled Resource',
                            url: item.url || '#',
                            type: item.type || 'PDF',
                            size: item.size || '1.0 MB'
                        }));
                        setCourseResources(normalized);
                    } else {
                        setCourseResources([]);
                    }
                    setResourcesLoading(false);
                })
                .catch(() => {
                    setCourseResources([]);
                    setResourcesLoading(false);
                });
        }
    }, [activeTab, courseId]);

    useEffect(() => {
        const allSessions = initializeMockSessions();
        const courseSess = allSessions[courseId] || [];
        setSessions(courseSess);
    }, [courseId]);

    // Handle session updates from admin live changes
    useEffect(() => {
        const handleSessionRefetch = () => {
            const allSessions = JSON.parse(localStorage.getItem('course_sessions') || '{}');
            setSessions(allSessions[courseId] || []);
        };
        window.addEventListener('session_database_updated', handleSessionRefetch);
        return () => window.removeEventListener('session_database_updated', handleSessionRefetch);
    }, [courseId]);

    // Modules & Lessons Mock Data
    const modules = [
        {
            title: "Module 1: Introduction & Materials",
            lessons: [
                { id: 1, title: "1.1 Welcome to the Craft", duration: "10 mins", completed: true },
                { id: 2, title: "1.2 Sourcing Clay & Substrates", duration: "15 mins", completed: true },
                { id: 3, title: "1.3 Mirror Shapes and Selection", duration: "12 mins", completed: true },
            ]
        },
        {
            title: "Module 2: Layouts and Border Grids",
            lessons: [
                { id: 4, title: "2.1 Drawing Your Grid Guidelines", duration: "20 mins", completed: true },
                { id: 5, title: "2.2 Preparing Mud Clay Blend", duration: "18 mins", completed: true },
                { id: 6, title: "2.3 Applying Clay Border Threads", duration: "25 mins", completed: false },
            ]
        },
        {
            title: "Module 3: Intricate Mirror Positioning",
            lessons: [
                { id: 7, title: "3.1 Central Medallion Layout", duration: "30 mins", completed: false },
                { id: 8, title: "3.2 Corner Accent Motifs", duration: "22 mins", completed: false },
            ]
        }
    ];

    useEffect(() => {
        // Enforce student login
        const loggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        const purchased = localStorage.getItem('purchased_courses');
        if (purchased) {
            try {
                const list = JSON.parse(purchased);
                const matched = list.find((c: any) => c.id === courseId);
                if (matched) {
                    setCourse(matched);
                } else {
                    // Redirect if they try to access a course they don't own
                    router.push('/my-courses');
                }
            } catch {
                router.push('/my-courses');
            }
        } else {
            router.push('/my-courses');
        }
    }, [courseId]);

    const handleLessonToggle = (lessonId: number) => {
        if (!course) return;
        // Mock toggle lesson progress
        const nextCompleted = course.lessonsCompleted + 1;
        if (nextCompleted <= course.totalLessons) {
            const nextProgress = Math.round((nextCompleted / course.totalLessons) * 100);
            const updated = {
                ...course,
                lessonsCompleted: nextCompleted,
                progress: nextProgress
            };
            setCourse(updated);
            
            // Save back to localStorage
            const purchased = JSON.parse(localStorage.getItem('purchased_courses') || '[]');
            const index = purchased.findIndex((c: any) => c.id === courseId);
            if (index !== -1) {
                purchased[index] = updated;
                localStorage.setItem('purchased_courses', JSON.stringify(purchased));
                window.dispatchEvent(new Event('courses_updated'));
            }
        }
    };

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center text-on-surface-variant text-xs">
                Loading workspace...
            </div>
        );
    }

    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <div className="flex items-center gap-2 mb-6 text-on-surface-variant">
                <Link href="/my-courses" className="hover:text-primary transition-colors flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Back to My Courses
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side: Main Video Player & Details */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-outline-variant/35 bg-black shadow-sm relative">
                        {/* Mock YouTube Private Playlist Video Player */}
                        <iframe 
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0" 
                            title="Course Video Player"
                            allowFullScreen
                        />
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/20 pb-4 mb-4">
                            <div>
                                <span className="bg-primary-container/30 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                                    {course.category}
                                </span>
                                <h1 className="text-lg font-bold text-on-surface mt-1">{course.title}</h1>
                                <p className="text-on-surface-variant mt-0.5">Instructor: {course.instructor}</p>
                            </div>
                            <div className="bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-2 text-right">
                                <span className="text-[10px] text-on-surface-variant block uppercase tracking-wider font-semibold">Overall Progress</span>
                                <span className="text-sm font-bold text-primary">{course.progress}%</span>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-outline-variant/30 mb-6 gap-6">
                            <button 
                                onClick={() => setActiveTab('lessons')}
                                className={`pb-2.5 font-bold transition-all relative ${
                                    activeTab === 'lessons' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                Lessons
                            </button>
                            <button 
                                onClick={() => setActiveTab('zoom')}
                                className={`pb-2.5 font-bold transition-all relative ${
                                    activeTab === 'zoom' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                Live Classes
                            </button>
                            <button 
                                onClick={() => setActiveTab('resources')}
                                className={`pb-2.5 font-bold transition-all relative ${
                                    activeTab === 'resources' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                Resources
                            </button>
                            <button 
                                onClick={() => setActiveTab('certificate')}
                                className={`pb-2.5 font-bold transition-all relative ${
                                    activeTab === 'certificate' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-on-surface'
                                }`}
                            >
                                Certificate
                            </button>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'lessons' && (
                            <div className="space-y-4">
                                {modules.map((mod, mIdx) => (
                                    <div key={mIdx} className="space-y-2">
                                        <h4 className="font-bold text-on-surface bg-surface-container-low py-1.5 px-3 rounded-lg">
                                            {mod.title}
                                        </h4>
                                        <div className="divide-y divide-outline-variant/20 pl-2">
                                            {mod.lessons.map((lesson) => (
                                                <div key={lesson.id} className="flex justify-between items-center py-2.5">
                                                    <span className="text-on-surface">{lesson.title}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-on-surface-variant text-[10px]">{lesson.duration}</span>
                                                        <button 
                                                            onClick={() => handleLessonToggle(lesson.id)}
                                                            className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                                                lesson.completed 
                                                                    ? 'bg-primary border-primary text-on-primary' 
                                                                    : 'border-outline hover:border-primary text-transparent'
                                                            }`}
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'zoom' && (
                            <div className="space-y-6 py-4">
                                <div className="border-b border-outline-variant/20 pb-3">
                                    <h3 className="font-bold text-on-surface text-sm">Course Sessions & Live Classes</h3>
                                    <p className="text-[11px] text-on-surface-variant mt-0.5">Interact in real-time, ask questions, or watch recorded classes after completion.</p>
                                </div>
                                
                                {sessions.length === 0 ? (
                                    <div className="text-center py-8 text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20">
                                        No live sessions have been configured for this course yet.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {sessions.map((sess) => {
                                            const status = getSessionStatus(sess);
                                            
                                            return (
                                                <div key={sess.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full relative overflow-hidden group">
                                                    <div>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                                                                Live Class
                                                            </span>
                                                            {status === 'LIVE' && (
                                                                <span className="flex items-center gap-1 bg-red-50 text-red-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase animate-pulse border border-red-200">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                                                                    LIVE NOW
                                                                </span>
                                                            )}
                                                            {status === 'UPCOMING' && (
                                                                <span className="bg-surface-container text-on-surface-variant px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-outline-variant/20">
                                                                    Upcoming
                                                                </span>
                                                            )}
                                                            {status === 'COMPLETED' && (
                                                                <span className="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-outline-variant/20">
                                                                    Completed
                                                                </span>
                                                            )}
                                                            {status === 'RECORDING_AVAILABLE' && (
                                                                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-green-200">
                                                                    Recording Available
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-on-surface text-xs leading-snug group-hover:text-primary transition-colors">{sess.title}</h4>
                                                        <p className="text-[11px] text-on-surface-variant mt-1 line-clamp-2">{sess.description}</p>
                                                        
                                                        <div className="mt-4 space-y-1.5 text-[10px] text-on-surface-variant border-t border-outline-variant/20 pt-3">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                                <span>{sess.sessionDate}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                                <span>{sess.startTime} – {sess.endTime}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 pt-3 border-t border-outline-variant/20">
                                                        {status === 'LIVE' && sess.zoomLink && (
                                                            <a 
                                                                href={sess.zoomLink}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full text-center bg-red-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-red-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px] animate-pulse">videocam</span>
                                                                Join Live Class
                                                            </a>
                                                        )}
                                                        {status === 'UPCOMING' && (
                                                            <button 
                                                                disabled
                                                                className="w-full text-center bg-surface-variant/40 text-on-surface-variant/60 font-semibold py-2 rounded-lg text-xs cursor-not-allowed flex items-center justify-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                                Upcoming — Starts at {sess.startTime}
                                                            </button>
                                                        )}
                                                        {(status === 'COMPLETED' || status === 'RECORDING_AVAILABLE') && (
                                                            sess.recordingLink ? (
                                                                <a 
                                                                    href={sess.recordingLink}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="w-full text-center bg-primary text-on-primary font-bold py-2 rounded-lg text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px]">play_circle</span>
                                                                    Watch Recording
                                                                </a>
                                                            ) : (
                                                                <button 
                                                                    disabled
                                                                    className="w-full text-center bg-surface-variant/40 text-on-surface-variant/60 font-semibold py-2 rounded-lg text-xs cursor-not-allowed flex items-center justify-center gap-1"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">info</span>
                                                                    Recording Coming Soon
                                                                </button>
                                                            )
                                                        )}
                                                        {!sess.zoomLink && status !== 'COMPLETED' && status !== 'RECORDING_AVAILABLE' && (
                                                            <button 
                                                                disabled
                                                                className="w-full text-center bg-surface-variant/40 text-on-surface-variant/60 font-semibold py-2 rounded-lg text-xs cursor-not-allowed flex items-center justify-center gap-1"
                                                            >
                                                                <span className="material-symbols-outlined text-[14px]">link_off</span>
                                                                No Class Link Assigned
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="space-y-3">
                                {resourcesLoading ? (
                                    <div className="space-y-3">
                                        <div className="h-14 w-full bg-surface-container-low border border-outline-variant/20 rounded-xl animate-pulse"></div>
                                        <div className="h-14 w-full bg-surface-container-low border border-outline-variant/20 rounded-xl animate-pulse"></div>
                                    </div>
                                ) : courseResources.length === 0 ? (
                                    <div className="text-center py-6 text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20 italic">
                                        No resources uploaded for this course.
                                    </div>
                                ) : (
                                    courseResources.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-3 bg-surface-container-low rounded-xl border border-outline-variant/30">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary text-lg">
                                                    {item.type === 'Excel' ? 'table_chart' : item.type === 'Image' ? 'image' : 'description'}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-on-surface">{item.title}</p>
                                                    <p className="text-[10px] text-on-surface-variant">{item.type} ({item.size})</p>
                                                </div>
                                            </div>
                                            <a 
                                                href={item.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-primary hover:underline font-semibold text-[11px]"
                                            >
                                                Download
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'certificate' && (
                            <div className="text-center py-8 space-y-4 max-w-sm mx-auto">
                                <div className="w-12 h-12 bg-tertiary/15 text-tertiary rounded-full flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-xl">workspace_premium</span>
                                </div>
                                {course.progress >= 100 ? (
                                    <>
                                        <h3 className="font-bold text-on-surface text-sm">Certificate Unlocked!</h3>
                                        <p className="text-on-surface-variant leading-relaxed">
                                            Congratulations on finishing the course! Download your verified course completion certificate.
                                        </p>
                                        <button className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                                            Download PDF
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3 className="font-bold text-on-surface text-sm">Certificate Locked</h3>
                                        <p className="text-on-surface-variant leading-relaxed">
                                            Complete all lessons to 100% overall progress to unlock your Lemon Academy graduation credentials.
                                        </p>
                                        <div className="w-full bg-surface-variant h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side: Sidebar Instructor & Progress summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4 shadow-sm space-y-4">
                        <h3 className="font-bold text-on-surface">About the Instructor</h3>
                        <div className="flex gap-3 items-center">
                            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold text-on-surface">
                                {course.instructor.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <p className="font-bold text-on-surface">{course.instructor}</p>
                                <p className="text-[10px] text-on-surface-variant">Master Artisan & Educator</p>
                            </div>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed">
                            Aisha has over 8 years of workshop instruction experience teaching traditional clay grid patterns and craft techniques.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
