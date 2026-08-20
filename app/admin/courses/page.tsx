'use client';
import { useState, useEffect } from 'react';
import { CourseSession, getSessionStatus, initializeMockSessions } from '../../../components/sessionUtils';

interface CourseItem {
    id: string;
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
    
    // Form states for Course
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [trainer, setTrainer] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');

    // Session Management states
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<Record<string, CourseSession[]>>({});
    const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
    const [tempZoomLink, setTempZoomLink] = useState('');
    const [tempRecordingLink, setTempRecordingLink] = useState('');
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [saveLoading, setSaveLoading] = useState(false);

    // Initialize databases
    useEffect(() => {
        // Load courses
        const storedCourses = localStorage.getItem('admin_courses');
        let initialCourses: CourseItem[] = [];
        if (storedCourses) {
            try {
                initialCourses = JSON.parse(storedCourses);
            } catch {
                initialCourses = [];
            }
        }
        
        if (initialCourses.length === 0) {
            initialCourses = [
                {
                    id: 'lippan-art',
                    title: "The Art of Lippan: Traditional Mud & Mirror Work",
                    category: "Lippan Art",
                    trainer: "Aisha Sharma",
                    price: 49,
                    studentsCount: 45,
                    status: 'Published',
                    createdDate: 'Aug 10, 2026'
                },
                {
                    id: 'mosaic-art',
                    title: "Contemporary Glass Mosaics",
                    category: "Mosaic Art",
                    trainer: "Marcus King",
                    price: 65,
                    studentsCount: 12,
                    status: 'Published',
                    createdDate: 'Aug 12, 2026'
                }
            ];
            localStorage.setItem('admin_courses', JSON.stringify(initialCourses));
        }
        setCourses(initialCourses);

        // Load sessions
        const initialSess = initializeMockSessions();
        setSessions(initialSess);
    }, []);

    const handleCreateCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newId = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newCourse: CourseItem = {
            id: newId,
            title: title.trim(),
            category: category.trim() || 'General Craft',
            trainer: trainer.trim() || 'Guest Instructor',
            price: Number(price),
            studentsCount: 0,
            status,
            createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        };

        const updated = [...courses, newCourse];
        setCourses(updated);
        localStorage.setItem('admin_courses', JSON.stringify(updated));

        // Create empty sessions array for this new course
        const updatedSess = { ...sessions, [newId]: [] };
        setSessions(updatedSess);
        localStorage.setItem('course_sessions', JSON.stringify(updatedSess));

