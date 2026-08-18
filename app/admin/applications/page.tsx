'use client';
import { useState, useEffect } from 'react';

interface TrainerApplication {
    id: string;
    name: string;
    age: string;
    gender: string;
    email: string;
    phone: string;
    city: string;
    state: string;
    profilePhoto: string;
    category: string;
    experienceYears: string;
    profession: string;
    teachingExperience: string;
    previousWorkshops: string;
    studentsTaught: string;
    expertiseAreas: string;
    whatTheyCanTeach: string;
    whyTrainer: string;
    portfolioPhotos: string[];
    instagram: string;
    youtube: string;
    facebook: string;
    website: string;
    education: string;
    certifications: string;
    awards: string;
    languages: string;
    teachingLanguage: string;
    availability: string;
    classFormat: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Changes Requested';
    adminFeedback?: string;
}

export default function AdminTrainerApplicationsDashboard() {
    const [applications, setApplications] = useState<TrainerApplication[]>([]);
    const [selectedApp, setSelectedApp] = useState<TrainerApplication | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [feedbackText, setFeedbackText] = useState('');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const loadApplications = () => {
        const apps = localStorage.getItem('trainer_applications');
        if (apps) {
            setApplications(JSON.parse(apps));
        } else {
            // Default mock applications
            const mockApps: TrainerApplication[] = [
                {
                    id: '1',
                    name: 'Sarah Williams',
                    age: '29',
                    gender: 'Female',
                    email: 'sarah.w@example.com',
                    phone: '+91 98765 12345',
                    city: 'Pune',
                    state: 'Maharashtra',
                    profilePhoto: '',
                    category: 'Lippan Art',
                    experienceYears: '4 years',
                    profession: 'Craft Designer',
                    teachingExperience: '1 year',
                    previousWorkshops: '2 workshops',
                    studentsTaught: '45',
                    expertiseAreas: 'Mud work borders, mirror alignment grids',
                    whatTheyCanTeach: 'Lippan Art Fundamentals',
                    whyTrainer: 'I want to preserve and spread Kutchi clay craft art.',
                    portfolioPhotos: [
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAAJ5nZnQmJxKwzI6JqoBSDakgbfeQPFc19jKBR4sA0qrHkGPtfsLMqqw9cbq79SOf1bQnUrf4M21cdJ4kWVbg_jKzSF6XkRc5zFNS8lh4XwaB5xGB77Tz2-6C0eK2BEtnomrXImbjOJiD94BRnJx7MCrfZUvbtj46r3Rh01sKJOeEyxUj1YZnoTCtxXa-qtZCsLBrUP0hvMQ_D6vwQK7-zVd_7K9wpCMwMi2n3upqMqm3QWnEUlfhN"
                    ],
                    instagram: 'https://instagram.com/sarahcrafts',
                    youtube: '',
                    facebook: '',
                    website: '',
                    education: 'Bachelor of Fine Arts',
                    certifications: '',
                    awards: '',
                    languages: 'English, Hindi',
                    teachingLanguage: 'English',
                    availability: 'Weekends',
                    classFormat: 'Online Live',
                    status: 'Submitted'
                }
            ];
            setApplications(mockApps);
            localStorage.setItem('trainer_applications', JSON.stringify(mockApps));
        }
    };

    useEffect(() => {
        loadApplications();
        window.addEventListener('trainer_applications_updated', loadApplications);
        return () => window.removeEventListener('trainer_applications_updated', loadApplications);
    }, []);

    const updateAppStatus = (id: string, newStatus: 'Approved' | 'Rejected' | 'Changes Requested', feedback?: string) => {
        const updated = applications.map(app => {
            if (app.id === id) {
                const nextApp = { ...app, status: newStatus, adminFeedback: feedback || app.adminFeedback };
                
                // If approving the logged in user, automatically upgrade their role locally
                const currentUserEmail = localStorage.getItem('user_email');
                if (newStatus === 'Approved' && app.email === currentUserEmail) {
                    localStorage.setItem('user_role', 'trainer');
                    window.dispatchEvent(new Event('auth_state_changed'));
                }
                
                return nextApp;
            }
            return app;
        });

        setApplications(updated);
        localStorage.setItem('trainer_applications', JSON.stringify(updated));
        if (selectedApp?.id === id) {
            setSelectedApp(updated.find(a => a.id === id) || null);
        }
        window.dispatchEvent(new Event('trainer_applications_updated'));
    };

    const handleApprove = (id: string) => {
        updateAppStatus(id, 'Approved');
    };

    const handleReject = (id: string) => {
        updateAppStatus(id, 'Rejected');
    };

    const handleRequestChanges = () => {
        if (!selectedApp || !feedbackText.trim()) return;
        updateAppStatus(selectedApp.id, 'Changes Requested', feedbackText.trim());
        setShowFeedbackModal(false);
        setFeedbackText('');
    };

    const filtered = applications.filter(app => {
        const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              app.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs">
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-on-surface">Trainer Applications</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Review portfolios, professional experiences, and approve prospective tutors.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                        <input 
                            className="w-full pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none shadow-sm" 
                            placeholder="Search applicants..." 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        className="bg-surface-container-lowest border border-outline-variant/40 rounded-lg py-1.5 px-3 focus:outline-none"
                    >
                        <option value="All">All Statuses</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Changes Requested">Changes Requested</option>
                    </select>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Applications List */}
                <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm h-fit">
                    <div className="p-4 border-b border-outline-variant/20 bg-surface-container-low/50">
                        <h3 className="font-bold text-on-surface">Applicants List</h3>
                    </div>
                    <div className="divide-y divide-outline-variant/20 max-h-[600px] overflow-y-auto">
                        {filtered.map(app => (
                            <div 
                                key={app.id} 
                                onClick={() => setSelectedApp(app)}
                                className={`p-4 cursor-pointer hover:bg-surface-container-low/30 transition-colors flex items-center justify-between ${
                                    selectedApp?.id === app.id ? 'bg-primary-container/10 border-l-4 border-primary' : ''
                                }`}
                            >
                                <div className="space-y-1">
                                    <h4 className="font-bold text-on-surface">{app.name}</h4>
                                    <p className="text-on-surface-variant">{app.category} • {app.experienceYears}</p>
                                    <p className="text-[10px] text-on-surface-variant/80">{app.email}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    app.status === 'Approved' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                                    app.status === 'Changes Requested' ? 'bg-amber-100 text-amber-900' :
                                    app.status === 'Rejected' ? 'bg-red-100 text-red-900' : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                                }`}>
                                    {app.status}
                                </span>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="py-12 text-center text-on-surface-variant">
                                No applications match the criteria.
                            </div>
                        )}
                    </div>
                </div>

                {/* Application Details Viewer */}
                <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 shadow-sm min-h-[400px]">
                    {selectedApp ? (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-outline-variant/20 pb-4">
                                <div className="flex gap-3 items-center">
                                    {selectedApp.profilePhoto ? (
                                        <img src={selectedApp.profilePhoto} className="w-12 h-12 rounded-full object-cover border" alt="Profile" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-sm font-bold text-on-surface">
                                            {selectedApp.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-bold text-on-surface">{selectedApp.name}</h3>
                                        <p className="text-on-surface-variant">{selectedApp.category} Expert • {selectedApp.experienceYears} Exp</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                    selectedApp.status === 'Approved' ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                                    selectedApp.status === 'Changes Requested' ? 'bg-amber-100 text-amber-900' :
                                    selectedApp.status === 'Rejected' ? 'bg-red-100 text-red-900' : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                                }`}>
                                    {selectedApp.status}
                                </span>
                            </div>

                            {/* Info Blocks */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-on-surface-variant uppercase tracking-wider text-[9px] mb-1">Personal Details</h4>
                                    <p className="text-on-surface">Age: {selectedApp.age} • Gender: {selectedApp.gender}</p>
                                    <p className="text-on-surface">Phone: {selectedApp.phone}</p>
                                    <p className="text-on-surface">Location: {selectedApp.city}, {selectedApp.state}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-on-surface-variant uppercase tracking-wider text-[9px] mb-1">Professional Details</h4>
                                    <p className="text-on-surface">Profession: {selectedApp.profession}</p>
                                    <p className="text-on-surface">Taught: {selectedApp.studentsTaught} students</p>
                                    <p className="text-on-surface">Format: {selectedApp.classFormat}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-on-surface-variant uppercase tracking-wider text-[9px] mb-1">Expertise & Teaching Motivation</h4>
                                <p className="text-on-surface leading-relaxed mb-2 font-medium">Expertise: {selectedApp.expertiseAreas}</p>
                                <p className="text-on-surface leading-relaxed mb-2">Proposing: {selectedApp.whatTheyCanTeach}</p>
                                <p className="text-on-surface leading-relaxed italic">"Why teach: {selectedApp.whyTrainer}"</p>
                            </div>

                            {/* Portfolio Preview */}
                            <div>
                                <h4 className="font-semibold text-on-surface-variant uppercase tracking-wider text-[9px] mb-2">Portfolio (Artwork Photos)</h4>
                                <div className="grid grid-cols-3 gap-3">
                                    {selectedApp.portfolioPhotos?.map((photo, idx) => (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-outline-variant/35 bg-surface-container">
                                            <img src={photo} className="w-full h-full object-cover" alt="Portfolio Preview" />
                                        </div>
                                    ))}
                                    {(!selectedApp.portfolioPhotos || selectedApp.portfolioPhotos.length === 0) && (
                                        <p className="col-span-3 text-on-surface-variant italic">No portfolio photos uploaded.</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {selectedApp.status === 'Submitted' && (
                                <div className="flex gap-3 border-t border-outline-variant/20 pt-4">
                                    <button 
                                        onClick={() => handleApprove(selectedApp.id)}
                                        className="flex-1 bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Approve Trainer
                                    </button>
                                    <button 
                                        onClick={() => setShowFeedbackModal(true)}
                                        className="flex-1 bg-amber-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Request Changes
                                    </button>
                                    <button 
                                        onClick={() => handleReject(selectedApp.id)}
                                        className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-on-surface-variant italic py-20">
                            Select an applicant from the left to review details.
                        </div>
                    )}
                </div>
            </div>

            {/* Request Changes Dialog Box */}
            {showFeedbackModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-6 max-w-sm w-full space-y-4 shadow-lg text-xs">
                        <h3 className="font-bold text-sm text-on-surface">Request Application Changes</h3>
                        <div>
                            <label className="block font-semibold text-on-surface-variant mb-1">Feedback / Requested Updates</label>
                            <textarea 
                                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:outline-none" 
                                rows={4} 
                                placeholder="e.g. Please upload higher quality photos of your Lippan Art murals."
                                value={feedbackText}
                                onChange={e => setFeedbackText(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button 
                                onClick={handleRequestChanges}
                                className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Submit Request
                            </button>
                            <button 
                                onClick={() => {
                                    setShowFeedbackModal(false);
                                    setFeedbackText('');
                                }}
                                className="bg-surface-container border border-outline/30 text-on-surface font-semibold py-2 px-4 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
