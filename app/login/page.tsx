'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://lemonwebsite-backend.onrender.com/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 200) {
                // Redirect on successful login
                router.push('/student/dashboard');
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.message || 'Invalid email or password');
            }
        } catch (err) {
            setError('Connection failed. Please check your internet connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FBF8F1] text-[#1C1A17] relative flex items-center justify-center py-12 px-4 overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');
                
                :root {
                    --cream: #FBF8F1;
                    --paper: #FFFDF8;
                    --ink: #1C1A17;
                    --gray: #5B5650;
                    --gold: #8B6914;
                    --gold-deep: #6E5410;
                    --line: #E7E1D3;
                    --tape: #E8C468;
                }

                .playfair {
                    font-family: 'Playfair Display', serif;
                }

                .hero-bg {
                    background-color: #2C3921;
                    background-image: 
                        linear-gradient(100deg, rgba(62, 79, 47, 0.92) 0%, rgba(62, 79, 47, 0.6) 40%, rgba(251, 249, 245, 0.15) 68%),
                        url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyT1MCdKmqH4qQz6XAx6MXb0Axi-FOW5lNIXj_TkLWqr4MYn34W7WnUJv7Kvk2zbyUTytkZbia4wvloS3te02-s_nTY9_mi4dntLpB3ja5l66bjGAUICeB412Hu1i2jCmP8PFP9KFivVeXJ8QkIFamjZ01ylH4hhAJ9Rf5IJE8nyo9PmB7-Jan4omGDc7uBw8_0NUVCUUlbO39hOryEeOPuyj9Gs05zjhhZTYjHDl_TFDXVVQnceuH');
                    background-position: center;
                    background-size: cover;
                    background-repeat: no-repeat;
                }

                .index-card {
                    width: 380px;
                    background: var(--paper);
                    border-radius: 6px;
                    box-shadow: 0 30px 60px -20px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.15);
                    transform: rotate(1.4deg);
                    position: relative;
                }

                .index-card::after {
                    content: "";
                    position: absolute;
                    inset: 10px;
                    border: 1px solid #EDE6D3;
                    pointer-events: none;
                }

                .card-tape {
                    position: absolute;
                    top: -16px;
                    left: 50%;
                    transform: translateX(-50%) rotate(-3deg);
                    width: 96px;
                    height: 34px;
                    background: linear-gradient(180deg, rgba(232,196,104,0.92), rgba(214,171,72,0.92));
                    box-shadow: 0 3px 6px rgba(0,0,0,0.15);
                    opacity: 0.95;
                    z-index: 10;
                }

                .card-tape::before, .card-tape::after {
                    content: "";
                    position: absolute;
                    top: 0; bottom: 0;
                    width: 8px;
                    background: repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.35) 3px, rgba(255,255,255,0.35) 5px);
                }
                .card-tape::before { left: 0; }
                .card-tape::after { right: 0; }

                @media (max-width: 900px) {
                    .hero-bg {
                        background-color: #2C3921;
                        background-image: 
                            linear-gradient(180deg, rgba(62, 79, 47, 0.92) 0%, rgba(62, 79, 47, 0.75) 55%, rgba(62, 79, 47, 0.95) 100%),
                            url('https://lh3.googleusercontent.com/aida-public/AB6AXuCyT1MCdKmqH4qQz6XAx6MXb0Axi-FOW5lNIXj_TkLWqr4MYn34W7WnUJv7Kvk2zbyUTytkZbia4wvloS3te02-s_nTY9_mi4dntLpB3ja5l66bjGAUICeB412Hu1i2jCmP8PFP9KFivVeXJ8QkIFamjZ01ylH4hhAJ9Rf5IJE8nyo9PmB7-Jan4omGDc7uBw8_0NUVCUUlbO39hOryEeOPuyj9Gs05zjhhZTYjHDl_TFDXVVQnceuH');
                    }
                    .index-card {
                        width: 100%;
                        max-width: 380px;
                        transform: rotate(0.6deg);
                    }
                }

                @keyframes imageEntrance {
                    from {
                        opacity: 0;
                        filter: blur(12px);
                        transform: scale(1.08);
                    }
                    to {
                        opacity: 1;
                        filter: blur(0px);
                        transform: scale(1);
                    }
                }

                .animate-image-entrance {
                    animation: imageEntrance 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
            `}} />

            {/* Background Hero Banner Image */}
            <div className="absolute inset-0 hero-bg z-0 animate-image-entrance"></div>

            <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                
                {/* Left Side: Copy */}
                <div className="lg:col-span-7 text-[#FBF8F1] max-w-[520px] mx-auto lg:mx-0 text-center lg:text-left space-y-6">
                    <span className="text-[12.5px] tracking-[2.5px] uppercase text-[#E8C468] font-semibold block">
                        Member Login
                    </span>
                    <h1 className="playfair font-bold text-4xl md:text-5xl lg:text-6xl leading-[1.08]">
                        Your workbench<br/>missed you, <em className="italic font-semibold text-[#E8C468] not-italic">maker.</em>
                    </h1>
                    <p className="text-[16px] leading-[1.6] text-[#E9E3D5] max-w-[400px] mx-auto lg:mx-0">
                        Pick up your resin pour, your Lippan piece, your half-finished course. Everything's exactly where you left it.
                    </p>
                </div>

                {/* Right Side: Index Card Form */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end">
                    <div className="index-card p-9 md:p-10">
                        <div className="card-tape"></div>
                        <h2 className="playfair font-bold text-[27px] mt-2 mb-1">Welcome back</h2>
                        <p className="text-[13.5px] text-[#5B5650] mb-6">Log in to continue your creative journey.</p>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded p-2.5 mb-4">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-[6px]">
                                <label className="block text-[11.5px] font-semibold tracking-[0.6px] uppercase text-[#5B5650]">
                                    Email address
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="you@example.com"
                                    className="w-full py-2 bg-transparent border-b-[1.5px] border-[#E7E1D3] font-body-md text-[15px] text-[#1C1A17] outline-none focus:border-[#8B6914] transition-all placeholder-[#C2BAA5]"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-[6px]">
                                <label className="block text-[11.5px] font-semibold tracking-[0.6px] uppercase text-[#5B5650]">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full py-2 bg-transparent border-b-[1.5px] border-[#E7E1D3] font-body-md text-[15px] text-[#1C1A17] outline-none focus:border-[#8B6914] transition-all placeholder-[#C2BAA5]"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-[13px] pt-2">
                                <label className="flex items-center gap-[7px] text-[#5B5650] cursor-pointer select-none">
                                    <input type="checkbox" className="w-[14px] h-[14px] accent-[#6E5410] cursor-pointer" />
                                    Remember me
                                </label>
                                <Link href="#" className="text-[#6E5410] hover:underline font-semibold">
                                    Forgot password?
                                </Link>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-[14px] border-none rounded-[4px] bg-[#6E5410] text-white font-semibold text-[14.5px] tracking-[0.3px] cursor-pointer hover:bg-[#5c4610] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Logging In...' : 'Log In'}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                            </button>
                        </form>

                        <p className="text-center text-[13px] text-[#5B5650] mt-[20px]">
                            New here?{' '}
                            <Link href="/signup" className="font-semibold text-[#6E5410] hover:underline">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}
