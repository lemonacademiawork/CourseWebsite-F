'use client';
import { useState } from 'react';
import Link from 'next/link';

interface BlogPost {
    id: number;
    title: string;
    excerpt: string;
    category: string;
    categoryColor: string;
    image: string;
    date: string;
    author: string;
    readTime: string;
}

const ALL_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "10 Essential Tools for Lippan Art Beginners",
        excerpt: "Discover the must-have tools, mud pastes, and mirrors to start your journey into the beautiful world of traditional Gujarati Lippan Art without making mess.",
        category: "Crafting Tips",
        categoryColor: "bg-primary-container text-on-primary-container",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXiQLIEpsHtGrZbryHVG2dOarl_iT9qvnszntbv8Io-HDvulcLxdeW-m1Y1LvLsZVTdyll6k3sqZuLN0jnUa8PmjFtQMe1mAq8CIzvCN0yaT2ObdUfIPU2XuH0CbkJ-ZzjHMPf30gtRgX14D6XM6dRo4nkeus9cqsp61icBWZjJAhChFKP93gBX9kTPkDU0dKVth2hhMx3C1QEtY_8tkNWkbpTpJ4ASJfAgMhyr-lLHkbEwd9CJP6X",
        date: "Aug 10, 2026",
        author: "Meera Nair",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "The Alchemy of Resin: Mastering Curing & Micro-bubbles",
        excerpt: "Tired of cloudy finishes and pesky air pockets? Our master artisan breaks down room temperature control and pouring heights for crystal clear pours.",
        category: "Materials Guide",
        categoryColor: "bg-tertiary-fixed text-on-tertiary-fixed",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy_buYnpjKfjRTyIf3XQ4SNX1F_mcq0L-hg4lny14eYJzf7Bwtuw91_n-0PsBT2hdqKBiZtqfHvzPj8K79SpzOVcuH5lJ_Xb-i3oORdHHh0430xLqp6qhligPWzFUjk3vxgs_KF2PiRX-2JQr6LN72XOGb2W66Jx5LwPzy0T88fGx-weg-dtLvZD2SSLhMeqlXDcYntk9dU5uzP_LtGzwyDBovKAk0lHVbByounJVN03xW3d__NxPA",
        date: "Aug 06, 2026",
        author: "Vikram Sharma",
        readTime: "7 min read"
    },
    {
        id: 3,
        title: "Sourcing Organic Earth Clay: What EdTech Won't Tell You",
        excerpt: "Understanding the difference between terracotta, porcelain, and local riversides clay when building structural forms that do not crack during air drying.",
        category: "Materials Guide",
        categoryColor: "bg-tertiary-fixed text-on-tertiary-fixed",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCbTN-TaIudH0njCO5lQnLDpdjSBXonaHMG6x1kUfR2uXaU3Bxee-QSSCUKc_3hc1bwYbqoLL7NkuUAWEXphMhqlZj0UGrH5JKFEqWwuvMewqe0IKttUMNPvDyYvT5VOu5OOT2KLk9GRoWqhQtsYqopj7EjtbduvEldGGe5ADkeQ1K066OVltHrOz2DqpUwcxBAwAUGd1pxzDFD-4yEZpe1-WiuoFTNUcsLqLOtiHOQTnGcvfWTkEy",
        date: "Jul 28, 2026",
        author: "Devendra Joshi",
        readTime: "6 min read"
    },
    {
        id: 4,
        title: "Preserving Heritage: Clay Art in Kutch Communities",
        excerpt: "An intimate interview with village women practicing Lippan work on bhungas, keeping a 500-year-old tradition alive in the Rann of Kutch.",
        category: "Artisan Spotlight",
        categoryColor: "bg-secondary-fixed text-on-secondary-fixed",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPiWCQJI93PXDk9BOTIapmtikie4-YaxmLh1RRYduOa_TDE4AQZkdf8DEkTVGR5nS9OSCOgXvKuV_YYJl7XOPbMsOJ2NapTo5sBgHWGuqHmqZjabmFElFjDdYfpq8LsUXrV3nz9yX7Abr5E1fWw9PM_lVq-u8188AjgPz0txpaTpIy1QYYWuyXi3IwoSn_vw542oHbUWJhQ2iOxYf0kpLG7nJ1g6ftWcf9R78bsl9rLf2ndCoywsoF",
        date: "Jul 15, 2026",
        author: "Asha Devi",
        readTime: "8 min read"
    },
    {
        id: 5,
        title: "Why Artisanal Candle Wax selection is Crucial for Scent Throw",
        excerpt: "Evaluating soy, beeswax, and coconut wax blends for clean burning, strong scent throw, and a flawless smooth top surface post-pour.",
        category: "Crafting Tips",
        categoryColor: "bg-primary-container text-on-primary-container",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdWftkk77PEWsXT0X8Idf_5qfShUey9va1f3wum-E0_wQoJNhH8DlzGO1jy22TTPACpLEnQy1abVm1vhUtDsMA62pD83tLRBO8N6-irLAYagp8jz-xagrBPejAcQrBrwZzDiv9yycKXiyMImwz2fXE8Ti75v-LV1oM7TZC1DEpm5zIscCEoA4rnAVGfQcAfxeIOZaJ1Y7It8VGiYZDtwrBh2OS8uEZ9TL5ABRz7RQ6Rwxmr6C65H3E",
        date: "Jul 09, 2026",
        author: "Karan Johar",
        readTime: "4 min read"
    },
    {
        id: 6,
        title: "Macramé Aesthetics: Bohemian Knots in Modern Homes",
        excerpt: "How modern interior designers are incorporating textured natural cord hangings to introduce depth and tactile contrast to minimal urban settings.",
        category: "Community",
        categoryColor: "bg-surface-variant text-on-surface-variant",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVHXmzcgHw7sulCDAb_2pVZHDasOElzMgfYOpkwSglKvHLinvzj21rdsPxypicwnizEKoPexJ1Na-T97ghRpVUopYErNtLhDfD45ZFF1QoglAMu-RCA0-EwCRFZhOcxaYxbPPhKFNBWJJiwjgBrk_B6kk51MBuGYYByp6sai-JomiSRwpZe6nt8MGn_9ZMr4eD4WdQXnXaD8SSKk_xpKDjhN-XmE4k8IC6LLJufKcsw3T7n2EOGjhw",
        date: "Jun 24, 2026",
        author: "Rohan Das",
        readTime: "5 min read"
    }
];

