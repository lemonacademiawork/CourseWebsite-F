'use client';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-surface-container-highest dark:bg-surface-container-high border-t border-outline/10 w-full py-12">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter">
                <div className="col-span-1 space-y-4">
                    <div className="font-display-lg text-2xl text-primary">
                        Lemon Academy
                    </div>
                    <p className="font-body-md text-on-surface-variant text-sm max-w-xs">
                        Master the art of handcrafted creation. Learn, create, and inspire with premium craft courses.
                    </p>
                    <p className="font-body-md text-on-surface-variant/70 text-xs">
                        © {new Date().getFullYear()} Lemon Academy. Crafted for creators.
                    </p>
                </div>
                
                <div className="col-span-1 space-y-4">
                    <h4 className="font-label-md text-on-surface text-sm tracking-wider uppercase">Explore</h4>
                    <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                        <li>
                            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
                        </li>
                        <li>
                            <Link href="/gallery" className="hover:text-primary transition-colors">Student Gallery</Link>
                        </li>
                        <li>
                            <Link href="/blogs" className="hover:text-primary transition-colors">Blogs &amp; Stories</Link>
                        </li>
                    </ul>
                </div>

                <div className="col-span-1 space-y-4">
                    <h4 className="font-label-md text-on-surface text-sm tracking-wider uppercase">Community</h4>
                    <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                        <li>
                            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                        </li>
                        <li>
                            <Link href="/become-trainer" className="hover:text-primary transition-colors">Become a Trainer</Link>
                        </li>
                    </ul>
                </div>

                <div className="col-span-1 space-y-4">
                    <h4 className="font-label-md text-on-surface text-sm tracking-wider uppercase">Support</h4>
                    <ul className="space-y-2 font-body-md text-sm text-on-surface-variant">
                        <li>
                            <Link href="/support" className="hover:text-primary transition-colors">Help Center</Link>
                        </li>
                        <li>
                            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
