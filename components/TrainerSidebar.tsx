'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TrainerSidebar() {
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
                <Link href="/" className="text-primary block whitespace-nowrap font-bold hover:opacity-85 transition-opacity" style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Lemon Academy
                </Link>
                <p className="text-[10px] text-on-surface-variant mt-0.5 tracking-wider uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Trainer Portal</p>
            </div>
            <ul className="flex flex-col gap-1 flex-grow">
                <li>
                    <Link className={getLinkClass('/trainer/dashboard')} href="/trainer/dashboard">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="dashboard">dashboard</span>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/courses')} href="/trainer/courses">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="school">school</span>
                        My Courses
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/students')} href="/trainer/students">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="group">group</span>
                        Students
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/classes')} href="/trainer/classes">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="video_camera_front">video_camera_front</span>
                        Live Classes
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/resources')} href="/trainer/resources">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="folder">folder</span>
                        Resources
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/blogs')} href="/trainer/blogs">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="article">article</span>
                        Blogs
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/gallery')} href="/trainer/gallery">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="image">image</span>
                        Gallery
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/profile')} href="/trainer/profile">
                        <span className="material-symbols-outlined !text-[18px]" data-icon="person">person</span>
                        Profile
                    </Link>
                </li>
            </ul>
            <div className="mt-auto px-3">
                <button 
                    onClick={() => {
                        localStorage.removeItem('is_logged_in');
                        localStorage.removeItem('user_role');
                        localStorage.removeItem('user_email');
                        localStorage.removeItem('user_name');
                        localStorage.removeItem('auth_token');
                        window.dispatchEvent(new Event('auth_state_changed'));
                        window.location.href = '/';
                    }}
                    className="w-full text-center bg-surface-container-highest text-on-surface font-semibold text-[13px] py-2 rounded-md hover:bg-surface-variant transition-colors shadow-sm"
                >
                    Logout
                </button>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-outline-variant/30">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                        T
                    </div>
                    <div className="flex flex-col">
                        <span className="font-label-md text-label-md text-on-surface">Trainer</span>
                        <span className="font-body-md text-body-md text-on-surface-variant text-sm">trainer@lemon.edu</span>
                    </div>
                </div>
            </div>
        </nav>
    );
}
