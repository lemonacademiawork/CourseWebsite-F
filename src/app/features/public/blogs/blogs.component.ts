import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './blogs.component.html'
})
export class BlogsComponent implements OnInit {
  categories = ["All Stories", "Crafting Tips", "Materials Guide", "Artisan Spotlight", "Community"];
  posts = signal<BlogPost[]>(ALL_POSTS);
  selectedCategory = signal<string>("All Stories");
  searchQuery = signal<string>("");

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const customBlogs = localStorage.getItem('custom_blogs');
      if (customBlogs) {
        try {
          const parsed = JSON.parse(customBlogs);
          this.posts.set([...parsed, ...ALL_POSTS]);
        } catch {}
      }
    }
  }

  get filteredPosts(): BlogPost[] {
    const q = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();

    return this.posts().filter(post => {
      const matchesCategory = cat === "All Stories" || post.category === cat;
      const matchesSearch = post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }

  get featuredPost(): BlogPost {
    return this.posts()[0] || ALL_POSTS[0];
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }
}
