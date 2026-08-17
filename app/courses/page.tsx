export default function ExploreCoursesLemonAcademy() {
    return (
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">


            <div className="flex flex-col md:flex-row gap-8">

                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-8 bg-surface-container-low p-6 rounded-xl border border-surface-variant">
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-4">Categories</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Lippan Art</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Mosaic Art</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input defaultChecked className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Crochet</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Resin Art</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Pottery</span>
                                </label>
                            </div>
                        </div>
                        <hr className="border-t border-outline-variant" />
                        <div>
                            <h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest mb-4">Level</h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Beginner</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Intermediate</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input className="form-checkbox text-primary rounded border-outline-variant focus:ring-primary w-5 h-5" type="checkbox" />
                                    <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-primary transition-colors">Advanced</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex-grow">

                    <div className="flex justify-between items-center mb-6">
                        <span className="font-body-md text-body-md text-on-surface-variant">Showing 24 creative courses</span>
                        <select className="bg-surface-container-low border border-outline-variant rounded-md py-2 pl-3 pr-10 font-body-md text-body-md text-on-surface focus:ring-primary focus:border-primary">
                            <option>Sort by: Recommended</option>
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">

                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(45,45,45,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(45,45,45,0.08)] transition-all duration-300 group flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A close-up shot of hands working on intricate Lippan art with clay and mirrors on a wooden board. The lighting is warm and natural, casting soft shadows, highlighting the tactile texture of the materials. The overall aesthetic is modern, clean, and artistic with a soft, warm color palette." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaoX0RGxpW-j4nvC1oT1ER7ghQq3LTyffaeKwMP7NUMAKKHqHQmjktmUbyLPagZx6VG0o3H4U157TFiWJGVWKEFwAc3hVXQzqSdHoFy7hC98aHC2EyKFdILSTsnS-EXmaDGklBokg2X7ZOMMcfjaSFDKUhNg6zQecW1g1g1W-aIDWhErsUjb9KT097mpys8RjeuJAbVJ2rMZ7tS10zRVyyf0czkAW4IWUW6sgkOQOPwRiE2EbJHQdA" />
                                <div className="absolute top-4 left-4 bg-tertiary-fixed px-3 py-1 rounded-full text-on-tertiary-fixed text-xs font-semibold uppercase tracking-wider">
                                    Lippan Art
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">Mastering Traditional Lippan Art</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-2">Learn the ancient techniques of mud and mirror work to create stunning contemporary wall decors.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-xs font-bold">AS</div>
                                    <span className="font-label-md text-label-md text-on-surface-variant">Aisha Sharma</span>
                                </div>
                                <div className="flex justify-between items-end border-t border-surface-variant pt-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center text-primary-fixed-dim">
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined text-sm">star_half</span>
                                            <span className="font-label-md text-label-md text-on-surface ml-1">4.8</span>
                                            <span className="text-xs text-on-surface-variant ml-1">(120)</span>
                                        </div>
                                        <span className="font-body-md text-sm text-on-surface-variant mt-1">2.4k students</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-outline-variant line-through">Rs. 89</div>
                                        <div className="font-headline-sm text-lg text-primary font-bold">Rs. 49</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(45,45,45,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(45,45,45,0.08)] transition-all duration-300 group flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="A modern, brightly lit workspace showing colorful glass mosaic tiles being arranged into a geometric pattern. The camera angle is top-down. Bright white natural light floods the scene, enhancing the vivid colors of the glass pieces. The aesthetic is clean, educational, and inspiring." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNXqJr6RFpTJEjfBZWKnHdps3MQaN46CXv1Rat2GjC5wtUb9rF_qabpyosxixn_AapiaQCcB63D4-KUTw0diMpSadXamyTCjgPp5e4uK0PIf0J0dI2jaHKQx82ov3rYrOrts82WbkDDITFg8EoX5uj7HBBOSqzJQNfIG7xXxauFv3Xo4GgPDPtxfty2V9i6cwpNhMaobFX8eWZEHZtoh3Sc0aR_XyL6SbzhmKiTK_haC16AKpbTyDS" />
                                <div className="absolute top-4 left-4 bg-secondary-fixed px-3 py-1 rounded-full text-on-secondary-fixed text-xs font-semibold uppercase tracking-wider">
                                    Mosaic Art
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">Contemporary Glass Mosaics</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-2">Design and assemble vibrant glass mosaics for modern home interiors and functional art pieces.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold">MK</div>
                                    <span className="font-label-md text-label-md text-on-surface-variant">Marcus King</span>
                                </div>
                                <div className="flex justify-between items-end border-t border-surface-variant pt-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center text-primary-fixed-dim">
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="font-label-md text-label-md text-on-surface ml-1">5.0</span>
                                            <span className="text-xs text-on-surface-variant ml-1">(84)</span>
                                        </div>
                                        <span className="font-body-md text-sm text-on-surface-variant mt-1">1.1k students</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-headline-sm text-lg text-primary font-bold">Rs. 65</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(45,45,45,0.05)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(45,45,45,0.08)] transition-all duration-300 group flex flex-col h-full">
                            <div className="relative h-48 overflow-hidden">
                                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Soft, inviting close-up of hands crocheting a chunky yarn blanket in a cozy, sunlit room. The yarn is a soft beige color. The lighting is warm and diffused, creating a calm and relaxing mood. The overall visual style is soft minimalism, tactile, and premium." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCarGQ1a20lOrYSxj_diFDlrx2teCRF0nc06aZuLUtzrjHtCM90tNxtMRvLG0nAJQeFRvurw4GyjS2TWcAdx59bz_OlVC11u5g3bF7eDFNpeBB58oaTnQzIo62DZL2p7HHxJcB2A8NIZb9Qh6hsVRZJ8WYBWclS9KvWFFjqZFk69Ne1rlQcQAKH9cnePrAXtPFxL-9yJ-uO8mcK6WI8rL82yuAVL47VthVsZdU68ebTuA-5QDxZpuRp" />
                                <div className="absolute top-4 left-4 bg-primary-container px-3 py-1 rounded-full text-on-primary-container text-xs font-semibold uppercase tracking-wider">
                                    Crochet
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 leading-tight group-hover:text-primary transition-colors">Advanced Amigurumi Techniques</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-4 flex-grow line-clamp-2">Elevate your crochet skills by learning complex shapes and invisible finishing techniques for plush toys.</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container text-xs font-bold">EL</div>
                                    <span className="font-label-md text-label-md text-on-surface-variant">Emma Lin</span>
                                </div>
                                <div className="flex justify-between items-end border-t border-surface-variant pt-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center text-primary-fixed-dim">
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined filled text-sm">star</span>
                                            <span className="material-symbols-outlined text-sm">star_border</span>
                                            <span className="font-label-md text-label-md text-on-surface ml-1">4.2</span>
                                            <span className="text-xs text-on-surface-variant ml-1">(312)</span>
                                        </div>
                                        <span className="font-body-md text-sm text-on-surface-variant mt-1">5.6k students</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-outline-variant line-through">Rs. 45</div>
                                        <div className="font-headline-sm text-lg text-primary font-bold">Rs. 29</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center gap-2">
                        <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                        <button className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md">1</button>
                        <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md">2</button>
                        <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors font-label-md">3</button>
                        <button className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                    </div>
                </div>
            </div>
        </main>
    );
}
