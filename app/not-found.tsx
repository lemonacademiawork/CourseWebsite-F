'use client';
import Link from 'next/link';

export default function NotFoundPage() {
    return (
        <main className="min-h-screen bg-[#FBF8F1] flex flex-col items-center justify-center px-4 text-center text-xs">
            <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-full text-primary mb-6">
                <span className="material-symbols-outlined text-3xl">question_mark</span>
            </div>
            <h1 className="playfair text-3xl font-bold text-on-surface mb-2">404 - Not Found</h1>
            <p className="text-on-surface-variant max-w-sm mb-8 leading-relaxed">
                Page not found
            </p>
            <Link 
                href="/"
                className="bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
            >
                Back to Home
            </Link>
        </main>
    );
}
