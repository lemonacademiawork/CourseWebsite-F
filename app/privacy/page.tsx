'use client';

import { useState, useEffect } from 'react';

const SECTIONS = [
    { id: 'introduction', label: 'Introduction' },
    { id: 'collection', label: '1. Information We Collect' },
    { id: 'usage', label: '2. How We Use Information' },
    { id: 'sharing', label: '3. Sharing & Disclosures' },
    { id: 'security', label: '4. Data Security' },
    { id: 'cookies', label: '5. Cookies & Tracking' },
    { id: 'rights', label: '6. Your Privacy Rights' },
    { id: 'updates', label: '7. Policy Updates' },
];

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState('introduction');

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
                <span className="bg-tertiary-container text-on-tertiary-container text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full inline-block mb-3">
                    Legal
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-2 playfair">
                    Privacy Policy
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
                        <h4 className="font-bold text-xs uppercase tracking-wider text-outline mb-2">Table of Contents</h4>
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

                {/* Main Content Pane */}
                <div className="lg:col-span-3 space-y-12 leading-relaxed text-sm md:text-base text-on-surface-variant font-body-md">
                    
                    <section id="introduction" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">Introduction</h2>
                        <p>
                            Welcome to Lemon Academy! We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how we collect, use, process, and safeguard your data when you visit our website, enroll in our craft courses, or purchase our premium materials and kits.
                        </p>
                        <div className="bg-tertiary/10 border-l-4 border-tertiary p-5 rounded-r-2xl my-6">
                            <h4 className="font-bold text-tertiary text-xs uppercase tracking-wider mb-1">Key Takeaway</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                We only collect the minimal amount of personal data required to deliver premium courses and craft kits. We never sell your personal information to third parties.
                            </p>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="collection" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">1. Information We Collect</h2>
                        <p>
                            We collect information that you voluntarily provide to us and certain information that is generated automatically when you interact with our platform.
                        </p>
                        <ul className="list-disc pl-5 space-y-2.5 text-sm">
                            <li>
                                <strong className="text-on-surface">Account Information:</strong> When you register, we collect your name, email address, password, and profile preferences.
                            </li>
                            <li>
                                <strong className="text-on-surface">Billing and Shipping Details:</strong> For course enrollments and kit purchases, we collect billing addresses, shipping addresses, and phone numbers. Payment card details are processed directly by our secure payment partners and are not stored in our servers.
                            </li>
                            <li>
                                <strong className="text-on-surface">Course Activity & Content:</strong> We track your course progress, video completion rates, quiz scores, certificate generation, and any comments, photos, or discussion posts you submit.
                            </li>
                            <li>
                                <strong className="text-on-surface">Technical Usage Data:</strong> IP addresses, browser type, device information, and site interaction statistics collected via cookies and trackers.
                            </li>
                        </ul>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="usage" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">2. How We Use Information</h2>
                        <p>
                            Lemon Academy processes your personal information for purposes based on legitimate business interests, fulfillment of our contract with you, compliance with legal obligations, and/or your consent.
                        </p>
                        <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6">
                            <h3 className="font-bold text-sm text-on-surface mb-3 uppercase tracking-wider">Primary Purposes:</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                <li className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    <span>Providing, managing, and updating our online learning dashboard and tools.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    <span>Packaging, shipping, tracking, and coordinating your craft kits.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    <span>Processing secure transactions and preventing billing fraud.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span>
                                    <span>Sending transactional updates, course notifications, and support emails.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="sharing" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">3. Sharing & Disclosures</h2>
                        <p>
                            We share your information only with trusted service providers who perform operations vital to our business, under strict confidentiality agreements.
                        </p>
                        <p className="text-sm">
                            These include payment processors (e.g. Stripe), shipping and courier agencies, web hosting providers, and customer support tool suites. We may also disclose information to law enforcement agencies if required by subpoena or applicable statutory laws.
                        </p>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="security" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">4. Data Security</h2>
                        <p>
                            We implement industry-standard administrative, physical, and technical security protocols to secure your personal data. This includes Secure Socket Layer (SSL/TLS) encryption for database records and payment transfers.
                        </p>
                        <div className="bg-secondary/5 border-l-4 border-secondary p-5 rounded-r-2xl my-6">
                            <h4 className="font-bold text-secondary text-xs uppercase tracking-wider mb-1">User Responsibility</h4>
                            <p className="text-xs text-on-surface-variant leading-relaxed">
                                While we strive to protect your data, no network transmission can be guaranteed 100% secure. You are responsible for keeping your login credentials and password highly confidential.
                            </p>
                        </div>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="cookies" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">5. Cookies & Tracking</h2>
                        <p>
                            We use cookies to analyze web traffic, remember user preferences (like dark mode and login sessions), and personalize your overall website experience. You can choose to accept or decline cookies through your browser settings, though this may restrict full access to certain parts of the academy workspace.
                        </p>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="rights" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">6. Your Privacy Rights</h2>
                        <p>
                            Depending on your physical location (e.g. EU GDPR or California CCPA), you hold specific privacy rights regarding your data:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center mt-4">
                            <div className="bg-surface-container-low border border-outline-variant/20 p-5 rounded-2xl">
                                <span className="material-symbols-outlined text-primary text-2xl mb-1">visibility</span>
                                <h4 className="font-bold text-xs text-on-surface mb-1">Right to Access</h4>
                                <p className="text-[10px] text-on-surface-variant">Request details and copies of the personal info we store.</p>
                            </div>
                            <div className="bg-surface-container-low border border-outline-variant/20 p-5 rounded-2xl">
                                <span className="material-symbols-outlined text-primary text-2xl mb-1">edit_square</span>
                                <h4 className="font-bold text-xs text-on-surface mb-1">Right to Rectify</h4>
                                <p className="text-[10px] text-on-surface-variant">Correct inaccurate, outdated, or incomplete profiles.</p>
                            </div>
                            <div className="bg-surface-container-low border border-outline-variant/20 p-5 rounded-2xl">
                                <span className="material-symbols-outlined text-primary text-2xl mb-1">delete</span>
                                <h4 className="font-bold text-xs text-on-surface mb-1">Right to Delete</h4>
                                <p className="text-[10px] text-on-surface-variant">Request total erasure of your account and personal records.</p>
                            </div>
                        </div>
                        <p className="text-xs text-center mt-4">
                            To exercise any of these options, please email our privacy team at <a href="mailto:privacy@lemonacademy.com" className="text-primary font-bold hover:underline">privacy@lemonacademy.com</a>.
                        </p>
                    </section>

                    <hr className="border-outline-variant/25" />

                    <section id="updates" className="space-y-4 scroll-mt-24">
                        <h2 className="text-xl md:text-2xl font-extrabold text-on-surface playfair">7. Policy Updates</h2>
                        <p>
                            We may update this Privacy Policy from time to time to align with legal, technical, or business changes. When updated, we will post the revised date at the top of this page. We encourage you to review this page periodically to stay informed about how we protect your information.
                        </p>
                    </section>

                </div>

            </div>
        </main>
    );
}
