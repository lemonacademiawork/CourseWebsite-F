'use client';
import { useState } from 'react';

interface TrainerInfo {
    id: number;
    name: string;
    email: string;
    avatarUrl?: string;
    initials?: string;
    course: string;
    runningDates: string;
    status: 'Active' | 'Pending Approval';
}

const TRAINER_DATA: TrainerInfo[] = [
    {
        id: 1,
        name: "Aisha Iyer",
        email: "aisha.iyer@lemon.edu",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAJ5nZnQmJxKwzI6JqoBSDakgbfeQPFc19jKBR4sA0qrHkGPtfsLMqqw9cbq79SOf1bQnUrf4M21cdJ4kWVbg_jKzSF6XkRc5zFNS8lh4XwaB5xGB77Tz2-6C0eK2BEtnomrXImbjOJiD94BRnJx7MCrfZUvbtj46r3Rh01sKJOeEyxUj1YZnoTCtxXa-qtZCsLBrUP0hvMQ_D6vwQK7-zVd_7K9wpCMwMi2n3upqMqm3QWnEUlfhN",
        course: "Lippan Art Fundamentals",
        runningDates: "Mon, Wed, Fri (Oct 12 - Nov 05)",
        status: "Active"
    },
    {
        id: 2,
        name: "David Ross",
        email: "david.ross@lemon.edu",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzjDz0N50q7CIwfgh2u1czsFkhGUNlN81-qxYYwdGJL2iVxuIJJ-wa_WTX5zgxkarkH3UZSpZNmz1qbwv4heT5P3yWD8uWWsYax2oIxfAvxI2dncn8vvjYKRmruXJ6SCFrlOe7ZDJyiFImMG7uP9HEecCf0KdBVl7E8g5UUZ0gpw_LTHMTMakJmzWAC_ITSjmu2Oupv9iXIEozaT_4iDh_T7ahmMRRSv3dzBsCYyOzAK0V552z1xAw",
        course: "Modern Mosaic Techniques",
        runningDates: "Tue, Thu (Nov 04 - Nov 28)",
        status: "Active"
    },
    {
        id: 3,
        name: "Elena Cruz",
        email: "elena.cruz@lemon.edu",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBkwk2QeW6jxNlLpAxkAwVXWjRVSBwYZlcKp62TojyEfZMz0t3GhRRTJU9FXh-RhPEW3rTDeU9bRG2EJgyPyyPpCULfsgj66xSmXCZMuh8zTCixg_mss6o5pQhrUr4dE0zczFk9k8-Qy1ovvOeAwSysUsMwP49KriAjBeu9qDYx7G-lQwRYJ7eeuhpTxbLSlIu7Gks6-4-pDhmXdqsIERnjLL912b9u55yMkt7pf24y2nXWP-keu_jx",
        course: "Hand-poured Candle Craft",
        runningDates: "Mon, Wed (Sep 22 - Oct 20)",
        status: "Active"
    },
    {
        id: 4,
        name: "Sarah Jenkins",
        email: "sarah.j@example.com",
        initials: "SJ",
        course: "Intro to Candle Making (Live)",
        runningDates: "Today, 10:00 AM",
        status: "Active"
    },
    {
        id: 5,
        name: "Priya Patel",
        email: "priya.p@example.com",
        initials: "PP",
        course: "Mastering Lippan Art (Live)",
        runningDates: "Today, 2:30 PM",
        status: "Active"
    },
    {
        id: 6,
        name: "Marcus Chen",
        email: "marcus.c.art@email.com",
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZmPDqbF00Fb5jmesjeN9872krcPLkXAwAHyuJSOcpmZ4vobw4-k-Y_Cq8dtkG4a0T4p11iO0DuNTBVsXWcjX2olBOHDfVz2g3meu78z0EQJBIRy9FQlcw89c-8Ciy2Hms3rNubI86zMvs08SoY3oOK5J6B8O_mRzyNvX57x0YRE4_t8eWQpYtlXXGmzGey2aJAMH5oSEiwkZLxekY1dAOzmK_WEgNcHqwL6uf_JZiPodln2oo6BjA",
        course: "Clay Pottery Masterclass",
        runningDates: "Awaiting Schedule",
        status: "Pending Approval"
    },
    {
        id: 7,
        name: "Sarah Williams",
        email: "sarah.w.design@email.com",
        initials: "SW",
        course: "Typography & Creative Layouts",
        runningDates: "Awaiting Schedule",
        status: "Pending Approval"
    }
];

