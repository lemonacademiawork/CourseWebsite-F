import Link from 'next/link';

export default function LemonAcademyHome() {
    return (
        <main>
 
            <section className="py-20 md:py-32 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter items-center">
                    <div className="space-y-8">
                        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface max-w-xl">
                            Learn. Create. Inspire.
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
                            Master the art of handcrafted creation with our premium courses. From Lippan Art to Resin, discover your creative potential in our modern craft studio.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link href="/courses" className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:opacity-90 transition-opacity hover-lift inline-block">
                                Explore Courses
                            </Link>
                            <Link href="/gallery" className="border border-outline text-on-surface font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-surface-variant transition-colors inline-block">
                                View Gallery
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-[400px] lg:h-[600px] rounded-xl overflow-hidden organic-shadow">
                        <img alt="Craft Workshop" className="w-full h-full object-cover" data-alt="A top-down view of an artist's workspace covered in various high-quality craft materials. There is a beautifully detailed piece of Lippan Art in progress, alongside vibrant resin art samples. The lighting is soft, warm, and highly directional, evoking a premium modern craft studio aesthetic. The colors are rich earthy tones with bright resin highlights." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyT1MCdKmqH4qQz6XAx6MXb0Axi-FOW5lNIXj_TkLWqr4MYn34W7WnUJv7Kvk2zbyUTytkZbia4wvloS3te02-s_nTY9_mi4dntLpB3ja5l66bjGAUICeB412Hu1i2jCmP8PFP9KFivVeXJ8QkIFamjZ01ylH4hhAJ9Rf5IJE8nyo9PmB7-Jan4omGDc7uBw8_0NUVCUUlbO39hOryEeOPuyj9Gs05zjhhZTYjHDl_TFDXVVQnceuH" />
                    </div>
                </div>
            </section>

            <section className="py-20 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
                <div className="max-w-container-max mx-auto">
                    <h2 className="font-headline-md text-headline-md text-on-surface mb-12 text-center">Master a Craft</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">

                        <div className="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
                            <img alt="Crochet" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="Close up shot of intricate crochet work in progress. Soft natural light highlights the texture of the thick, premium yarn in warm off-white and terracotta tones. The aesthetic is cozy, tactile, and highly detailed, emphasizing the craftsmanship." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPiWCQJI93PXDk9BOTIapmtikie4-YaxmLh1RRYduOa_TDE4AQZkdf8DEkTVGR5nS9OSCOgXvKuV_YYJl7XOPbMsOJ2NapTo5sBgHWGuqHmqZjabmFElFjDdYfpq8LsUXrV3nz9yX7Abr5E1fWw9PM_lVq-u8188AjgPz0txpaTpIy1QYYWuyXi3IwoSn_vw542oHbUWJhQ2iOxYf0kpLG7nJ1g6ftWcf9R78bsl9rLf2ndCoywsoF" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h3 className="font-headline-sm text-headline-sm text-white">Crochet</h3>
                            </div>
                        </div>

                        <div className="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
                            <img alt="Mosaic Art" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A meticulously crafted mosaic art piece featuring geometric patterns in subtle sage, lemon, and cream tiles. The composition is balanced and elegant, photographed in bright, diffused light that brings out the texture of the grout and the subtle sheen of the tiles. Premium, modern craft aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXiQLIEpsHtGrZbryHVG2dOarl_iT9qvnszntbv8Io-HDvulcLxdeW-m1Y1LvLsZVTdyll6k3sqZuLN0jnUa8PmjFtQMe1mAq8CIzvCN0yaT2ObdUfIPU2XuH0CbkJ-ZzjHMPf30gtRgX14D6XM6dRo4nkeus9cqsp61icBWZjJAhChFKP93gBX9kTPkDU0dKVth2hhMx3C1QEtY_8tkNWkbpTpJ4ASJfAgMhyr-lLHkbEwd9CJP6X" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h3 className="font-headline-sm text-headline-sm text-white">Mosaic Art</h3>
                            </div>
                        </div>

                        <div className="group relative h-80 rounded-xl overflow-hidden cursor-pointer">
                            <img alt="Candle Making" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A stylish, minimalist display of hand-poured artisanal candles in neutral ceramic vessels. The setting includes dried botanical elements and subtle tools of the trade. The lighting is warm and ambient, casting soft shadows that highlight the smooth texture of the wax. High-end lifestyle aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdWftkk77PEWsXT0X8Idf_5qfShUey9va1f3wum-E0_wQoJNhH8DlzGO1jy22TTPACpLEnQy1abVm1vhUtDsMA62pD83tLRBO8N6-irLAYagp8jz-xagrBPejAcQrBrwZzDiv9yycKXiyMImwz2fXE8Ti75v-LV1oM7TZC1DEpm5zIscCEoA4rnAVGfQcAfxeIOZaJ1Y7It8VGiYZDtwrBh2OS8uEZ9TL5ABRz7RQ6Rwxmr6C65H3E" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                <h3 className="font-headline-sm text-headline-sm text-white">Candle Making</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>





            <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-16 text-center">Your Path to Mastery</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">

                    <div className="hidden md:block absolute top-8 left-12 right-12 h-[2px] bg-surface-variant -z-10"></div>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-display-lg text-[24px] mb-6">1</div>
                        <h3 className="font-label-md text-label-md text-on-surface mb-2">Discover</h3>
                        <p className="font-body-md text-[14px] text-on-surface-variant">Find the craft that sparks your curiosity.</p>
                    </div>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-display-lg text-[24px] mb-6">2</div>
                        <h3 className="font-label-md text-label-md text-on-surface mb-2">Enroll</h3>
                        <p className="font-body-md text-[14px] text-on-surface-variant">Join the course and access premium materials.</p>
                    </div>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-display-lg text-[24px] mb-6">3</div>
                        <h3 className="font-label-md text-label-md text-on-surface mb-2">Create</h3>
                        <p className="font-body-md text-[14px] text-on-surface-variant">Follow along with expert-led video tutorials.</p>
                    </div>
                    <div className="relative flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center font-display-lg text-[24px] mb-6">4</div>
                        <h3 className="font-label-md text-label-md text-on-surface mb-2">Share</h3>
                        <p className="font-body-md text-[14px] text-on-surface-variant">Showcase your creations in the student gallery.</p>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-surface-container-low px-margin-mobile md:px-margin-desktop">
                <div className="max-w-container-max mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-xl">
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-4">Student Gallery</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">A curated collection of beautiful pieces crafted by the Lemon Academy community.</p>
                        </div>
                        <Link href="/gallery" className="mt-6 md:mt-0 bg-surface-container-highest text-on-surface font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-surface-variant transition-colors inline-block text-center">
                            View Full Gallery
                        </Link>
                    </div>
                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                        <div className="break-inside-avoid rounded-xl overflow-hidden organic-shadow hover-lift cursor-pointer">
                            <img alt="Student Work" className="w-full object-cover" data-alt="A beautiful handmade ceramic vase with an organic, asymmetric shape, glazed in a matte terracotta color. Photographed against a plain cream background to emphasize its form and texture. Premium aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCbTN-TaIudH0njCO5lQnLDpdjSBXonaHMG6x1kUfR2uXaU3Bxee-QSSCUKc_3hc1bwYbqoLL7NkuUAWEXphMhqlZj0UGrH5JKFEqWwuvMewqe0IKttUMNPvDyYvT5VOu5OOT2KLk9GRoWqhQtsYqopj7EjtbduvEldGGe5ADkeQ1K066OVltHrOz2DqpUwcxBAwAUGd1pxzDFD-4yEZpe1-WiuoFTNUcsLqLOtiHOQTnGcvfWTkEy" />
                        </div>
                        <div className="break-inside-avoid rounded-xl overflow-hidden organic-shadow hover-lift cursor-pointer">
                            <img alt="Student Work" className="w-full object-cover" data-alt="Intricate macrame wall hanging made with thick natural cotton cord, featuring complex knots and fringes. Photographed hanging on a clean white wall with soft, warm sunlight casting gentle shadows. Bohemian yet modern aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVHXmzcgHw7sulCDAb_2pVZHDasOElzMgfYOpkwSglKvHLinvzj21rdsPxypicwnizEKoPexJ1Na-T97ghRpVUopYErNtLhDfD45ZFF1QoglAMu-RCA0-EwCRFZhOcxaYxbPPhKFNBWJJiwjgBrk_B6kk51MBuGYYByp6sai-JomiSRwpZe6nt8MGn_9ZMr4eD4WdQXnXaD8SSKk_xpKDjhN-XmE4k8IC6LLJufKcsw3T7n2EOGjhw" />
                        </div>
                        <div className="break-inside-avoid rounded-xl overflow-hidden organic-shadow hover-lift cursor-pointer">
                            <img alt="Student Work" className="w-full object-cover" data-alt="A close up of a beautifully poured resin coaster with swirling patterns of deep sage green and gold leaf accents. The surface is highly reflective, showing a high level of finish. Set on a wooden table. High-end craft." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ebExG_XiTCgDy-wilQ2qkTBHA9io0Abtx9l3_0_KlB11eRJFZRzCu66LHB2XcZPxCv_r-X-Ri42rSlUlnVO3qPyRkNbjvhGD5JtQ7OcbiO_OrzKbdNlToMEVjt2E2Pt1fiec7zKwb5t3TAg-E36GFllMXu66P92jvg9i-2O4guiIvR6k2kBKtQIivRgDOmszK2BLSWDuRxf9Q0aMMHkwXVXSJGWktGOaemYXSkuyxYWRwnfcDCjE" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
