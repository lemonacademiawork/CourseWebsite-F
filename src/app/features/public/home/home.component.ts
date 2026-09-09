import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

export interface CarouselSlide {
  id?: string;
  title: string;
  tagline?: string;
  description?: string;
  imageUrl: string;
  route?: string;
  category?: string;
  order?: number;
  active?: boolean;
  isActive?: boolean;
  queryParams?: Record<string, string>;
}

export type HeroSlide = CarouselSlide;

export const HERO_SLIDES: CarouselSlide[] = [
  {
    title: "Learn. Create. Inspire.",
    tagline: "Master the art of Lippan Mirror Work",
    description: "Explore mirror & clay magic. Discover traditional Indian craft techniques in our modern online studio classes.",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    category: "lippan-art",
    order: 1,
    active: true,
    isActive: true,
    queryParams: { category: "lippan-art" }
  },
  {
    title: "Soothe. Pour. Relax.",
    tagline: "Hand-poured Soy Candle Making",
    description: "Create premium organic botanical candles with rich, calming custom aroma profiles and clean burning wax.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    category: "candle-making",
    order: 2,
    active: true,
    isActive: true,
    queryParams: { category: "candle-making" }
  },
  {
    title: "Pour. Swirl. Glow.",
    tagline: "Ocean Resin Art & Liquid Glass",
    description: "Create ultra-glossy ocean tables, trays, and coaster sets with multi-layer pigment swirls and cell lacing.",
    imageUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    category: "resin-art",
    order: 3,
    active: true,
    isActive: true,
    queryParams: { category: "resin-art" }
  },
  {
    title: "Craft. Design. Innovate.",
    tagline: "Modern Mosaic Art Techniques",
    description: "Assemble colorful ceramic and glass tiles into elegant designs under expert guidance.",
    imageUrl: "https://images.unsplash.com/photo-1569172122301-bc5007ba0977?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    category: "mosaic-art",
    order: 4,
    active: true,
    isActive: true,
    queryParams: { category: "mosaic-art" }
  },
  {
    title: "Shape. Mold. Sculpt.",
    tagline: "Wheel & Hand Pottery Masterclass",
    description: "Learn hand-building, wheel throwing, and organic terracotta sculpting methods to craft timeless vessels.",
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    category: "pottery",
    order: 5,
    active: true,
    isActive: true,
    queryParams: { category: "pottery" }
  },
  {
    title: "Knit. Weave. Express.",
    tagline: "Artisan Crochet & Fiber Crafts",
    description: "Master intricate stitch patterns, amigurumi forms, and tactile macramé knots with step-by-step guidance.",
    imageUrl: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    category: "crochet-fiber-arts",
    order: 6,
    active: true,
    isActive: true,
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
  slides = signal<CarouselSlide[]>(HERO_SLIDES);
  currentSlide = signal<number>(0);
  isLoadingCarousel = signal<boolean>(false);
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
            const activeList = list.filter((item: any) => item && item.active !== false && item.isActive !== false);
            if (activeList.length > 0) {
              this.slides.set(activeList);
              this.startTimer();
            }
          }
        } catch {}
      }
    }

    // 2. Helper to parse and store active slides sorted by order
    const applySlidesData = (data: any[]): boolean => {
      if (!Array.isArray(data) || data.length === 0) return false;

      const activeList: CarouselSlide[] = data
        .filter((item: any) => item && item.active !== false && item.isActive !== false)
        .map((s: any, idx: number) => ({
          id: s.id || String(idx + 1),
          title: s.title || 'Masterclass Studio',
          tagline: s.tagline || '',
          description: s.description || '',
          imageUrl: s.imageUrl || s.url || HERO_SLIDES[idx % HERO_SLIDES.length].imageUrl,
          route: s.route || '/courses',
          category: s.category || '',
          order: s.order !== undefined ? Number(s.order) : idx + 1,
          active: s.active !== false,
          isActive: s.isActive !== false,
          queryParams: s.category ? { category: s.category } : (s.queryParams || undefined)
        }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      if (activeList.length > 0) {
        this.slides.set(activeList);
        if (typeof window !== 'undefined') {
          localStorage.setItem('homepage_carousel', JSON.stringify(activeList));
        }
        this.startTimer();
        return true;
      }
      return false;
    };

    // 3. Fetch from public backend endpoint GET /api/v1/content/carousel
    this.isLoadingCarousel.set(true);
    this.http.get<any>(`${environment.apiUrl}/content/carousel`).subscribe({
      next: (res) => {
        this.isLoadingCarousel.set(false);
        const data = Array.isArray(res) ? res : res?.data;
        if (!applySlidesData(data)) {
          this.tryFallbackEndpoints(applySlidesData);
        }
      },
      error: () => {
        this.tryFallbackEndpoints(applySlidesData);
      }
    });
  }

  private tryFallbackEndpoints(applyFn: (data: any[]) => boolean): void {
    // Fallback 1: GET /api/v1/carousel
    this.http.get<any>(`${environment.apiUrl}/carousel`).subscribe({
      next: (res) => {
        this.isLoadingCarousel.set(false);
        const data = Array.isArray(res) ? res : res?.data;
        if (!applyFn(data)) {
          this.trySettingsFallback(applyFn);
        }
      },
      error: () => {
        this.trySettingsFallback(applyFn);
      }
    });
  }

  private trySettingsFallback(applyFn: (data: any[]) => boolean): void {
    // Fallback 2: GET /api/v1/admin/settings or local defaults
    this.http.get<any>(`${environment.apiUrl}/admin/settings`).subscribe({
      next: (res) => {
        this.isLoadingCarousel.set(false);
        const settings = Array.isArray(res) ? res : res?.data || [];
        if (Array.isArray(settings)) {
          const setting = settings.find((s: any) => s.settingKey === 'homepage_carousel');
          if (setting && setting.settingValue) {
            try {
              const list = JSON.parse(setting.settingValue);
              if (applyFn(list)) return;
            } catch {}
          }
        }
        if (this.slides().length === 0) {
          this.slides.set(HERO_SLIDES);
          this.startTimer();
        }
      },
      error: () => {
        this.isLoadingCarousel.set(false);
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
    return HERO_SLIDES[index % HERO_SLIDES.length].route || '/courses';
  }

  getSlideQueryParams(slide: any, index: number): Record<string, string> | null {
    if (typeof slide === 'object' && slide?.queryParams) return slide.queryParams;
    if (typeof slide === 'object' && slide?.category) return { category: slide.category };
    return HERO_SLIDES[index % HERO_SLIDES.length].queryParams || null;
  }

  getSlideTagline(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.tagline) return slide.tagline;
    return HERO_SLIDES[index % HERO_SLIDES.length].tagline || '';
  }

  getSlideTitle(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.title) return slide.title;
    return HERO_SLIDES[index % HERO_SLIDES.length].title;
  }

  getSlideDescription(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.description) return slide.description;
    return HERO_SLIDES[index % HERO_SLIDES.length].description || '';
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
