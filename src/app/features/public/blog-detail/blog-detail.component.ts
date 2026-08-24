import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  category: string;
  categoryColor: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

const POSTS_CONTENT: Record<number, BlogPost> = {
  1: {
    id: 1,
    title: "10 Essential Tools for Lippan Art Beginners",
    category: "Crafting Tips",
    categoryColor: "bg-primary-container text-on-primary-container",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXiQLIEpsHtGrZbryHVG2dOarl_iT9qvnszntbv8Io-HDvulcLxdeW-m1Y1LvLsZVTdyll6k3sqZuLN0jnUa8PmjFtQMe1mAq8CIzvCN0yaT2ObdUfIPU2XuH0CbkJ-ZzjHMPf30gtRgX14D6XM6dRo4nkeus9cqsp61icBWZjJAhChFKP93gBX9kTPkDU0dKVth2hhMx3C1QEtY_8tkNWkbpTpJ4ASJfAgMhyr-lLHkbEwd9CJP6X",
    date: "Aug 10, 2026",
    author: "Meera Nair",
    readTime: "5 min read",
    content: `Lippan Kaam (mud mirror work) is a beautiful craft from the Kutch region of Gujarat. If you are starting out, having the right materials makes a massive difference in your results.

Here are the 10 essential tools you need to build your first Lippan art mural:

1. **MDF Board or Plywood Substrate**: A sturdy base is required so your clay doesn't crack or bend. 6mm or 8mm MDF is perfect.
2. **Craft Clay / Mouldit**: Traditional Lippan uses animal dung and mud, but craft clay (epoxy compound) is durable, odorless, and perfect for modern apartments.
3. **Assorted Mirrors (Shisha)**: Diamonds, circles, triangles, and teardrop shapes are the foundation of geometric Kutchi grids.
4. **Fabric Glue / White Glue**: Heavy-duty craft glue to secure both clay lines and mirrors permanently.
5. **Gesso / Acrylic Primer**: Coat your board first to seal it and prevent the wood from absorbing the clay's moisture.
6. **Clay Sculpting Tools**: Plastic or wooden carving toolkits to shape mud lines, leaves, and patterns.
7. **Fine Talcum Powder**: Apply to your hands to stop clay from sticking while rolling long clay threads (carre).
8. **White Acrylic Paint**: To paint the finished mud mural before mirror placement, keeping the traditional monochrome Kutchi look.
9. **Sandpaper**: To smooth out wood edges and dry clay imperfections.
10. **Acrylic Sealer / Varnish**: Protects the clay mural from moisture and dust, ensuring it lasts for years.

Start small, build basic grids, and slowly explore detailed traditional compositions!`
  },
  2: {
    id: 2,
    title: "The Alchemy of Resin: Mastering Curing & Micro-bubbles",
    category: "Materials Guide",
    categoryColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBy_buYnpjKfjRTyIf3XQ4SNX1F_mcq0L-hg4lny14eYJzf7Bwtuw91_n-0PsBT2hdqKBiZtqfHvzPj8K79SpzOVcuH5lJ_Xb-i3oORdHHh0430xLqp6qhligPWzFUjk3vxgs_KF2PiRX-2JQr6LN72XOGb2W66Jx5LwPzy0T88fGx-weg-dtLvZD2SSLhMeqlXDcYntk9dU5uzP_LtGzwyDBovKAk0lHVbByounJVN03xW3d__NxPA",
    date: "Aug 06, 2026",
    author: "Vikram Sharma",
    readTime: "7 min read",
    content: `Resin crafting requires absolute precision. Even small variations in temperature, mixing ratios, or pouring heights can introduce cloudy finishes and micro-bubbles.

Here is a guide to mastering the chemistry:

* **Perfect 2:1 or 1:1 Mixing**: Always use a digital weighing scale or graduated cups. Inaccurate ratios cause sticky, uncured spots.
* **Warm Water Bath**: Keep resin bottles in warm water before mixing. This lowers viscosity and lets trapped bubbles rise out easily.
* **Stir Slowly**: Stir for 3 full minutes in a single direction. Scraping sides and bottom is critical.
* **Torching / Heat Gun**: Run a heat gun over your poured resin to break surface tension and pop bubbles instantly.`
  },
  3: {
    id: 3,
    title: "Sourcing Organic Earth Clay: What EdTech Won't Tell You",
    category: "Materials Guide",
    categoryColor: "bg-tertiary-fixed text-on-tertiary-fixed",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCbTN-TaIudH0njCO5lQnLDpdjSBXonaHMG6x1kUfR2uXaU3Bxee-QSSCUKc_3hc1bwYbqoLL7NkuUAWEXphMhqlZj0UGrH5JKFEqWwuvMewqe0IKttUMNPvDyYvT5VOu5OOT2KLk9GRoWqhQtsYqopj7EjtbduvEldGGe5ADkeQ1K066OVltHrOz2DqpUwcxBAwAUGd1pxzDFD-4yEZpe1-WiuoFTNUcsLqLOtiHOQTnGcvfWTkEy",
    date: "Jul 28, 2026",
    author: "Devendra Joshi",
    readTime: "6 min read",
    content: `Understanding the mineral balance in pottery and sculpting clays is the secret to pieces that do not warp or develop hairline fractures during firing and curing.

Explore the key factors:
- Mineral density and plasticity of earthenware
- Moisture consistency during hand-building
- Avoiding thermal shock with proper progressive drying intervals.`
  },
  4: {
    id: 4,
    title: "Preserving Heritage: Clay Art in Kutch Communities",
    category: "Artisan Spotlight",
    categoryColor: "bg-secondary-fixed text-on-secondary-fixed",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBPiWCQJI93PXDk9BOTIapmtikie4-YaxmLh1RRYduOa_TDE4AQZkdf8DEkTVGR5nS9OSCOgXvKuV_YYJl7XOPbMsOJ2NapTo5sBgHWGuqHmqZjabmFElFjDdYfpq8LsUXrV3nz9yX7Abr5E1fWw9PM_lVq-u8188AjgPz0txpaTpIy1QYYWuyXi3IwoSn_vw542oHbUWJhQ2iOxYf0kpLG7nJ1g6ftWcf9R78bsl9rLf2ndCoywsoF",
    date: "Jul 15, 2026",
    author: "Asha Devi",
    readTime: "8 min read",
    content: `In the heart of the Great Rann of Kutch, artisans have turned their traditional mud homes (bhungas) into living galleries of relief mural art.

From sacred geometry to peacock and floral motifs, this craft unites generations of craftswomen preserving cultural storytelling.`
  },
  5: {
    id: 5,
    title: "Why Artisanal Candle Wax selection is Crucial for Scent Throw",
    category: "Crafting Tips",
    categoryColor: "bg-primary-container text-on-primary-container",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdWftkk77PEWsXT0X8Idf_5qfShUey9va1f3wum-E0_wQoJNhH8DlzGO1jy22TTPACpLEnQy1abVm1vhUtDsMA62pD83tLRBO8N6-irLAYagp8jz-xagrBPejAcQrBrwZzDiv9yycKXiyMImwz2fXE8Ti75v-LV1oM7TZC1DEpm5zIscCEoA4rnAVGfQcAfxeIOZaJ1Y7It8VGiYZDtwrBh2OS8uEZ9TL5ABRz7RQ6Rwxmr6C65H3E",
    date: "Jul 09, 2026",
    author: "Karan Johar",
    readTime: "4 min read",
    content: `A luxury candle is defined by its hot and cold scent throw, clean melt pool, and smooth crystalline finish.

Key techniques covered:
- Finding the right pouring temperature (between 135°F and 145°F for soy blends)
- Percentage load for botanical fragrance and essential oils (6% to 10% optimal)
- Cotton wick sizing to prevent tunneling and carbon mushrooming.`
  },
  6: {
    id: 6,
    title: "Macramé Aesthetics: Bohemian Knots in Modern Homes",
    category: "Community",
    categoryColor: "bg-surface-variant text-on-surface-variant",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVHXmzcgHw7sulCDAb_2pVZHDasOElzMgfYOpkwSglKvHLinvzj21rdsPxypicwnizEKoPexJ1Na-T97ghRpVUopYErNtLhDfD45ZFF1QoglAMu-RCA0-EwCRFZhOcxaYxbPPhKFNBWJJiwjgBrk_B6kk51MBuGYYByp6sai-JomiSRwpZe6nt8MGn_9ZMr4eD4WdQXnXaD8SSKk_xpKDjhN-XmE4k8IC6LLJufKcsw3T7n2EOGjhw",
    date: "Jun 24, 2026",
    author: "Rohan Das",
    readTime: "5 min read",
    content: `Macramé brings organic texture and warmth to modern minimalist and Scandinavian interior spaces.

Explore basic square knots, half-hitches, and spiral cords to create plant hangers, lanterns, and textured tapestries.`
  }
};

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (post()) {
      <main class="min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-12 max-w-3xl mx-auto text-xs text-on-surface">
        <div class="mb-6">
          <a routerLink="/blogs" class="text-primary hover:underline font-semibold flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Blogs
          </a>
        </div>

        <article class="space-y-6">
          <header class="space-y-3">
            <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider {{ post()!.categoryColor }}">
              {{ post()!.category }}
            </span>
            <h1 class="playfair text-2xl md:text-3xl font-extrabold text-on-surface leading-tight">
              {{ post()!.title }}
            </h1>
            <div class="flex gap-4 text-on-surface-variant text-[11px] font-medium">
              <span>By {{ post()!.author }}</span>
              <span>•</span>
              <span>{{ post()!.date }}</span>
              <span>•</span>
              <span>{{ post()!.readTime }}</span>
            </div>
          </header>

          <div class="w-full aspect-[16/9] rounded-xl overflow-hidden border bg-surface-container mb-6">
            <img [src]="post()!.image" class="w-full h-full object-cover" [alt]="post()!.title" />
          </div>

          <div class="prose text-xs text-on-surface-variant leading-relaxed whitespace-pre-line space-y-4">
            {{ post()!.content }}
          </div>
        </article>
      </main>
    } @else {
      <div class="min-h-screen flex items-center justify-center text-xs text-on-surface-variant">
        Loading article...
      </div>
    }
  `
})
export class BlogDetailComponent implements OnInit {
  @Input() id!: string;
  post = signal<BlogPost | null>(null);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const blogId = Number(params.get('id')) || 1;
      this.post.set(POSTS_CONTENT[blogId] || POSTS_CONTENT[1]);
    });
  }
}
