'use client';

import { useState, useEffect } from 'react';

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
    isCustom?: boolean;
}

const CATEGORY_COLORS: { [key: string]: string } = {
    "Crafting Tips": "bg-primary-container text-on-primary-container",
    "Materials Guide": "bg-tertiary-fixed text-on-tertiary-fixed",
    "Artisan Spotlight": "bg-secondary-fixed text-on-secondary-fixed",
    "Community": "bg-surface-variant text-on-surface-variant",
};

const DEFAULT_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "10 Essential Tools for Lippan Art Beginners",
        excerpt: "Discover the must-have tools, mud pastes, and mirrors to start your journey into the beautiful world of traditional Gujarati Lippan Art without making mess.",
        category: "Crafting Tips",
        categoryColor: "bg-primary-container text-on-primary-container",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
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
        image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600",
        date: "Aug 06, 2026",
        author: "Vikram Sharma",
        readTime: "7 min read"
    }
];

export default function AdminBlogManagement() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [isWriting, setIsWriting] = useState(false);

    // Form inputs
    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [category, setCategory] = useState('Crafting Tips');
    const [image, setImage] = useState('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600');
    const [author, setAuthor] = useState('Admin User');
    const [readTime, setReadTime] = useState('5 min read');

    const loadPosts = () => {
        const customBlogs = localStorage.getItem('custom_blogs');
        const parsedCustom = customBlogs ? JSON.parse(customBlogs) : [];
        setPosts([...parsedCustom, ...DEFAULT_POSTS]);
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPost: BlogPost = {
            id: Date.now(), // Unique ID
            title,
            excerpt,
            category,
            categoryColor: CATEGORY_COLORS[category] || "bg-surface-variant text-on-surface-variant",
            image,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            author,
            readTime,
            isCustom: true
        };

        const customBlogs = localStorage.getItem('custom_blogs');
        const parsedCustom = customBlogs ? JSON.parse(customBlogs) : [];
        const updatedCustom = [newPost, ...parsedCustom];
        
        localStorage.setItem('custom_blogs', JSON.stringify(updatedCustom));
        
        // Reset states
        setTitle('');
        setExcerpt('');
        setIsWriting(false);
        
        // Reload list
        loadPosts();
    };

    const handleDeletePost = (id: number) => {
        const customBlogs = localStorage.getItem('custom_blogs');
        if (customBlogs) {
            const parsedCustom = JSON.parse(customBlogs);
            const filtered = parsedCustom.filter((post: BlogPost) => post.id !== id);
            localStorage.setItem('custom_blogs', JSON.stringify(filtered));
        }
        loadPosts();
    };

    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-on-surface">
            
            <header className="mb-8 border-b border-outline-variant/30 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-on-surface playfair">Blog Management</h1>
                    <p className="text-xs text-on-surface-variant mt-1">
                        Write and edit educational articles, craft guides, and artisan spotlight features for the Lemon Academy stories portal.
                    </p>
                </div>
                <button
                    onClick={() => setIsWriting(!isWriting)}
                    className="self-start sm:self-center bg-primary hover:bg-primary/95 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm text-xs tracking-wider uppercase flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">
                        {isWriting ? 'close' : 'edit_note'}
                    </span>
                    {isWriting ? 'Cancel Writing' : 'Write New Article'}
                </button>
            </header>

            {isWriting && (
                <section className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 mb-8 max-w-3xl mx-auto shadow-sm">
                    <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">edit_note</span>
                        Write a New Article
                    </h3>
                    
                    <form onSubmit={handleCreatePost} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Article Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. 5 Simple Steps to Scented Wax Mixing"
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-1.5 col-span-1 md:col-span-2">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Excerpt / Subtitle
                                </label>
                                <textarea
                                    required
                                    rows={2}
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Provide a brief summary of what this article covers..."
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm"
                                >
                                    <option value="Crafting Tips">Crafting Tips</option>
                                    <option value="Materials Guide">Materials Guide</option>
                                    <option value="Artisan Spotlight">Artisan Spotlight</option>
                                    <option value="Community">Community</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Cover Image URL
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Author Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                                    Estimated Read Time
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={readTime}
                                    onChange={(e) => setReadTime(e.target.value)}
                                    placeholder="e.g. 5 min read"
                                    className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 focus:border-primary focus:outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/95 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow text-xs tracking-wider uppercase mt-4 flex items-center justify-center gap-2"
                        >
                            Publish Article
                            <span className="material-symbols-outlined text-sm">publish</span>
                        </button>
                    </form>
                </section>
            )}

            {/* Existing Articles List */}
            <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-3xl p-6 shadow-sm">
                <h3 className="font-bold text-lg text-on-surface mb-6">Published Articles</h3>
                
                {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-outline-variant/30 text-on-surface-variant font-bold text-xs uppercase tracking-wider">
                                    <th className="py-4 px-4">Article</th>
                                    <th className="py-4 px-4">Category</th>
                                    <th className="py-4 px-4">Author / Date</th>
                                    <th className="py-4 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-outline-variant/10">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-surface-container-low/20 transition-colors">
                                        <td className="py-4 px-4 flex items-center gap-3">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-12 h-12 rounded-lg object-cover border border-outline-variant/20 shrink-0"
                                            />
                                            <div>
                                                <h4 className="font-bold text-on-surface line-clamp-1">{post.title}</h4>
                                                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{post.excerpt}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.categoryColor}`}>
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="block font-semibold text-xs text-on-surface">{post.author}</span>
                                            <span className="text-[10px] text-on-surface-variant">{post.date} • {post.readTime}</span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {post.isCustom ? (
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="p-2 text-outline hover:text-error hover:bg-error-container/20 rounded-xl transition-all"
                                                    title="Delete Article"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            ) : (
                                                <span className="text-[10px] text-outline font-semibold tracking-wide uppercase px-2 py-1 bg-surface-container rounded">
                                                    Static / Core
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-on-surface-variant">
                        <span className="material-symbols-outlined text-4xl mb-2 text-outline-variant">find_in_page</span>
                        <p className="text-xs font-semibold">No articles published yet.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
