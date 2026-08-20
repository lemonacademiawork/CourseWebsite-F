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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const loadAuthState = () => {
        const loggedIn = localStorage.getItem('is_logged_in') === 'true';
        setIsLoggedIn(loggedIn);
        if (loggedIn) {
            setUserRole(localStorage.getItem('user_role') || 'student');
            
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
        window.addEventListener('auth_state_changed', loadAuthState);
        window.addEventListener('courses_updated', loadAuthState);
        return () => {
            window.removeEventListener('auth_state_changed', loadAuthState);
            window.removeEventListener('courses_updated', loadAuthState);
        };
    }, []);

    const handleLogout = () => {
        const deleteCookie = (name: string) => {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        };
        localStorage.removeItem('is_logged_in');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('auth_token');
        deleteCookie('is_logged_in');
        deleteCookie('user_role');
        deleteCookie('user_email');
        deleteCookie('user_name');
        deleteCookie('auth_token');
        setIsLoggedIn(false);
        setMobileMenuOpen(false);
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

    const getMobileLinkClass = (href: string) => {
        const isActive = pathname === href;
        if (isActive) {
            return "text-primary font-bold block py-2 border-l-4 border-primary pl-3 bg-surface-container-low";
        }
        return "text-on-surface-variant hover:text-primary block py-2 pl-3 transition-colors";
    };

    return (
        <nav className="bg-surface shadow-sm top-0 sticky left-0 right-0 z-50">
            <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto text-xs">
                {/* Logo */}
                <Link href="/" className="font-display-lg text-lg md:text-xl font-bold text-primary">
                    Lemon Academy
                </Link>
                
                {/* Desktop Menu */}
                <ul className="hidden md:flex gap-6 items-center font-medium">
                    <li><Link className={getLinkClass('/')} href="/">Home</Link></li>
                    <li><Link className={getLinkClass('/courses')} href="/courses">Courses</Link></li>
                    <li><Link className={getLinkClass('/blogs')} href="/blogs">Blogs</Link></li>
                    <li><Link className={getLinkClass('/gallery')} href="/gallery">Gallery</Link></li>
                    
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

                {/* Right side login/logout controls */}
                <div className="hidden md:flex items-center gap-3">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            {userRole === 'admin' && (
                                <Link href="/admin/dashboard" className="font-semibold hover:underline text-primary">
                                    Admin Panel
                                </Link>
                            )}
                            {userRole === 'trainer' && (
                                <Link href="/trainer/dashboard" className="font-semibold hover:underline text-primary">
                                    Trainer Dashboard
                                </Link>
                            )}
                            <Link href="/profile" className="font-medium text-on-surface hover:text-primary">
                                Profile
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="bg-surface-variant text-on-surface-variant hover:bg-surface-dim px-4 py-2 rounded-lg font-semibold transition-all"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="font-semibold px-3 py-2 transition-opacity text-primary hover:opacity-90">
                                Login
                            </Link>
                            <Link href="/signup" className="font-semibold px-4 py-2.5 rounded-lg transition-opacity bg-primary text-on-primary hover:opacity-90">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger toggle */}
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-1 rounded-lg text-on-surface"
                >
                    <span className="material-symbols-outlined text-xl">
                        {mobileMenuOpen ? 'close' : 'menu'}
                    </span>
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#FBF8F1] border-b border-outline-variant/30 shadow-lg py-4 px-margin-mobile flex flex-col gap-4 text-xs z-50">
                    <ul className="flex flex-col gap-2 font-medium">
                        <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/')} href="/">Home</Link></li>
                        <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/courses')} href="/courses">Courses</Link></li>
                        <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/blogs')} href="/blogs">Blogs</Link></li>
                        <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/gallery')} href="/gallery">Gallery</Link></li>
                        
                        {isLoggedIn && userRole === 'student' && (
                            <>
                                <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/my-courses')} href="/my-courses">My Courses</Link></li>
                                {hasCourses && (
                                    <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/refer-and-earn')} href="/refer-and-earn">Refer & Earn</Link></li>
                                )}
                                <li><Link onClick={() => setMobileMenuOpen(false)} className={getMobileLinkClass('/become-a-trainer')} href="/become-a-trainer">Become a Trainer</Link></li>
                            </>
                        )}
                    </ul>

                    <div className="flex flex-col gap-2 pt-3 border-t border-outline-variant/20">
                        {isLoggedIn ? (
                            <>
                                {userRole === 'admin' && (
                                    <Link onClick={() => setMobileMenuOpen(false)} href="/admin/dashboard" className="text-primary font-bold py-2 pl-3">
                                        Admin Panel
                                    </Link>
                                )}
                                {userRole === 'trainer' && (
                                    <Link onClick={() => setMobileMenuOpen(false)} href="/trainer/dashboard" className="text-primary font-bold py-2 pl-3">
                                        Trainer Dashboard
                                    </Link>
                                )}
                                <Link onClick={() => setMobileMenuOpen(false)} href="/profile" className="text-on-surface font-semibold py-2 pl-3">
                                    Profile
                                </Link>
                                <button 
                                    onClick={handleLogout}
                                    className="w-full bg-surface-variant text-on-surface-variant py-2.5 rounded-lg font-semibold text-center mt-1"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2">
                                <Link onClick={() => setMobileMenuOpen(false)} href="/login" className="flex-1 text-center border border-outline text-on-surface py-2 rounded-lg font-semibold">
                                    Login
                                </Link>
                                <Link onClick={() => setMobileMenuOpen(false)} href="/signup" className="flex-1 text-center bg-primary text-on-primary py-2 rounded-lg font-semibold">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
