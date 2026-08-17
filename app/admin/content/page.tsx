'use client';
import { useState, useRef } from 'react';

interface CarouselSlide {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
    {
        id: 1,
        title: "Lippan Art Masterclass",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200&h=400",
        description: "Explore mirror & clay magic."
    },
    {
        id: 2,
        title: "Modern Mosaic Techniques",
        imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1200&h=400",
        description: "Assemble colorful ceramic designs."
    },
    {
        id: 3,
        title: "Hand-poured Soy Candle",
        imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1200&h=400",
        description: "Craft organic botanical aromas."
    },
    {
        id: 4,
        title: "Pottery & Wheel Basics",
        imageUrl: "https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=1200&h=400",
        description: "Master the terracotta wheel."
    },
    {
        id: 5,
        title: "Creative Crochet Crafts",
        imageUrl: "https://images.unsplash.com/photo-1584992772048-2ec37ab286b8?auto=format&fit=crop&q=80&w=1200&h=400",
        description: "Weave beautiful winter designs."
    }
];

export default function AdminCarouselManagement() {
    const [slides, setSlides] = useState<(CarouselSlide | null)[]>([
        ...DEFAULT_SLIDES,
        null // 6th slot empty by default
    ]);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = (index: number) => {
        setSelectedSlot(index);
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedSlot !== null) {
            const newUrl = URL.createObjectURL(file);
            const updatedSlides = [...slides];
            updatedSlides[selectedSlot] = {
                id: selectedSlot + 1,
                title: file.name.replace(/\.[^/.]+$/, ""), // file name without extension
                imageUrl: newUrl,
                description: "Custom slide upload."
            };
            setSlides(updatedSlides);
            setSelectedSlot(null);
        }
    };

    const handleDeleteSlide = (index: number) => {
        const updatedSlides = [...slides];
        updatedSlides[index] = null;
        setSlides(updatedSlides);
    };

    return (
        <main className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen">
            {/* Hidden File Input */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <header className="mb-6 border-b border-outline-variant/30 pb-4">
                <h1 className="text-xl font-bold text-on-surface">Homepage Carousel Banners</h1>
                <p className="text-xs text-on-surface-variant mt-1">
                    Manage the promotional carousel slides shown on the Student Homepage. Keep exactly 5-6 banners for optimal scrolling.
                </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {slides.map((slide, index) => (
                    <div 
                        key={index} 
                        className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm border border-outline-variant/30 flex flex-col h-64 relative transition-all ${
                            !slide ? 'border-dashed bg-surface-container-low/20' : ''
                        }`}
                    >
                        {/* Slide Slot Badge */}
                        <div className="absolute top-2 left-2 z-10">
                            <span className="bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface-variant font-semibold text-[10px] px-2 py-0.5 rounded border border-outline-variant/30 shadow-sm">
                                SLIDE {index + 1}
                            </span>
                        </div>

                        {slide ? (
                            <>
                                <div className="relative h-40 w-full bg-surface-container-high overflow-hidden shrink-0">
                                    <img 
                                        alt={slide.title} 
                                        className="w-full h-full object-cover" 
                                        src={slide.imageUrl} 
                                    />
                                    <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 duration-200">
                                        <button 
                                            onClick={() => handleUploadClick(index)}
                                            className="bg-white/95 text-xs text-on-surface font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-md hover:bg-white"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                            Replace Image
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-xs font-bold text-on-surface line-clamp-1">{slide.title}</h4>
                                        <p className="text-[10px] text-on-surface-variant mt-0.5 line-clamp-2">{slide.description}</p>
                                    </div>
                                    <div className="flex justify-end gap-2 border-t border-outline-variant/20 pt-2 mt-auto">
                                        <button 
                                            onClick={() => handleUploadClick(index)}
                                            className="p-1 text-on-surface-variant hover:text-primary hover:bg-primary-container/20 rounded-lg transition-all"
                                            title="Change Image"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSlide(index)}
                                            className="p-1 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-all"
                                            title="Remove slide"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center p-6 text-center cursor-pointer" onClick={() => handleUploadClick(index)}>
                                <span className="material-symbols-outlined text-on-surface-variant text-2xl mb-2">add_photo_alternate</span>
                                <span className="text-xs font-semibold text-on-surface">Slot Empty</span>
                                <span className="text-[10px] text-on-surface-variant mt-1">Click here to upload slide {index + 1}</span>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    );
}
