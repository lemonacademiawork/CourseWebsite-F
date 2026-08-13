"use client";
import { usePathname } from 'next/navigation';
import TopNavbar from './TopNavbar';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import TrainerSidebar from './TrainerSidebar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';

    const isAdmin = pathname.startsWith('/admin');
    const isStudent = pathname.startsWith('/student');
    const isTrainer = pathname.startsWith('/trainer');
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    return (
        <>
            {/* TopNavbar only shows on public routes, except auth pages */}
            {!isAdmin && !isStudent && !isTrainer && !isAuthPage && <TopNavbar />}
            
            {/* Sidebars only show on specific domains */}
            {isAdmin && <AdminSidebar />}
            {isStudent && <StudentSidebar />}
            {isTrainer && <TrainerSidebar />}

            {/* Adjust margin for sidebars */}
            <div className={(isAdmin || isStudent || isTrainer) ? "md:ml-64" : "flex flex-col min-h-screen"}>
                <div className="flex-grow">
                    {children}
                </div>
                {!isAdmin && !isStudent && !isTrainer && !isAuthPage && <Footer />}
            </div>
        </>
    );
}
