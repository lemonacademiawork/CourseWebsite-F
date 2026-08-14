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
            <ul className="flex flex-col gap-2 flex-grow">
                <li>
                    <Link className={getLinkClass('/trainer/dashboard')} href="/trainer/dashboard">
                        <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link className={getLinkClass('/trainer/editor')} href="/trainer/editor">
                        <span className="material-symbols-outlined" data-icon="edit">edit</span>
                        Course Editor
                    </Link>
                </li>
            </ul>
            <div className="mt-auto px-3">
                <Link href="/login" className="w-full block text-center bg-surface-container-highest text-on-surface font-label-md text-label-md py-3 rounded-lg hover:bg-surface-variant transition-colors shadow-sm">
                    Logout
                </Link>
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
