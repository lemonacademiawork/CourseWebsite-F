'use client';
import { useState } from 'react';

export default function BecomeaTrainerPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [course, setCourse] = useState('');
    const [runningDates, setRunningDates] = useState('');
    const [experience, setExperience] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');

    const scrollToForm = () => {
        const formElement = document.getElementById('application-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const applicationData = {
            name,
            email,
            course,
            runningDates: runningDates || 'Awaiting Schedule',
            experience,
            portfolioUrl,
            status: 'Pending Approval'
        };

        try {
            // Attempt to send to backend API
            const res = await fetch('https://lemonwebsite-backend.onrender.com/api/v1/trainers/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData),
            });

            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Failed to submit application. Please try again.');
            }
        } catch (err) {
            console.warn('Backend connection failed or blocked by CORS. Saving locally as mock...');
            
            // Mock Fallback: Save application in localStorage so it can show up or be verified
            const existingApps = JSON.parse(localStorage.getItem('mock_applications') || '[]');
            existingApps.push({
                id: Date.now(),
                ...applicationData
            });
            localStorage.setItem('mock_applications', JSON.stringify(existingApps));
            
            setSubmitted(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow min-h-screen text-xs bg-[#FBF8F1]">
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 px-margin-mobile md:px-margin-desktop overflow-hidden">
                <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #ffe17a 0%, transparent 40%), radial-gradient(circle at 0% 100%, #fe9d7a 0%, transparent 40%)" }}></div>
                
                <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-semibold tracking-wider uppercase text-[10px]">
                            Join Our Community
                        </span>
                        <h1 className="playfair text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface leading-tight">
                            Turn Your Creativity <br className="hidden lg:block" />Into Teaching
                        </h1>
                        <p className="text-sm text-on-surface-variant max-w-lg leading-relaxed">
                            Share your unique craft, mentor aspiring artists, and build a rewarding career from anywhere. Lemon Academy provides the premium platform—you bring the passion.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button 
                                onClick={scrollToForm}
                                className="bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                Start Application
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                            <button 
                                onClick={() => {
                                    document.getElementById('why-teach')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-6 py-3 rounded-lg font-semibold border border-outline text-on-surface hover:bg-surface-variant/20 transition-all"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="relative h-[320px] md:h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                        <img 
                            className="w-full h-full object-cover" 
                            alt="Artisan workspace"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5LmlZ0t1hDNKF5z6VzHOUUkes637bm8NdHeJKS4I-yRIiq_mrjFreIludcM9voNh2ix4MUs9o4IOLywNRVKXnZDfOoFqKZD9OiYBYgNDHJFYKpPYs7CbzJIa6IJlp1ET1MrjKXV11HfKMTNlVwj9Z3A_jTNbe9P6mQF3eWCN_w3ehhZwIdBrnyLnmbMAV_-YQHlfmJ6eTvj4zDZg2fgPR_G51icBt25fOtnzASCHkzQfXAgnHmRUd" 
                        />
                    </div>
                </div>
            </section>

            {/* Why Teach Section */}
            <section id="why-teach" className="py-16 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest border-t border-b border-outline-variant/30">
                <div className="max-w-container-max mx-auto">
                    <div className="text-center mb-12 space-y-2">
                        <h2 className="playfair text-2xl font-bold text-on-surface">Why Teach with Us?</h2>
                        <p className="text-xs text-on-surface-variant max-w-2xl mx-auto">
                            We provide the tools, audience, and support so you can focus on what you do best: inspiring the next generation of creators.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20 flex flex-col items-start">
                            <div className="w-10 h-10 rounded-full bg-tertiary-container/30 flex items-center justify-center mb-4 text-tertiary">
                                <span className="material-symbols-outlined text-base">psychology</span>
                            </div>
                            <h3 className="text-xs font-bold text-on-surface mb-2">Develop Teaching Skills</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Access our exclusive trainer resources, workshops, and peer feedback to refine your instructional techniques and curriculum design.
                            </p>
                        </div>
                        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20 flex flex-col items-start">
                            <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center mb-4 text-secondary">
                                <span className="material-symbols-outlined text-base">groups</span>
                            </div>
                            <h3 className="text-xs font-bold text-on-surface mb-2">Reach Global Learners</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Connect with a passionate community of students worldwide. Your expertise deserves a broader audience than just your local studio.
                            </p>
                        </div>
                        <div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant/20 flex flex-col items-start">
                            <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center mb-4 text-primary">
                                <span className="material-symbols-outlined text-base">storefront</span>
                            </div>
                            <h3 className="text-xs font-bold text-on-surface mb-2">Build Your Profile</h3>
                            <p className="text-on-surface-variant leading-relaxed">
                                Establish yourself as an authority in your craft. Earn reviews, showcase student work, and build a portfolio that attracts new opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Application Form Section */}
            <section id="application-form" className="py-20 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-[600px] mx-auto bg-surface-container-lowest rounded-2xl p-6 md:p-10 border border-outline-variant/40 shadow-sm">
                    {submitted ? (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
                                <span className="material-symbols-outlined text-2xl">check_circle</span>
                            </div>
                            <h2 className="playfair text-xl font-bold text-on-surface">Application Submitted!</h2>
                            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                                Thank you for applying to become a trainer at Lemon Academy. Our curriculum team will review your details and portfolio, and get back to you within 3-5 business days.
                            </p>
                            <button 
                                onClick={() => setSubmitted(false)}
                                className="mt-4 bg-primary text-on-primary px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                            >
                                Apply for another course
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h2 className="playfair text-xl font-bold text-on-surface mb-1">Trainer Application Form</h2>
                                <p className="text-xs text-on-surface-variant">Fill in the form below to apply as an instructor.</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded p-2.5 mb-4">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleApply} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-on-surface-variant mb-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:outline-none" 
                                            placeholder="e.g. Priya Sharma"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-on-surface-variant mb-1">Email Address</label>
                                        <input 
                                            type="email" 
                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:outline-none" 
                                            placeholder="e.g. priya@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-on-surface-variant mb-1">Course/Craft Subject</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:outline-none" 
                                            placeholder="e.g. Lippan Art Fundamentals"
                                            value={course}
                                            onChange={(e) => setCourse(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-on-surface-variant mb-1">Proposed Class Dates/Times</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:outline-none" 
                                            placeholder="e.g. Mon, Wed, Fri (2:30 PM)"
                                            value={runningDates}
                                            onChange={(e) => setRunningDates(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-on-surface-variant mb-1">Years of Creative Experience</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:outline-none" 
                                            placeholder="e.g. 5 years"
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-on-surface-variant mb-1">Portfolio Link / Website</label>
                                        <input 
                                            type="url" 
                                            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:outline-none" 
                                            placeholder="e.g. https://myportfolio.com"
                                            value={portfolioUrl}
                                            onChange={(e) => setPortfolioUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 shadow-sm mt-2 disabled:opacity-50"
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
