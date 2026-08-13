'use client';
import Link from 'next/link';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background text-on-background">
            {/* Editorial Hero Section */}
            <section className="pt-10 pb-20 md:pt-16 md:pb-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
                    <div className="lg:col-span-6 space-y-8">
                        <span className="font-label-md text-primary uppercase tracking-widest text-sm">
                            Our Philosophy
                        </span>
                        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface leading-tight">
                            Where Traditional Craft Meets Modern Mastery
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                            At Lemon Academy, we believe creativity is a journey best taken with intent, patience, and expert guidance. We are a digital sanctuary designed to connect passionate learners with master artisans of the craft world.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/courses" className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:opacity-90 transition-opacity hover-lift inline-block text-center">
                                Explore Our Atelier
                            </Link>
                        </div>
                    </div>
                    <div className="lg:col-span-6 relative h-[350px] md:h-[500px] rounded-2xl overflow-hidden organic-shadow">
                        <img
                            alt="Artisan hands crafting pottery"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdWftkk77PEWsXT0X8Idf_5qfShUey9va1f3wum-E0_wQoJNhH8DlzGO1jy22TTPACpLEnQy1abVm1vhUtDsMA62pD83tLRBO8N6-irLAYagp8jz-xagrBPejAcQrBrwZzDiv9yycKXiyMImwz2fXE8Ti75v-LV1oM7TZC1DEpm5zIscCEoA4rnAVGfQcAfxeIOZaJ1Y7It8VGiYZDtwrBh2OS8uEZ9TL5ABRz7RQ6Rwxmr6C65H3E"
                        />
                    </div>
                </div>
            </section>

            {/* Impact/Stats Bento Grid */}
            <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-stretch">
                    <div className="bg-primary text-on-primary p-8 rounded-2xl flex flex-col justify-between space-y-8">
                        <div className="space-y-4">
                            <h3 className="font-display-lg text-3xl leading-snug">Empowering Creators Worldwide</h3>
                            <p className="font-body-md text-on-primary/80 text-sm">
                                Creating a structured path for students, hobbyists, and professional creators to master handcrafted arts.
                            </p>
                        </div>
                        <div className="font-display-lg text-6xl">
                            12k+
                            <span className="block font-label-md text-xs uppercase tracking-wider text-on-primary/70 mt-2">Active Students</span>
                        </div>
                    </div>

                    <div className="bg-surface-container p-8 rounded-2xl flex flex-col justify-between hover-lift">
                        <div className="space-y-4">
                            <span className="material-symbols-outlined text-secondary text-4xl">photo_library</span>
                            <h3 className="font-display-lg text-3xl leading-snug">Join the Community Gallery</h3>
                            <p className="font-body-md text-on-surface-variant text-sm">
                                We celebrate every piece of art created by our students. Share your works and gain appreciation from peers and trainers.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Link href="/gallery" className="border border-outline text-on-surface font-label-md text-sm px-6 py-3 rounded-lg hover:bg-surface-variant transition-colors text-center inline-block w-full">
                                Explore Student Gallery
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