const CATEGORIES = ["All Stories", "Crafting Tips", "Materials Guide", "Artisan Spotlight", "Community"];

export default function BlogsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All Stories");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = ALL_POSTS.filter(post => {
        const matchesCategory = selectedCategory === "All Stories" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredPost = ALL_POSTS[0];

    return (
        <main className="min-h-screen bg-background text-on-background pt-8 pb-16 md:pt-12 md:pb-24">
            <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop space-y-16">



                {/* Filters and Search Bar */}
                <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-b border-outline/15 pb-6">
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 font-label-md text-xs rounded-full transition-all duration-200 ${selectedCategory === cat
                                    ? "bg-primary text-on-primary shadow-sm"
                                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface-container-lowest text-on-surface font-body-md text-sm pl-10 pr-4 py-3 rounded-full border border-outline/20 focus:outline-none focus:border-primary transition-colors"
                        />
                        <span className="material-symbols-outlined absolute left-3 top-3.5 text-on-surface-variant/65 text-sm select-none">
                            search
                        </span>
                    </div>
                </div>

                {/* Featured Post Card (Hero) */}
                {selectedCategory === "All Stories" && searchQuery === "" && (
                    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden organic-shadow grid grid-cols-1 lg:grid-cols-12 hover-lift">
                        <div className="lg:col-span-7 h-[300px] lg:h-[450px] relative">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="lg:col-span-5 p-8 flex flex-col justify-center space-y-6">
                            <div>
                                <span className={`inline-block px-3 py-1 rounded-full font-label-md text-xs ${featuredPost.categoryColor} mb-4`}>
                                    {featuredPost.category}
                                </span>
                                <h2 className="font-headline-md text-2xl md:text-3xl text-on-surface hover:text-primary transition-colors leading-snug">
                                    <Link href={`/blogs/${featuredPost.id}`}>
                                        {featuredPost.title}
                                    </Link>
                                </h2>
                            </div>
                            <p className="font-body-md text-on-surface-variant text-sm leading-relaxed">
                                {featuredPost.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-outline/10 text-xs font-body-md text-on-surface-variant/80">
                                <span>{featuredPost.author} • {featuredPost.date}</span>
                                <span className="text-primary font-label-md">{featuredPost.readTime}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Blogs Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                        {filteredPosts.map(post => (
                            <div key={post.id} className="bg-surface-container-lowest rounded-2xl overflow-hidden organic-shadow flex flex-col justify-between hover-lift group">
                                <div>
                                    <div className="h-52 overflow-hidden relative">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <span className={`inline-block px-3 py-0.5 rounded-full font-label-md text-[10px] ${post.categoryColor} uppercase tracking-wider`}>
                                            {post.category}
                                        </span>
                                        <h3 className="font-headline-sm text-lg text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                            <Link href={`/blogs/${post.id}`}>
                                                {post.title}
                                            </Link>
                                        </h3>
                                        <p className="font-body-md text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-4 border-t border-outline/5 flex items-center justify-between text-[11px] font-body-md text-on-surface-variant/80">
                                    <span>By {post.author} • {post.date}</span>
                                    <span className="text-primary font-label-md">{post.readTime}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface-container-low rounded-2xl space-y-4">
                        <span className="material-symbols-outlined text-outline text-5xl">search_off</span>
                        <h3 className="font-headline-sm text-lg text-on-surface">No articles found</h3>
                        <p className="font-body-md text-sm text-on-surface-variant max-w-sm mx-auto">
                            Try adjusting your filters or search keywords to find what you are looking for.
                        </p>
                    </div>
                )}

                {/* Newsletter Box */}
                <section className="bg-surface-container rounded-2xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 organic-shadow">
                    <div className="space-y-3 max-w-lg text-center lg:text-left">
                        <h3 className="font-display-lg text-2xl text-on-surface">Join the Atelier Circle</h3>
                        <p className="font-body-md text-sm text-on-surface-variant">
                            Receive a monthly dispatch containing craft blueprints, historical deep dives, and early alerts for enrollment openings.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-surface-container-lowest text-on-surface font-body-md text-sm px-6 py-4 rounded-lg border border-outline/25 focus:outline-none focus:border-primary w-full sm:w-80"
                        />
                        <button className="bg-primary text-on-primary font-label-md text-sm px-8 py-4 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                            Subscribe
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}
