import Link from 'next/link';

export default function ReferAndEarnPage() {
    return (
        <main className="min-h-screen py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center">
            <h1 className="font-display-lg text-display-lg text-primary mb-6">Refer &amp; Earn</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
                Share your love for Lemon Academy and earn rewards! Invite your friends to join our courses and both of you will receive exclusive discounts on your next enrollment.
            </p>
            <div className="bg-surface-container-low max-w-xl mx-auto rounded-[24px] p-8 md:p-12 border border-outline-variant/30 shadow-sm relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-8">Your Referral Link</h2>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <input 
                        type="text" 
                        value="https://lemon.edu/ref/creative2026" 
                        readOnly
                        className="flex-1 bg-surface-container-lowest border border-outline-variant/50 rounded-lg px-4 py-3 text-on-surface font-body-md focus:outline-none focus:border-primary transition-colors"
                    />
                    <button className="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md hover:opacity-90 transition-opacity">
                        Copy Link
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-left">
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                        <span className="block text-primary text-2xl font-bold mb-1">50%</span>
                        <span className="font-label-md text-on-surface-variant text-sm">Discount for them</span>
                    </div>
                    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20">
                        <span className="block text-primary text-2xl font-bold mb-1">$20</span>
                        <span className="font-label-md text-on-surface-variant text-sm">Credit for you</span>
                    </div>
                </div>
            </div>
        </main>
    );
}