export default function AdminTrainerManagementDashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [trainers, setTrainers] = useState<TrainerInfo[]>(TRAINER_DATA);

    const filteredTrainers = trainers.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalTrainers = trainers.filter(t => t.status === 'Active').length;
    const pendingRequests = trainers.filter(t => t.status === 'Pending Approval').length;

    const handleApprove = (id: number) => {
        setTrainers(trainers.map(t => t.id === id ? { ...t, status: 'Active', runningDates: 'To Be Scheduled' } : t));
    };

    return (
        <div className="relative min-h-screen pb-6">
            {/* Abstract Background Pattern (Subtle & Premium) */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6 relative z-10">
                {/* Welcome Header */}
                <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-4">
                    <div>
                        <p className="font-semibold text-secondary uppercase tracking-widest mb-1 text-[10px]">Management Portal</p>
                        <h2 className="text-xl font-bold text-on-surface">
                            Trainers & Course Rosters
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-1">Manage instructor profiles, assigned workshops, schedules, and pending requests.</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
                            <input 
                                className="w-full pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm" 
                                placeholder="Search trainers or courses..." 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                {/* KPI Cards Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Stat Card 1 */}
                    <div className="glass-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Total Active Trainers</span>
                            <div className="w-7 h-7 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface">
                                <span className="material-symbols-outlined text-base">badge</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">{totalTrainers}</div>
                            <p className="text-[10px] text-on-surface-variant mt-1">Instructors leading active courses</p>
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="glass-card bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                        <div className="flex justify-between items-start">
                            <span className="font-semibold text-[10px] text-on-surface-variant uppercase tracking-wider">Pending Trainer Requests</span>
                            <div className="w-7 h-7 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-base">person_add</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="text-xl font-bold text-on-surface leading-none">{pendingRequests}</div>
                            <p className="text-[10px] text-on-surface-variant mt-1">Awaiting approval to teach</p>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-outline-variant/20 bg-surface-container/30">
                        <h3 className="text-xs font-bold text-on-surface">Active Roster & Applicants</h3>
                    </div>
                    
                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-outline-variant/30 bg-background/50 text-on-surface-variant text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4 font-semibold">Trainer</th>
                                    <th className="py-3 px-4 font-semibold">Course Assigned</th>
                                    <th className="py-3 px-4 font-semibold">Running Dates</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/20 text-xs text-on-surface">
                                {filteredTrainers.map((trainer) => (
                                    <tr key={trainer.id} className="hover:bg-surface-container-low transition-colors duration-150 group">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {trainer.avatarUrl ? (
                                                    <img alt={trainer.name} className="w-8 h-8 rounded-full object-cover border border-outline-variant/30" src={trainer.avatarUrl} />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center font-bold text-[11px] text-on-surface-variant border border-outline-variant/30">
                                                        {trainer.initials}
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-on-surface">{trainer.name}</span>
                                                    <span className="text-[10px] text-on-surface-variant">{trainer.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-on-surface">{trainer.course}</td>
                                        <td className="py-3 px-4 text-on-surface-variant">{trainer.runningDates}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                trainer.status === 'Active' 
                                                    ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' 
                                                    : 'bg-secondary-fixed text-on-secondary-fixed-variant'
                                            }`}>
                                                <span className={`w-1 h-1 rounded-full ${
                                                    trainer.status === 'Active' ? 'bg-tertiary' : 'bg-secondary'
                                                }`}></span>
                                                {trainer.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {trainer.status === 'Pending Approval' ? (
                                                <button 
                                                    onClick={() => handleApprove(trainer.id)}
                                                    className="bg-primary text-on-primary font-semibold text-[10px] uppercase tracking-wider py-1 px-3 rounded-lg hover:opacity-90 transition-opacity"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <span className="text-on-surface-variant text-[11px] italic">Scheduled</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredTrainers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-on-surface-variant text-xs">
                                            No trainers found matching the search query.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-3.5 border-t border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30">
                        <span className="text-xs text-on-surface-variant">Showing {filteredTrainers.length} of {trainers.length} entries</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
