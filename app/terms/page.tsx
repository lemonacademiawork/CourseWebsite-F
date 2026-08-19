'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
    { id: 'acceptance', label: '1. Acceptance of Terms' },
    { id: 'accounts', label: '2. Registration & Security' },
    { id: 'intellectual', label: '3. Intellectual Property' },
    { id: 'payments', label: '4. Fees & Billing' },
    { id: 'refunds', label: '5. Cancellations & Refunds' },
    { id: 'liability', label: '6. Limitation of Liability' },
    { id: 'governing', label: '7. Governing Law' },
];

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState('acceptance');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 160;

            for (const section of SECTIONS) {
                const element = document.getElementById(section.id);
                if (element) {
                    const top = element.offsetTop;
                    const height = element.offsetHeight;
                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
            setActiveSection(id);
        }
    };

    return (
        <main className="bg-surface min-h-screen text-on-surface py-12 md:py-16">
            {/* Header */}
            <div className="max-w-[1200px] mx-auto px-4 mb-12">
                <span className="bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full inline-block mb-3">
                    Legal
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-2 playfair">
                    Terms of Service
                </h1>
                <p className="text-on-surface-variant text-xs md:text-sm">
                    Effective Date: August 19, 2026 | Last Updated: August 19, 2026
                </p>
            </div>

            {/* Layout container */}
            <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
                
                {/* Sticky Sidebar Navigation */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-28 bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 space-y-3">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-outline mb-2">Terms Chapters</h4>
                        <nav className="flex flex-col space-y-1">
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`text-left text-xs font-semibold py-2 px-3 rounded-xl transition-all ${
                                        activeSection === section.id
                                            ? 'bg-primary text-white font-bold shadow-sm'
                                            : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                                    }`}
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Main Content Pane with TL;DR side blocks */}
                <div className="lg:col-span-3 space-y-12 leading-relaxed text-sm md:text-base text-on-surface-variant font-body-md">
                    
                    <section id="acceptance" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">1. Acceptance of Terms</h2>
                                <p>
                                    By registering an account with Lemon Academy, accessing our site content, or purchasing any educational course modules or material kits, you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these rules, you must cease using our portal immediately.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    By using Lemon Academy, you agree to follow our rules. If you do not agree, you cannot use the platform.
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="accounts" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">2. Registration & Security</h2>
                                <p>
                                    To access specific video courses, track your progress, or purchase materials, you are required to register an account. You must provide complete, accurate, and up-to-date information during enrollment.
                                </p>
                                <p>
                                    You are responsible for keeping your login credentials secure. Lemon Academy cannot and will not be liable for any losses caused by unauthorized use of your credentials. You must notify us immediately if you suspect any security breaches or unauthorized account use.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Keep your password safe. You are responsible for all actions taken on your account.
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="intellectual" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">3. Intellectual Property</h2>
                                <p>
                                    All contents, including video tutorials, worksheets, course materials, graphical components, text descriptions, and trademarks displayable on Lemon Academy, are owned by or licensed to Lemon Academy and are protected under international copyright regulations.
                                </p>
                                <p>
                                    Enrolling in a course grants you a limited, non-exclusive, non-transferable, and revocable license to view the course materials for personal, non-commercial purposes. You may not distribute, reproduce, sell, or broadcast any course material without explicit permission.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Course videos and resources belong to us. You can watch them for personal learning, but you can't share or sell them.
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="payments" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">4. Fees & Billing</h2>
                                <p>
                                    Certain features, courses, or physical craft kits require the payment of fees. You agree to pay the prices indicated on the checkout page using a valid, supported credit/debit card or third-party processor.
                                </p>
                                <p>
                                    We reserve the right to modify prices for courses, bundles, or kits at any time, but price modifications will not affect courses you have already purchased. All local taxes and shipping fees for kits will be clearly calculated before your transaction is processed.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    All fees are clear up front. Future price changes will never affect courses you already paid for.
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="refunds" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">5. Cancellations & Refunds</h2>
                                <p>
                                    We offer a 14-day refund window for digital courses, provided you have watched less than 20% of the lessons. If you have ordered a course option that includes a craft kit, the kit portion of the fee becomes non-refundable once it has been processed and shipped.
                                </p>
                                <p>
                                    To submit a refund request, you must reach out via our Help Center form or email us at support@lemonacademy.com with your order details.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Digital course refunds are allowed within 14 days if you've completed less than 20% of it. Shipped craft kits cannot be refunded.
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="liability" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">6. Limitation of Liability</h2>
                                <p>
                                    To the maximum extent permitted by law, Lemon Academy, its trainers, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your use of, or inability to use, our courses, tutorials, or craft kit materials.
                                </p>
                                <p>
                                    Crafting activities involve materials and tools (scissors, clay, glass tiles, glue guns) that carry intrinsic safety risks. You are responsible for executing all crafts in a safe workspace under appropriate caution.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Crafting carries minor safety risks. Be careful with tools, as we aren't responsible for accidents.
                                </p>
                            </div>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="governing" className="space-y-4 scroll-mt-24">
                        <div className="flex flex-col md:flex-row gap-6 md:items-start">
                            <div className="flex-1 space-y-4">
                                <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">7. Governing Law</h2>
                                <p>
                                    These Terms of Service and any dispute or claim arising out of them will be governed by and construed in accordance with the local laws of the country where our headquarters are registered, without giving effect to conflicts of law provisions.
                                </p>
                            </div>
                            <div className="md:w-60 shrink-0 bg-surface-container border border-outline-variant/20 p-4 rounded-2xl">
                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded mb-2 inline-block">TL;DR Summary</span>
                                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                                    Any disputes will be resolved under the local jurisdiction of our registered business location.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

            </div>
        </main>
    );
}
