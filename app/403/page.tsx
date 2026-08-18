'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccessDenied() {
    const [workspaceLink, setWorkspaceLink] = useState('/');

    useEffect(() => {
        const role = localStorage.getItem('user_role') || 'student';
        if (role === 'admin') {
            setWorkspaceLink('/admin/dashboard');
        } else if (role === 'trainer') {
            setWorkspaceLink('/trainer/dashboard');
        } else {
            setWorkspaceLink('/');
        }
    }, []);

    return (
        <main className="min-h-screen bg-[#FBF8F1] flex flex-col items-center justify-center px-4 text-center text-xs">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-3xl">gavel</span>
            </div>
            <h1 className="playfair text-3xl font-bold text-on-surface mb-2">403 - Forbidden</h1>
            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                You don't have access to this area.
            </p>
            <Link 
                href={workspaceLink}
                className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
                Return to your workspace
            </Link>
        </main>
    );
}
