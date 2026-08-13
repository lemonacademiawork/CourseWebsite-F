export default function AdminExcelImportWizard() {
    return (
        <main className="flex-1 flex flex-col min-h-screen">

<header className="md:hidden flex justify-between items-center w-full px-margin-mobile py-4 bg-surface dark:bg-background shadow-sm top-0 z-20 sticky">
<h1 className="font-display-lg text-display-lg-mobile text-primary dark:text-primary-fixed">Lemon Academy</h1>
<button className="material-symbols-outlined text-on-surface">menu</button>
</header>
<div className="flex-1 p-margin-mobile md:p-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 flex flex-col space-y-12 py-8">

<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Import Students</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Batch import student profiles into the academy platform via Excel.</p>
</div>

<div className="relative">
<div className="absolute inset-0 top-1/2 -translate-y-1/2 h-[2px] bg-surface-variant w-full -z-10"></div>
<div className="flex justify-between w-full">
<div className="flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md ring-4 ring-background">1</div>
<span className="font-label-md text-label-md text-primary">Upload</span>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md text-label-md ring-4 ring-background">2</div>
<span className="font-label-md text-label-md text-on-surface-variant">Validate</span>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md text-label-md ring-4 ring-background">3</div>
<span className="font-label-md text-label-md text-on-surface-variant">Preview</span>
</div>
<div className="flex flex-col items-center gap-2">
<div className="w-8 h-8 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center font-label-md text-label-md ring-4 ring-background">4</div>
<span className="font-label-md text-label-md text-on-surface-variant">Confirm</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl p-8 organic-shadow hover-lift">
<div className="flex justify-between items-center mb-8">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Step 1: Upload Data</h3>
<button className="flex items-center gap-2 px-4 py-2 border border-outline text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-variant/30 transition-colors">
<span className="material-symbols-outlined">download</span>
                            Download Excel Template
                        </button>
</div>

<div className="dashed-border rounded-xl bg-surface p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-low transition-colors group">
<div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-4xl text-primary">upload_file</span>
</div>
<h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">Drag and drop your Excel file here</h4>
<p className="font-body-md text-body-md text-on-surface-variant mb-6">Supported formats: .xlsx, .xls, .csv (Max 10MB)</p>
<div className="relative">
<input accept=".xlsx,.xls,.csv" aria-label="Upload Excel File" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
<button className="px-6 py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary/90 transition-colors pointer-events-none">
                                Browse Files
                            </button>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 hidden lg:flex flex-col h-full rounded-xl overflow-hidden organic-shadow relative">
<div className="absolute inset-0 bg-cover bg-center" data-alt="A softly lit, modern craft studio environment featuring warm, organic tones, blank canvas textures, and scattered, beautifully designed stationary. Natural sunlight filters through large windows, casting elegant, soft shadows across a minimalist, sophisticated desk setting. The aesthetic is premium, inspiring, and distinctly editorial." style={{backgroundImage: `url(https://lh3.googleusercontent.com/aida-public/AB6AXuDEf3qDjMqaEXsCfpNGU3gqqSIsSpqaf4lzPuEx1OxVH_qWp5yoY3_4PsSvnygt3HaGsaNnW4fvcP7bgdsoL5rmDK2tPQz_pvdPdjYly4K4WaUpbdNgUUNyHZD8F1MRSHZln9C_X08aRbatGN1AHPIG-JbikFDGRkhYwIIFQkUSD4viNKxkzuTKXx1IRs9whuCD_XJmc6eH1k45wE6WFm3sbYe9e5Z7C1XtqusPOC8m7isyBIPxBOGz)`}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 to-inverse-surface/20"></div>
<div className="relative z-10 mt-auto p-8">
<span className="material-symbols-outlined text-4xl text-primary-container mb-4">palette</span>
<h3 className="font-headline-md text-headline-md text-surface-container-lowest mb-2">Crafting Futures</h3>
<p className="font-body-md text-body-md text-surface-variant">Importing new creators into the academy space. Ensure all portfolio links and preferred medium fields are accurately mapped in your template.</p>
</div>
</div>
</div>
</main>
    );
}
