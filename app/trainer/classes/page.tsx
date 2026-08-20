'use client';

import { useState, useEffect } from 'react';
import { CourseSession, getSessionStatus, initializeMockSessions } from '../../../components/sessionUtils';

export default function TrainerClassesPage() {
    const [sessions, setSessions] = useState<CourseSession[]>([]);

    useEffect(() => {
        const allSessions = initializeMockSessions();
        setSessions(allSessions["lippan-art"] || []);
    }, []);

    // Listen for live updates
    useEffect(() => {
        const handleSessionRefetch = () => {
            const allSessions = JSON.parse(localStorage.getItem('course_sessions') || '{}');
            setSessions(allSessions["lippan-art"] || []);
        };
        window.addEventListener('session_database_updated', handleSessionRefetch);
        return () => window.removeEventListener('session_database_updated', handleSessionRefetch);
    }, []);

    return (
        <div className="relative min-h-screen pb-4">
            {/* Abstract Background Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
            
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-6 py-4 relative z-10 text-xs">
                <header className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-3">
                    <div>
                        <h2 className="text-xl font-bold text-on-surface">Live Classes</h2>
                        <p className="text-[11px] text-on-surface-variant mt-0.5">Schedule and launch interactive Zoom Q&amp;A sessions with students.</p>
                    </div>
                </header>

                <div className="mt-6">
                    {sessions.length === 0 ? (
                        <div className="text-center py-8 text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20">
                            No live sessions configured.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sessions.map((sess) => {
                                const status = getSessionStatus(sess);
                                
                                return (
                                    <div key={sess.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group text-[11px]">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[9px] font-bold text-secondary uppercase tracking-wider bg-secondary/15 px-2 py-0.5 rounded">
                                                    Interactive Q&amp;A
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
                                                        Recorded
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-on-surface text-xs leading-snug group-hover:text-secondary transition-colors">{sess.title}</h4>
                                            <p className="text-on-surface-variant mt-1 line-clamp-2">{sess.description}</p>
                                            
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
                                                    className="w-full text-center bg-secondary text-on-secondary font-bold py-2 rounded-lg text-xs hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-sm"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] animate-pulse">videocam</span>
                                                    Start Live Class
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
                                                        className="w-full text-center bg-surface-variant text-on-surface font-semibold py-2 rounded-lg text-xs hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
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
            </div>
        </div>
    );
}
