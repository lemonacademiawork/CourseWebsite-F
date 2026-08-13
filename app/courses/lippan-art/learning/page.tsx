export default function CourseLearnLippanArt() {
    return (
        <main className="min-h-screen">
            {/* Video Player Section */}
            <section className="bg-inverse-surface">
                <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
                    <div className="aspect-video bg-surface-container-highest rounded-2xl overflow-hidden relative group cursor-pointer">
                        <img
                            alt="Course Video Thumbnail"
                            className="w-full h-full object-cover opacity-80"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8uUDwblCiOL-t_fXfhZIM8UQ-foGxJSn6hGpxc88wb2sRpHx1JziZTsyIyMRioyV9CjADQuW5gBqRqKDFu6eOTIYQf2HAOyCsjZjcyhbhsL8CFb64eHVwLqYBSkrGGTLumaD4JJDFWo8ty9SvJg4Xy_3q8B4kmpWkmjS0EPSmjFh7CZkEqu1cQUuArkgb_bWTKvi96Wzub4kSFI0wPer8_Y_UsI2v7eTfCEFrxNeDXBiSuuu0eVyXDF5xn_3Ruz6D8w"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-lg">
                                <span className="material-symbols-outlined text-4xl">play_arrow</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Content */}
            <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-4">
                            The Art of Lippan - Learning
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
                            Master the traditional mud and mirror work of Kutch. This module covers the foundational
                            techniques, materials, and cultural significance of Lippan Art.
                        </p>

                        {/* Module List */}
                        <div className="space-y-4">
                            <div className="bg-primary-container/20 border border-primary/20 rounded-xl p-5 flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</div>
                                <div className="flex-1">
                                    <h3 className="font-label-md text-label-md text-on-surface font-bold">Introduction to Lippan Art</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">History, materials & workspace setup</p>
                                </div>
                                <span className="material-symbols-outlined text-primary">play_circle</span>
                            </div>
                            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</div>
                                <div className="flex-1">
                                    <h3 className="font-label-md text-label-md text-on-surface font-bold">Base Preparation</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Creating the perfect clay base</p>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                            </div>
                            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-sm shrink-0">3</div>
                                <div className="flex-1">
                                    <h3 className="font-label-md text-label-md text-on-surface font-bold">Mirror Placement Techniques</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Patterns, spacing & adhesion methods</p>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                            </div>
                            <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-5 flex items-center gap-4 hover:bg-surface-container-low transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-surface-container-high text-on-surface rounded-full flex items-center justify-center font-bold text-sm shrink-0">4</div>
                                <div className="flex-1">
                                    <h3 className="font-label-md text-label-md text-on-surface font-bold">Advanced Patterns</h3>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Complex geometric & floral designs</p>
                                </div>
                                <span className="material-symbols-outlined text-on-surface-variant">lock</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Course Progress</h3>
                            <div className="w-full bg-surface-container-high rounded-full h-3 mb-3">
                                <div className="bg-primary h-3 rounded-full" style={{width: '25%'}}></div>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant">1 of 4 modules completed</p>
                        </div>
                        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/20">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">Instructor</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-bold">AS</div>
                                <div>
                                    <p className="font-label-md text-label-md text-on-surface font-bold">Aisha Sharma</p>
                                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">Master Artisan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}