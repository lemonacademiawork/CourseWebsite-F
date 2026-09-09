import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface HeroSlide {
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  route: string;
  queryParams?: Record<string, string>;
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Learn. Create. Inspire.",
    tagline: "Master the art of Lippan Mirror Work",
    description: "Explore mirror & clay magic. Discover traditional Indian craft techniques in our modern online studio classes.",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: "lippan-art" }
  },
  {
    title: "Soothe. Pour. Relax.",
    tagline: "Hand-poured Soy Candle Making",
    description: "Create premium organic botanical candles with rich, calming custom aroma profiles and clean burning wax.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: "candle-making" }
  },
  {
    title: "Pour. Swirl. Glow.",
    tagline: "Ocean Resin Art & Liquid Glass",
    description: "Create ultra-glossy ocean tables, trays, and coaster sets with multi-layer pigment swirls and cell lacing.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: "resin-art" }
  },
  {
    title: "Craft. Design. Innovate.",
    tagline: "Modern Mosaic Art Techniques",
    description: "Assemble colorful ceramic and glass tiles into elegant designs under expert guidance.",
    imageUrl: "https://images.unsplash.com/photo-1569172122301-bc5007ba0977?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: "mosaic-art" }
  },
  {
    title: "Shape. Mold. Sculpt.",
    tagline: "Wheel & Hand Pottery Masterclass",
    description: "Learn hand-building, wheel throwing, and organic terracotta sculpting methods to craft timeless vessels.",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: "pottery" }
  },
  {
    title: "Knit. Weave. Express.",
    tagline: "Artisan Crochet & Fiber Crafts",
    description: "Master intricate stitch patterns, amigurumi forms, and tactile macramé knots with step-by-step guidance.",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: "crochet-fiber-arts" }
  }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);

  heroSlides = HERO_SLIDES;
  slides = signal<any[]>(HERO_SLIDES);
  currentSlide = signal<number>(0);
  private timer: any;

  private reloadHandler = () => this.loadCarousel();

  ngOnInit(): void {
    this.loadCarousel();
    if (typeof window !== 'undefined') {
      window.addEventListener('carousel_updated', this.reloadHandler);
      window.addEventListener('storage', this.reloadHandler);
      window.addEventListener('focus', this.reloadHandler);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (typeof window !== 'undefined') {
      window.removeEventListener('carousel_updated', this.reloadHandler);
      window.removeEventListener('storage', this.reloadHandler);
      window.removeEventListener('focus', this.reloadHandler);
    }
  }

  loadCarousel(): void {
    // 1. Check localStorage first for instant display
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('homepage_carousel');
      if (stored) {
        try {
          const list = JSON.parse(stored);
          if (Array.isArray(list)) {
            const activeList = list.filter((item: any) => item && item.active !== false);
            if (activeList.length > 0) {
              this.slides.set(activeList);
              this.startTimer();
            }
          }
        } catch {}
      }
    }

    // 2. Fetch from backend system settings to ensure cross-device synchronization
    this.http.get<any>(`${environment.apiUrl}/admin/settings`).subscribe({
      next: (res) => {
        const settings = Array.isArray(res) ? res : res?.data || [];
        if (Array.isArray(settings)) {
          const carouselSetting = settings.find((s: any) => s.settingKey === 'homepage_carousel');
          if (carouselSetting && carouselSetting.settingValue) {
            try {
              const list = JSON.parse(carouselSetting.settingValue);
              if (Array.isArray(list)) {
                const activeList = list.filter((item: any) => item && item.active !== false);
                if (activeList.length > 0) {
                  this.slides.set(activeList);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('homepage_carousel', carouselSetting.settingValue);
                  }
                  this.startTimer();
                }
              }
            } catch {}
          }
        }
      },
      error: () => {
        // Fallback to current slides if backend fails
        if (this.slides().length === 0) {
          this.slides.set(HERO_SLIDES);
          this.startTimer();
        }
      }
    });
  }

  navigateToSlide(slide: any, index: number): void {
    const route = this.getSlideRoute(slide, index);
    const queryParams = this.getSlideQueryParams(slide, index);
    if (queryParams) {
      this.router.navigate([route], { queryParams });
    } else {
      this.router.navigate([route]);
    }
  }

  getSlideUrl(slide: any, index: number): string {
    if (!slide) return HERO_SLIDES[index % HERO_SLIDES.length].imageUrl;
    if (typeof slide === 'string') return slide;
    return slide.imageUrl || slide.url || HERO_SLIDES[index % HERO_SLIDES.length].imageUrl;
  }

  getSlideRoute(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.route) return slide.route;
    if (typeof slide === 'object' && slide?.link) return slide.link;
    return HERO_SLIDES[index % HERO_SLIDES.length].route;
  }

  getSlideQueryParams(slide: any, index: number): Record<string, string> | null {
    if (typeof slide === 'object' && slide?.queryParams) return slide.queryParams;
    return HERO_SLIDES[index % HERO_SLIDES.length].queryParams || null;
  }

  getSlideTagline(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.tagline) return slide.tagline;
    return HERO_SLIDES[index % HERO_SLIDES.length].tagline;
  }

  getSlideTitle(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.title) return slide.title;
    return HERO_SLIDES[index % HERO_SLIDES.length].title;
  }

  getSlideDescription(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.description) return slide.description;
    return HERO_SLIDES[index % HERO_SLIDES.length].description;
  }

  startTimer(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.slides().length <= 1) return;
    this.timer = setInterval(() => {
      this.currentSlide.update(prev => (prev + 1) % this.slides().length);
    }, 5000);
  }

  nextSlide(): void {
    if (this.slides().length <= 1) return;
    this.currentSlide.update(prev => (prev + 1) % this.slides().length);
  }

  prevSlide(): void {
    if (this.slides().length <= 1) return;
    this.currentSlide.update(prev => (prev - 1 + this.slides().length) % this.slides().length);
  }

  setSlide(index: number): void {
    this.currentSlide.set(index);
  }
}
