'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function StudentSidebar() {
    const pathname = usePathname();

    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        if (isActive) {
            return "flex items-center gap-3 text-on-primary-fixed-variant font-bold border-l-4 border-primary-fixed bg-primary-container/20 p-3 rounded-r-lg font-label-md text-label-md hover:bg-surface-variant/50 transition-all scale-[0.98] duration-150";
        }
        return "flex items-center gap-3 text-on-surface-variant p-3 rounded-r-lg font-label-md text-label-md hover:bg-surface-variant/50 transition-all";
    };

    return (
        <nav className="bg-surface-container-low dark:bg-surface-container-lowest h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col py-8 px-4 gap-2 z-40 flat no shadows border-r border-outline-variant/20">
            <div className="mb-8 px-3">
                <Link href="/" className="font-display-lg text-display-lg-mobile text-primary block">
                    Lemon Academy
                </Link>
                <p className="font-label-md text-label-md text-on-surface-variant mt-1">Student Portal</p>
            </div>
            <ul className="flex flex-col gap-2 flex-grow">
                <li>
                    <Link className={getLinkClass('/student/dashboard')} href="/student/dashboard">
                        <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/courses')} href="/courses">
                        <span className="material-symbols-outlined" data-icon="school">school</span>
                        My Courses
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/gallery')} href="/gallery">
                        <span className="material-symbols-outlined" data-icon="collections">collections</span>
                        Student Gallery
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/refer-and-earn')} href="/refer-and-earn">
                        <span className="material-symbols-outlined" data-icon="card_giftcard">card_giftcard</span>
                        Refer &amp; Earn
                    </Link>
                </li>
            </ul>
            <div className="mt-auto px-3">
                <Link href="/courses" className="w-full block text-center bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm">
                    Explore Courses
                </Link>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/30">
                    <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                        S
                    </div>
                    <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface">Student</span>
                        <span className="font-body-md text-body-md text-on-surface-variant text-sm">student@lemon.edu</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
