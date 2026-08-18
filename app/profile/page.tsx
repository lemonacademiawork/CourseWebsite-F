'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentUserProfilePage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [courseCount, setCourseCount] = useState(0);

    useEffect(() => {
        const loggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!loggedIn) {
            router.push('/login');
            return;
        }

        setName(localStorage.getItem('user_name') || 'User');
        setEmail(localStorage.getItem('user_email') || '');
        setRole(localStorage.getItem('user_role') || 'student');

        const purchased = localStorage.getItem('purchased_courses');
        if (purchased) {
            try {
                const list = JSON.parse(purchased);
                setCourseCount(list.length);
            } catch {
                setCourseCount(0);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('auth_token');
        window.dispatchEvent(new Event('auth_state_changed'));
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-[#FBF8F1] py-12 px-margin-mobile md:px-margin-desktop max-w-xl mx-auto text-xs">
            <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4 border shadow-sm">
                        {name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h2 className="playfair text-xl font-bold text-on-surface">{name}</h2>
                    <p className="text-on-surface-variant capitalize mt-0.5">{role} Account</p>
                </div>

                <div className="border-t border-outline-variant/20 pt-4 space-y-3">
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="font-semibold text-on-surface-variant">Email Address</span>
                        <span className="text-on-surface">{email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="font-semibold text-on-surface-variant">Account Type</span>
                        <span className="text-on-surface capitalize">{role}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-outline-variant/10">
                        <span className="font-semibold text-on-surface-variant">Active Courses</span>
                        <span className="text-on-surface font-bold">{courseCount}</span>
                    </div>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                    <Link href="/my-courses" className="w-full text-center bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                        Go to My Courses
                    </Link>
                    <button 
                        onClick={handleLogout}
                        className="w-full bg-surface-container text-on-surface font-semibold py-2.5 rounded-lg hover:bg-surface-dim transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </main>
    );
}
