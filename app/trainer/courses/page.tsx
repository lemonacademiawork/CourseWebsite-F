'use client';
import { useState, useEffect } from 'react';

export default function TrainerCoursesPage() {
    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[1280px] mx-auto w-full">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-on-surface">My Courses</h2>
                <p className="text-on-surface-variant mt-1">Manage and update curricula, lessons, and assignments for your active craft workshops.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                    <div className="h-40 bg-surface-variant relative">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0ThDuVb2OniJ7WjvUCvt2WCyo2E3mdyuwdOomyt_EsUYfXZROwlmMElUUCZg7R2hCQS8EPksrOUA8DNa6IYGDrwTsBKgVIifhm9uzNYZ50hmVZcxTZvuDMEbphB0-A_DhmJPMIYSDxQ4Y51zbqnup0HmEThNgiSSyKIXS_FB_-LG-JXEAF-RaJHkXysyatKC9c5EzMw_7PckGAr67Bkegu0RZX7LdOhVzPkR0SRxBYxr2iG43fPoO" alt="Lippan" />
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between gap-4">
                        <div>
                            <h3 className="font-bold text-on-surface text-sm">The Art of Lippan: Mud &amp; Mirror Work</h3>
                            <p className="text-on-surface-variant mt-1">20 Lessons • 45 Students Enrolled</p>
                        </div>
                        <button className="w-full text-center bg-primary text-on-primary font-semibold py-2 rounded-lg text-xs hover:opacity-95 transition-opacity">
                            Manage Curriculum
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