        setTitle('');
        setCategory('');
        setTrainer('');
        setPrice(0);
        setIsCreating(false);
    };

    const startEditingSession = (session: CourseSession) => {
        setEditingSessionId(session.id);
        setTempZoomLink(session.zoomLink || '');
        setTempRecordingLink(session.recordingLink || '');
        setSaveError('');
        setSaveSuccess('');
    };

    const cancelEditing = () => {
        setEditingSessionId(null);
        setSaveError('');
        setSaveSuccess('');
    };

    const isValidUrl = (urlStr: string) => {
        if (!urlStr || urlStr.trim() === '') return true; // Empty is fine (clearing link)
        try {
            const url = new URL(urlStr);
            return url.protocol === 'http:' || url.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const saveSessionLinks = (e: React.FormEvent, sessionId: string) => {
        e.preventDefault();
        setSaveError('');
        setSaveSuccess('');

        if (!isValidUrl(tempZoomLink)) {
            setSaveError('Invalid Zoom URL format. Must start with http:// or https://');
            return;
        }

        if (!isValidUrl(tempRecordingLink)) {
            setSaveError('Invalid Recording URL format. Must start with http:// or https://');
            return;
        }

        if (!selectedCourseId) return;

        setSaveLoading(true);

        // Simulate save delay/spinner state
        setTimeout(() => {
            const courseSess = sessions[selectedCourseId] || [];
            const updatedSessList = courseSess.map((sess) => {
                if (sess.id === sessionId) {
                    return {
                        ...sess,
                        zoomLink: tempZoomLink.trim(),
                        recordingLink: tempRecordingLink.trim()
                    };
                }
                return sess;
            });

            const allUpdated = { ...sessions, [selectedCourseId]: updatedSessList };
            setSessions(allUpdated);
            localStorage.setItem('course_sessions', JSON.stringify(allUpdated));
            
            // Dispatch sync event for active client pages
            window.dispatchEvent(new Event('session_database_updated'));

            setSaveLoading(false);
            setSaveSuccess('Session links updated successfully.');
            
            // Hide edit form after success
            setTimeout(() => {
                setEditingSessionId(null);
                setSaveSuccess('');
            }, 1000);
        }, 600);
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

            {/* Session Management panel */}
            {selectedCourseId && (
                <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm mb-6 max-w-4xl">
                    <div className="flex justify-between items-center border-b border-outline-variant/20 pb-3 mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-on-surface">
                                Manage Sessions — {courses.find(c => c.id === selectedCourseId)?.title}
                            </h3>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">Assign Zoom links and recording links for individual course sessions.</p>
                        </div>
                        <button 
                            onClick={() => {
                                setSelectedCourseId(null);
                                setEditingSessionId(null);
                            }}
                            className="text-on-surface hover:text-primary transition-colors flex items-center gap-1 font-semibold"
                        >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                            Close Panel
                        </button>
                    </div>

                    <div className="space-y-4">
                        {(sessions[selectedCourseId] || []).length === 0 ? (
                            <div className="text-center py-6 text-on-surface-variant italic">
                                No sessions scheduled for this course. Click the Edit button below to create one.
                            </div>
                        ) : (
                            (sessions[selectedCourseId] || []).map((sess) => {
                                const status = getSessionStatus(sess);
                                const isEditing = editingSessionId === sess.id;
                                
                                return (
                                    <div key={sess.id} className="border border-outline-variant/20 rounded-xl p-3 bg-surface-container-low/20 space-y-2">
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-outline-variant/10 pb-2">
                                            <div>
                                                <h4 className="font-bold text-on-surface text-xs">{sess.title}</h4>
                                                <p className="text-[10px] text-on-surface-variant mt-0.5">{sess.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                                                    status === 'LIVE' ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse' :
                                                    status === 'UPCOMING' ? 'bg-surface-container text-on-surface-variant' :
                                                    status === 'RECORDING_AVAILABLE' ? 'bg-green-50 text-green-700 border border-green-200' :
                                                    'bg-surface-container-high text-on-surface-variant'
                                                }`}>
                                                    {status === 'RECORDING_AVAILABLE' ? 'COMPLETED • RECORDING' : status}
                                                </span>
                                                {!isEditing && (
                                                    <button 
                                                        onClick={() => startEditingSession(sess)}
                                                        className="text-primary hover:underline font-semibold flex items-center gap-0.5 text-[10px]"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">edit</span>
                                                        Edit Links
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-on-surface-variant">
                                            <div>
                                                <span className="font-semibold block text-on-surface mb-0.5">Date & Time</span>
                                                <span>{sess.sessionDate} • {sess.startTime} – {sess.endTime}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <div>
                                                    <span className="font-semibold text-on-surface">Zoom Link:</span>{' '}
                                                    {sess.zoomLink ? (
                                                        <a href={sess.zoomLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{sess.zoomLink}</a>
                                                    ) : (
                                                        <span className="italic text-on-surface-variant/60">Not assigned</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-semibold text-on-surface">Recording Link:</span>{' '}
                                                    {sess.recordingLink ? (
                                                        <a href={sess.recordingLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{sess.recordingLink}</a>
                                                    ) : (
                                                        <span className="italic text-on-surface-variant/60">Not uploaded</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <form onSubmit={(e) => saveSessionLinks(e, sess.id)} className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 space-y-3 mt-2">
                                                <h5 className="font-semibold text-on-surface text-[11px]">Configure Links</h5>
                                                {saveError && (
                                                    <div className="bg-red-50 border border-red-200 text-red-700 p-2 rounded text-[10px]">
                                                        {saveError}
                                                    </div>
                                                )}
                                                {saveSuccess && (
                                                    <div className="bg-green-50 border border-green-200 text-green-700 p-2 rounded text-[10px]">
                                                        {saveSuccess}
                                                    </div>
                                                )}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block font-semibold text-on-surface-variant mb-1">Zoom Meeting Link</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                                            placeholder="https://zoom.us/j/..."
                                                            value={tempZoomLink}
                                                            onChange={(e) => setTempZoomLink(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block font-semibold text-on-surface-variant mb-1">Recording Link</label>
                                                        <input 
                                                            type="text" 
                                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 focus:ring-1 focus:ring-primary focus:outline-none" 
                                                            placeholder="https://youtube.com/watch?v=..."
                                                            value={tempRecordingLink}
                                                            onChange={(e) => setTempRecordingLink(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 justify-end pt-1">
                                                    <button 
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        className="py-1 px-2.5 border border-outline rounded-lg font-semibold hover:bg-surface-container transition-colors text-[10px]"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        type="submit"
                                                        disabled={saveLoading}
                                                        className="bg-primary text-on-primary font-semibold py-1 px-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50 text-[10px]"
                                                    >
                                                        {saveLoading ? 'Saving...' : 'Save Links'}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-outline-variant bg-surface-container-low/50">
                    <div className="col-span-12 md:col-span-4 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Course</div>
                    <div className="hidden md:block col-span-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider">Trainer</div>
                    <div className="hidden md:block col-span-1 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">Price</div>
                    <div className="hidden md:block col-span-1 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-right">Students</div>
                    <div className="hidden md:block col-span-3 text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider text-center">Actions</div>
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
                            <div className="col-span-12 md:col-span-3 flex gap-2 justify-center">
                                <button 
                                    onClick={() => {
                                        setSelectedCourseId(course.id);
                                        setEditingSessionId(null);
                                    }}
                                    className="bg-surface-container-high text-on-surface font-semibold py-1.5 px-3 rounded hover:bg-surface-variant transition-colors flex items-center gap-1 text-[10px]"
                                >
                                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                                    Sessions
                                </button>
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
