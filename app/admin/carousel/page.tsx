'use client';
import { useState, useEffect } from 'react';

interface CarouselItem {
    id: string;
    url: string;
    active: boolean;
}

export default function AdminHomepageCarousel() {
    const [images, setImages] = useState<CarouselItem[]>([]);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [tempFile, setTempFile] = useState<File | null>(null);

    // Load initial images
    useEffect(() => {
        const stored = localStorage.getItem('homepage_carousel');
        if (stored) {
            setImages(JSON.parse(stored));
        } else {
            // Default images
            const defaults = [
                { id: '1', url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600&h=600", active: true },
                { id: '2', url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600", active: true },
                { id: '3', url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600", active: true }
            ];
            setImages(defaults);
            localStorage.setItem('homepage_carousel', JSON.stringify(defaults));
        }
    }, []);

    const saveToLocalStorage = (newList: CarouselItem[]) => {
        setImages(newList);
        localStorage.setItem('homepage_carousel', JSON.stringify(newList));
        // Dispatch custom event to notify other components (like homepage)
        window.dispatchEvent(new Event('carousel_updated'));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTempFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadSave = () => {
        if (previewUrl) {
            const newItem: CarouselItem = {
                id: Date.now().toString(),
                url: previewUrl,
                active: true
            };
            const updated = [...images, newItem];
            saveToLocalStorage(updated);
            setPreviewUrl(null);
            setTempFile(null);
        }
    };

    const handleDelete = (id: string) => {
        const updated = images.filter(item => item.id !== id);
        saveToLocalStorage(updated);
    };

    const handleToggleActive = (id: string) => {
        const updated = images.map(item => {
            if (item.id === id) {
                return { ...item, active: !item.active };
            }
            return item;
        });
        saveToLocalStorage(updated);
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= images.length) return;

        const updated = [...images];
        const [removed] = updated.splice(index, 1);
        updated.splice(newIndex, 0, removed);
        saveToLocalStorage(updated);
    };

    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-bold text-on-background mb-1">Homepage Carousel</h2>
                    <p className="text-xs text-on-surface-variant max-w-lg">Upload and reorder active creatives for the website home screen banner.</p>
                </div>
                <div className="relative">
                    <label className="cursor-pointer flex items-center gap-1.5 bg-primary text-primary-fixed hover:bg-surface-tint font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors whitespace-nowrap shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        + Upload Image
                        <input type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
                    </label>
                </div>
            </div>

            {/* Upload Preview Modal/Banner */}
            {previewUrl && (
                <div className="bg-surface-container-lowest border border-outline-variant/30 p-4 rounded-xl shadow-sm mb-6 max-w-xl">
                    <h3 className="text-xs font-bold mb-3 text-on-surface">Preview Creative</h3>
                    <div className="aspect-[16/6] w-full rounded-lg overflow-hidden border border-outline-variant/20 mb-4 bg-surface-container">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={handleUploadSave}
                            className="bg-primary text-on-primary font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Save Image
                        </button>
                        <button 
                            onClick={() => {
                                setPreviewUrl(null);
                                setTempFile(null);
                            }}
                            className="bg-surface-container border border-outline/30 text-on-surface font-semibold py-2 px-4 rounded-lg hover:bg-surface-dim transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((item, index) => (
                    <div key={item.id} className="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col h-fit">
                        <div className="aspect-[16/6] w-full bg-surface-container">
                            <img src={item.url} alt="Carousel Banner" className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    item.active ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' : 'bg-surface-variant text-on-surface-variant'
                                }`}>
                                    {item.active ? 'Active' : 'Inactive'}
                                </span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        disabled={index === 0}
                                        onClick={() => moveImage(index, 'up')}
                                        className="p-1 hover:bg-surface-container rounded disabled:opacity-30"
                                        title="Move Up"
                                    >
                                        <span className="material-symbols-outlined text-base">arrow_upward</span>
                                    </button>
                                    <button 
                                        disabled={index === images.length - 1}
                                        onClick={() => moveImage(index, 'down')}
                                        className="p-1 hover:bg-surface-container rounded disabled:opacity-30"
                                        title="Move Down"
                                    >
                                        <span className="material-symbols-outlined text-base">arrow_downward</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 border-t border-outline-variant/20 pt-3 mt-1">
                                <button 
                                    onClick={() => handleToggleActive(item.id)}
                                    className="flex-1 text-center bg-surface-container hover:bg-surface-dim font-semibold py-1.5 rounded transition-colors"
                                >
                                    {item.active ? 'Disable' : 'Enable'}
                                </button>
                                <button 
                                    onClick={() => handleDelete(item.id)}
                                    className="flex-1 text-center bg-error-container/20 hover:bg-error-container/45 text-error font-semibold py-1.5 rounded transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {images.length === 0 && (
                    <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl">
                        No creatives in carousel. Click "+ Upload Image" to add one.
                    </div>
                )}
            </div>
        </main>
    );
}
