"use client";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TopNavbar from './TopNavbar';
import AdminSidebar from './AdminSidebar';
import TrainerSidebar from './TrainerSidebar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || '';
    const router = useRouter();

    const [authLoading, setAuthLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');

    const getCookie = (name: string) => {
        if (typeof document === 'undefined') return '';
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)'));
        return match ? decodeURIComponent(match[2]) : '';
    };

    const verifyAccess = () => {
        const loggedIn = localStorage.getItem('is_logged_in') === 'true' || getCookie('is_logged_in') === 'true';
        const role = localStorage.getItem('user_role') || getCookie('user_role') || '';
        
        setIsLoggedIn(loggedIn);
        setUserRole(role);

        const isAdminRoute = pathname.startsWith('/admin');
        const isTrainerRoute = pathname.startsWith('/trainer');
        
        const isStudentRoute = pathname.startsWith('/my-courses') || 
                               pathname === '/refer-and-earn' || 
                               pathname === '/become-a-trainer' || 
                               pathname === '/profile';

        if (isAdminRoute && role !== 'admin') {
            if (!loggedIn) {
                router.push(`/login?returnUrl=${pathname}`);
            } else {
                router.push('/403');
            }
            return;
        }

        if (isTrainerRoute && role !== 'trainer') {
            if (!loggedIn) {
                router.push(`/login?returnUrl=${pathname}`);
            } else {
                router.push('/403');
            }
            return;
        }

        if (isStudentRoute && !loggedIn) {
            router.push(`/login?returnUrl=${pathname}`);
            return;
        }

        setAuthLoading(false);
    };

    useEffect(() => {
        verifyAccess();
        
        // Setup listener for auth state updates
        window.addEventListener('auth_state_changed', verifyAccess);
        return () => window.removeEventListener('auth_state_changed', verifyAccess);
    }, [pathname]);

    const isAdmin = pathname.startsWith('/admin') && userRole === 'admin';
    const isTrainer = pathname.startsWith('/trainer') && userRole === 'trainer';
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (authLoading && (pathname.startsWith('/admin') || pathname.startsWith('/trainer') || pathname.startsWith('/my-courses') || pathname === '/refer-and-earn' || pathname === '/become-a-trainer' || pathname === '/profile')) {
        return (
            <div className="min-h-screen bg-[#FBF8F1] flex items-center justify-center text-xs text-on-surface-variant">
                <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-xl text-primary">autorenew</span>
                    <span>Loading workspace...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* TopNavbar only shows on public/student routes, except auth pages */}
            {!isAdmin && !isTrainer && !isAuthPage && <TopNavbar />}
            
            {/* Sidebars only show on specific roles and paths */}
            {isAdmin && <AdminSidebar />}
            {isTrainer && <TrainerSidebar />}

            {/* Adjust margin for sidebars */}
            <div className={(isAdmin || isTrainer) ? "md:ml-60" : "flex flex-col min-h-screen"}>
                <div className="flex-grow">
                    {children}
                </div>
                {!isAdmin && !isTrainer && !isAuthPage && <Footer />}
            </div>
        </>
    );
}
