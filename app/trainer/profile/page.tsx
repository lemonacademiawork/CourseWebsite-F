'use client';
import { useState, useEffect } from 'react';

export default function TrainerWorkspaceProfilePage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('auth_token') || '';
        if (token) {
            fetch('/api/v1/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                const profile = data.data || data;
                if (profile.name || profile.email) {
                    setName(profile.name || 'Trainer');
                    setEmail(profile.email || '');
                } else {
                    setName(localStorage.getItem('user_name') || 'Trainer');
                    setEmail(localStorage.getItem('user_email') || 'trainer@lemon.edu');
                }
            })
            .catch(() => {
                setName(localStorage.getItem('user_name') || 'Trainer');
                setEmail(localStorage.getItem('user_email') || 'trainer@lemon.edu');
            });
        } else {
            setName(localStorage.getItem('user_name') || 'Trainer');
            setEmail(localStorage.getItem('user_email') || 'trainer@lemon.edu');
        }
    }, []);

    return (
        <main className="flex-grow min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-8 text-xs max-w-[800px] mx-auto w-full">
            <header className="mb-6">
                <h2 className="text-xl font-bold text-on-surface">Trainer Profile</h2>
                <p className="text-on-surface-variant mt-1">Manage your public bio, credentials, profile photo, and teaching format preferences.</p>
            </header>

            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
                <div className="flex items-center gap-4 border-b pb-6">
                    <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl">
                        {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h3 className="font-bold text-on-surface text-sm">{name}</h3>
                        <p className="text-on-surface-variant">Master Artisan & Educator</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="font-semibold text-on-surface-variant block mb-1">Email Address</span>
                            <span className="text-on-surface block font-medium bg-surface-container-low p-2 rounded-lg">{email}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-on-surface-variant block mb-1">Specialization</span>
                            <span className="text-on-surface block font-medium bg-surface-container-low p-2 rounded-lg">Lippan Art</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
