'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function TopNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('student');
    const [hasCourses, setHasCourses] = useState(false);

    const loadAuthState = () => {
        const loggedIn = localStorage.getItem('is_logged_in') === 'true';
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            setUserRole(localStorage.getItem('user_role') || 'student');
            
            // Check purchased courses for Refer & Earn eligibility
            const purchased = localStorage.getItem('purchased_courses');
            if (purchased) {
                try {
                    const list = JSON.parse(purchased);
                    setHasCourses(Array.isArray(list) && list.length > 0);
                } catch {
                    setHasCourses(false);
                }
            } else {
                setHasCourses(false);
            }
        }
    };

    useEffect(() => {
        loadAuthState();
        
        // Listen for custom login/purchase events to update navbar state
        window.addEventListener('auth_state_changed', loadAuthState);
        window.addEventListener('courses_updated', loadAuthState);
        return () => {
            window.removeEventListener('auth_state_changed', loadAuthState);
            window.removeEventListener('courses_updated', loadAuthState);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('auth_token');
        setIsLoggedIn(false);
        router.push('/');
        window.dispatchEvent(new Event('auth_state_changed'));
    };

    const getLinkClass = (href: string) => {
        const isActive = pathname === href;
        if (isActive) {
            return "text-primary border-b-2 border-primary pb-1 font-semibold";
        }
        return "text-on-surface-variant hover:text-primary transition-colors duration-200";
    };

    return (
        <nav className="bg-surface shadow-sm top-0 sticky z-50">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto text-xs">
                <Link href="/" className="font-display-lg text-lg md:text-xl text-primary font-bold">
                    Lemon Academy
                </Link>
                
                <ul className="hidden md:flex gap-6 items-center font-medium">
                    <li><Link className={getLinkClass('/')} href="/">Home</Link></li>
                    <li><Link className={getLinkClass('/courses')} href="/courses">Courses</Link></li>
                    <li><Link className={getLinkClass('/blogs')} href="/blogs">Blogs</Link></li>
                    <li><Link className={getLinkClass('/gallery')} href="/gallery">Gallery</Link></li>
                    
                    {/* Student logged in additional routes */}
                    {isLoggedIn && userRole === 'student' && (
                        <>
                            <li><Link className={getLinkClass('/my-courses')} href="/my-courses">My Courses</Link></li>
                            {hasCourses && (
                                <li><Link className={getLinkClass('/refer-and-earn')} href="/refer-and-earn">Refer & Earn</Link></li>
                            )}
                            <li><Link className={getLinkClass('/become-a-trainer')} href="/become-a-trainer">Become a Trainer</Link></li>
                        </>
                    )}
                </ul>

                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            {userRole === 'admin' && (
                                <Link href="/admin/dashboard" className="text-primary font-semibold hover:underline">
                                    Admin Panel
                                </Link>
                            )}
                            {userRole === 'trainer' && (
                                <Link href="/trainer/dashboard" className="text-primary font-semibold hover:underline">
                                    Trainer Dashboard
                                </Link>
                            )}
                            <Link href="/profile" className="text-on-surface hover:text-primary font-medium">
                                Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-surface-variant text-on-surface-variant px-4 py-2 rounded-lg hover:bg-surface-dim transition-colors font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-primary font-semibold px-3 py-2 hover:opacity-90 transition-opacity">
                                Login
                            </Link>
                            <Link href="/signup" className="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
