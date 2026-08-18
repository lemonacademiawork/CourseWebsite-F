'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ReferAndEarnPage() {
    const router = useRouter();
    const [isEligible, setIsEligible] = useState<boolean | null>(null);
    const [referralCode, setReferralCode] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('is_logged_in') === 'true';
        if (!loggedIn) {
            setIsEligible(false);
            return;
        }

        const purchased = localStorage.getItem('purchased_courses');
        if (purchased) {
            try {
                const list = JSON.parse(purchased);
                setIsEligible(Array.isArray(list) && list.length > 0);
            } catch {
                setIsEligible(false);
            }
        } else {
            setIsEligible(false);
        }

        const email = localStorage.getItem('user_email') || 'user';
        const code = email.split('@')[0] + '20';
        setReferralCode(code.toUpperCase());
    }, []);

    const handleCopy = () => {
        const link = `https://course-website-f.vercel.app/signup?ref=${referralCode}`;
        navigator.clipboard.writeText(link);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    if (isEligible === null) {
        return (
            <div className="min-h-screen flex items-center justify-center text-on-surface-variant text-xs">
                Verifying eligibility...
            </div>
        );
    }

    if (!isEligible) {
        return (
            <main className="min-h-screen py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center text-xs flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full text-primary mb-6">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h1 className="playfair text-2xl font-bold text-on-surface mb-4 max-w-lg">
                    Refer &amp; Earn is available to Lemon Academia students who have taken a course.
                </h1>
                <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
                    Once you purchase or enroll in your first artisanal workshop, you'll instantly unlock your personal referral link and start earning 20% commissions.
                </p>
                <Link href="/courses" className="bg-primary text-on-primary font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-sm">
                    Explore Courses
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-xs">
            <header className="mb-8">
                <h1 className="playfair text-3xl font-bold text-primary mb-2">Refer &amp; Earn 20%</h1>
                <p className="text-on-surface-variant">Spread the joy of traditional crafting and earn 20% commission on every course purchased through your link.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left side: Code and Sharing */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/35 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                        <h2 className="text-sm font-bold text-on-surface mb-3">Your Invitation Link</h2>
                        <div className="flex flex-col sm:flex-row gap-2 mb-6">
                            <input 
                                type="text" 
                                value={`https://course-website-f.vercel.app/signup?ref=${referralCode}`} 
                                readOnly
                                className="flex-1 bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-surface focus:outline-none"
                            />
                            <button 
                                onClick={handleCopy}
                                className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
                            >
                                {copySuccess ? 'Copied!' : 'Copy Link'}
                            </button>
                        </div>

                        {/* Earnings Stats */}
                        <h2 className="text-sm font-bold text-on-surface mb-3">Referral Earnings Summary</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                                <span className="block text-primary text-xl font-bold mb-1">3</span>
                                <span className="text-on-surface-variant text-[10px] uppercase font-semibold">Total Clicks</span>
                            </div>
                            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                                <span className="block text-primary text-xl font-bold mb-1">1</span>
                                <span className="text-on-surface-variant text-[10px] uppercase font-semibold">Successful Invites</span>
                            </div>
                            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                                <span className="block text-primary text-xl font-bold mb-1">Rs. 30</span>
                                <span className="text-on-surface-variant text-[10px] uppercase font-semibold">Paid Commissions</span>
                            </div>
                            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                                <span className="block text-primary text-xl font-bold mb-1">Rs. 0</span>
                                <span className="text-on-surface-variant text-[10px] uppercase font-semibold">Pending Approval</span>
                            </div>
                        </div>
                    </div>

                    {/* Referrals Log */}
                    <div className="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-on-surface mb-4">Referrals Log</h2>
                        <div className="w-full overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
                                        <th className="py-2.5 px-3">Friend's Email</th>
                                        <th className="py-2.5 px-3">Joined Date</th>
                                        <th className="py-2.5 px-3 text-right">Purchase Amount</th>
                                        <th className="py-2.5 px-3 text-right">Commission Earned (20%)</th>
                                        <th className="py-2.5 px-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/20 text-on-surface">
                                    <tr>
                                        <td className="py-3 px-3 font-semibold">sejal.agarwal@gmail.com</td>
                                        <td className="py-3 px-3 text-on-surface-variant">Aug 16, 2026</td>
                                        <td className="py-3 px-3 text-right">Rs. 149</td>
                                        <td className="py-3 px-3 text-right font-bold text-primary">Rs. 30</td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="inline-block px-2 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold">Paid</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-3 font-semibold">priya.sharma@example.com</td>
                                        <td className="py-3 px-3 text-on-surface-variant">Aug 17, 2026</td>
                                        <td className="py-3 px-3 text-right">--</td>
                                        <td className="py-3 px-3 text-right font-bold">Rs. 0</td>
                                        <td className="py-3 px-3 text-center">
                                            <span className="inline-block px-2 py-0.5 rounded bg-surface-variant text-on-surface-variant font-semibold">Registered</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right side: Instructions */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-surface-container-lowest border border-outline-variant/35 p-5 rounded-2xl shadow-sm space-y-4">
                        <h3 className="font-bold text-on-surface">How it Works</h3>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">1</span>
                                <p className="text-on-surface-variant leading-relaxed">Share your unique link with fellow craft lovers.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">2</span>
                                <p className="text-on-surface-variant leading-relaxed">They sign up and purchase any artisanal course catalog.</p>
                            </div>
                            <div className="flex gap-3">
                                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">3</span>
                                <p className="text-on-surface-variant leading-relaxed">You instantly receive 20% of their transaction value in cash.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
