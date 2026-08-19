'use client';

import { useState } from 'react';

interface FAQ {
    id: number;
    category: string;
    question: string;
    answer: string;
}

const CATEGORIES = [
    { id: 'all', label: 'All Topics', icon: 'help' },
    { id: 'general', label: 'General Info', icon: 'info' },
    { id: 'courses', label: 'Course Access', icon: 'school' },
    { id: 'kits', label: 'Craft Kits & Delivery', icon: 'package_2' },
    { id: 'billing', label: 'Billing & Refunds', icon: 'payments' },
];

const FAQS: FAQ[] = [
    {
        id: 1,
        category: 'courses',
        question: 'How long do I have access to my courses?',
        answer: 'You have lifetime access to any course you purchase! You can learn at your own pace, rewatch lessons as many times as you like, and access all future updates to the course material.'
    },
    {
        id: 2,
        category: 'kits',
        question: 'Are craft materials and kits included in the course price?',
        answer: 'It depends on the course option you choose. We offer both "Course Only" and "Course + Premium Kit" packages. If you choose the Kit package, a curated box of premium materials will be shipped to your address.'
    },
    {
        id: 3,
        category: 'billing',
        question: 'What is your refund policy?',
        answer: 'We want you to love your crafting experience! If you are unsatisfied, you can request a full refund within 14 days of purchase, provided you have not completed more than 20% of the course content. Note that kits are non-refundable once shipped.'
    },
    {
        id: 4,
        category: 'general',
        question: 'Can I interact with the trainers or ask questions?',
        answer: 'Yes, absolutely! Each course includes a dedicated discussion board where you can post photos of your progress, ask questions, and receive personalized feedback directly from the trainer.'
    },
    {
        id: 5,
        category: 'courses',
        question: 'Can I download the course videos for offline viewing?',
        answer: 'To protect our trainers\' intellectual property, videos cannot be downloaded. However, our web platform is optimized for mobile and desktop browsers so you can stream your lessons smoothly anywhere.'
    },
    {
        id: 6,
        category: 'kits',
        question: 'How long does shipping take for the craft kits?',
        answer: 'Kits are packed and shipped within 2 business days of order confirmation. Domestic shipping typically takes 3 to 7 business days. You will receive a tracking link via email once your kit is shipped.'
    },
    {
        id: 7,
        category: 'billing',
        question: 'Do you offer certificates upon completion?',
        answer: 'Yes! Upon successfully completing all modules of a course and submitting your final project photo, a personalized digital Lemon Academy Certificate of Completion will be generated for you.'
    }
];

export default function HelpCenter() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    // Form states
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const toggleFaq = (id: number) => {
        setOpenFaqId(openFaqId === id ? null : id);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setFormSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 600);
    };

    // Filter FAQs based on category and search query
    const filteredFaqs = FAQS.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <main className="bg-surface min-h-screen text-on-surface py-12">
            {/* Hero Section */}
            <div className="max-w-[1200px] mx-auto px-4 text-center mb-16">
                <span className="bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full inline-block mb-3">
                    Support
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 playfair">
                    How can we help you?
                </h1>
                <p className="text-on-surface-variant max-w-lg mx-auto mb-8 text-sm md:text-base">
                    Find answers to common questions about courses, kits, and billing, or reach out to our team directly.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant">
                        search
                    </span>
                    <input
                        type="text"
                        placeholder="Search for questions, keywords, topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface-container border border-outline-variant/35 focus:border-primary focus:outline-none transition-all shadow-sm text-on-surface"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Categories and FAQs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Categories Nav */}
                    <div className="flex flex-wrap gap-2.5">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all text-xs font-medium ${
                                    selectedCategory === cat.id
                                        ? 'bg-primary text-white border-primary shadow-sm'
                                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface-variant'
                                }`}
                            >
                                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* FAQ List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold tracking-wide mb-6">Frequently Asked Questions</h2>
                        
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map(faq => {
                                const isOpen = openFaqId === faq.id;
                                return (
                                    <div 
                                        key={faq.id}
                                        className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl overflow-hidden transition-all shadow-sm"
                                    >
                                        <button
                                            onClick={() => toggleFaq(faq.id)}
                                            className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                                        >
                                            <span className="font-semibold text-sm md:text-base text-on-surface pr-4">
                                                {faq.question}
                                            </span>
                                            <span className={`material-symbols-outlined transition-transform duration-300 text-primary ${
                                                isOpen ? 'rotate-180' : ''
                                            }`}>
                                                keyboard_arrow_down
                                            </span>
                                        </button>
                                        
                                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                            isOpen ? 'max-h-[300px] border-t border-outline-variant/10' : 'max-h-0'
                                        }`}>
                                            <div className="p-6 text-sm text-on-surface-variant leading-relaxed bg-surface-container-low/30">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/50">
                                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">find_in_page</span>
                                <p className="text-on-surface-variant text-sm font-medium">No results found for your search.</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                                    className="mt-3 text-xs text-primary font-semibold hover:underline"
                                >
                                    Clear filters and try again
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Contact Form */}
                <div className="col-span-1">
                    <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 md:p-8 sticky top-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined">mail</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-base text-on-surface">Still need help?</h3>
                                <p className="text-xs text-on-surface-variant">Send a support request to our team.</p>
                            </div>
                        </div>

                        {formSubmitted ? (
                            <div className="text-center py-8 space-y-4 animate-fade-in">
                                <div className="w-16 h-16 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center mx-auto">
                                    <span className="material-symbols-outlined text-3xl">check_circle</span>
                                </div>
                                <h4 className="font-bold text-lg text-on-surface">Ticket Submitted!</h4>
                                <p className="text-xs text-on-surface-variant max-w-[240px] mx-auto leading-relaxed">
                                    Thank you! We have received your query and our team will get back to you within 24 hours.
                                </p>
                                <button 
                                    onClick={() => setFormSubmitted(false)}
                                    className="text-xs font-semibold text-primary hover:underline pt-2"
                                >
                                    Submit another request
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm text-on-surface"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm text-on-surface"
                                        placeholder="e.g. john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm text-on-surface"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm text-on-surface resize-none"
                                        placeholder="Describe your issue or query..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow text-xs tracking-wider uppercase flex items-center justify-center gap-2"
                                >
                                    Send Message
                                    <span className="material-symbols-outlined text-sm">send</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}
