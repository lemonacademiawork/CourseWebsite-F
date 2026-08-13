'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNavbar() {
    const pathname = usePathname();

    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        if (isActive) {
            return "text-primary border-b-2 border-primary pb-1";
        }
        return "text-on-surface-variant hover:text-primary transition-colors duration-200";
    };

    return (
        <nav className="bg-surface shadow-sm docked full-width top-0 sticky z-50">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
                <Link href="/" className="font-display-lg text-xl md:text-2xl text-primary font-bold">
                    Lemon Academy
                </Link>
                <ul className="hidden md:flex gap-gutter items-center font-body-md text-body-md">
                    <li><Link className={getLinkClass('/')} href="/">Home</Link></li>
                    <li><Link className={getLinkClass('/courses')} href="/courses">Courses</Link></li>
                    <li><Link className={getLinkClass('/blogs')} href="/blogs">Blogs</Link></li>
                    <li><Link className={getLinkClass('/gallery')} href="/gallery">Gallery</Link></li>
                    <li><Link className={getLinkClass('/about')} href="/about">About</Link></li>
                </ul>
                <div className="flex items-center gap-4">
                    <button className="md:hidden text-on-surface">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <Link href="/login" className="hidden md:block text-primary font-label-md text-label-md px-4 py-2 hover:opacity-90 transition-opacity">
                        Login
                    </Link>
                    <Link href="/signup" className="hidden md:block bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}
