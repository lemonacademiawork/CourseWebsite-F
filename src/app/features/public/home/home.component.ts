import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Title, Meta } from '@angular/platform-browser';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { CategoryService } from '../../../core/services/category.service';
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
export const HERO_SLIDES: CarouselSlide[] = [];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private http = inject(HttpClient);
  public authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private categoryService = inject(CategoryService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  slides = signal<CarouselSlide[]>([]);
  currentSlide = signal<number>(0);
  isLoadingCarousel = signal<boolean>(true);
  enrolledCourses = signal<any[]>([]);
  private timer: any;

  // Category images mapping for artisan aesthetic
  categoryImages: Record<string, string> = {
    'texture-art': 'https://i.pinimg.com/736x/04/51/1b/04511b15d6dc9c0dc1fb937862cfa820.jpg',
    'lippan-art': 'https://i.pinimg.com/736x/5f/79/50/5f7950ee34ed08c6742c9b94a28a4ada.jpg',
    'pipe-cleaners': 'https://i.pinimg.com/736x/35/73/7f/35737f65e7b60630f82c3d4f0bca1ab4.jpg',
    'resin-art': 'https://i.pinimg.com/736x/3e/6d/45/3e6d457c07029e2fd6904cf4b7beb11a.jpg',
    'candle-making': 'https://i.pinimg.com/736x/90/0e/aa/900eaaeede865070448f865f3afc9185.jpg',
    'artisan-soap-making': 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=800'
  };

  defaultFeaturedCategories = [
    { name: 'Texture Art', slug: 'texture-art', imageUrl: 'https://i.pinimg.com/736x/04/51/1b/04511b15d6dc9c0dc1fb937862cfa820.jpg' },
    { name: 'Lippan Art', slug: 'lippan-art', imageUrl: 'https://i.pinimg.com/736x/5f/79/50/5f7950ee34ed08c6742c9b94a28a4ada.jpg' },
    { name: 'Candle Making', slug: 'candle-making', imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800' }
  ];

  featuredCategories = signal<any[]>(this.defaultFeaturedCategories);

  // FAQ Accordion State & Data
  openFaqIndex = signal<number | null>(0);

  faqs = [
    {
      question: 'Will I receive a certificate upon completing a course?',
      answer: 'Yes! Once you complete all video modules and finish your hands-on craft project, you will be awarded an official Lemon Academy Certificate of Completion signed by your master artisan to celebrate and showcase your craft accomplishment.'
    },
    {
      question: 'Is learning flexible with lifetime access?',
      answer: 'Yes, completely. Every masterclass enrollment includes unrestricted lifetime access to HD video tutorials, material guides, and process checklists. You can learn at your own pace, anytime, anywhere, on desktop or mobile.'
    },
    {
      question: 'Do I need any prior art or crafting experience?',
      answer: 'Not at all! Our courses are built for complete beginners as well as experienced hobbyists. Master artisans break down every technique from basic material handling and tools to advanced embellishment step-by-step.'
    },
    {
      question: 'Are raw materials and DIY kits included?',
      answer: 'Yes! Our masterclasses feature complete DIY craft kits curated in partnership with Lemon House Craft, delivered straight to your doorstep so you have everything needed to create right out of the box.'
    },
    {
      question: 'How can I ask questions if I need help during the class?',
      answer: 'You have direct access to live instructor Q&A sessions, community student galleries, and dedicated class support to clear any questions about craft techniques, drying times, or materials.'
    }
  ];

  toggleFaq(index: number): void {
    this.openFaqIndex.update(current => (current === index ? null : index));
  }

  ngOnInit(): void {
    // Dynamic SEO
    this.titleService.setTitle('Lemon Academy | Learn Artisan Crafts, Lippan Art & Soap Making');
    this.metaService.updateTag({ name: 'description', content: 'Lemon Academy is the premier craft academy for artisan masterclasses in Lippan Kaam, Cold-Process Soap Making, and Epoxy Resin Art.' });
    this.metaService.updateTag({ property: 'og:title', content: 'Lemon Academy — Artisan Craft Masterclasses' });
    this.metaService.updateTag({ property: 'og:description', content: 'Learn hands-on craft skills from master instructors with full physical DIY materials kits.' });

    this.loadCarousel();
    this.loadEnrolledCourses();
    this.loadCategories();

    if (typeof window !== 'undefined') {
      window.addEventListener('carousel_updated', () => this.loadCarousel());
      window.addEventListener('storage', () => this.loadCarousel());
      window.addEventListener('auth_state_changed', () => this.loadEnrolledCourses());
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          const top3 = cats.slice(0, 3).map(c => {
            const slug = (c.slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const img = this.getCategoryImageUrl(c);
            return {
              id: c.id,
              name: c.name,
              slug: c.slug || slug,
              imageUrl: img
            };
          });
          this.featuredCategories.set(top3);
        }
      },
      error: () => {
        this.featuredCategories.set(this.defaultFeaturedCategories);
      }
    });
  }

  getCategoryImageUrl(c: any): string {
    const slug = (c.slug || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (this.categoryImages[slug]) {
      return this.categoryImages[slug];
    }
    if (c.imageUrl && !c.imageUrl.includes('photo-1584992236310-6edddc08acff')) {
      return c.imageUrl;
    }
    return this.categoryImages[slug] || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
  }

  loadEnrolledCourses(): void {
    if (this.authService.isLoggedIn()) {
      this.enrollmentService.getEnrollments().subscribe({
        next: (list) => this.enrolledCourses.set(list || []),
        error: () => this.enrolledCourses.set([])
      });
    } else {
      this.enrolledCourses.set([]);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  /** Parse raw slide data from backend into typed CarouselSlide array */
  private parseSlides(data: any[]): CarouselSlide[] {
    return (data || [])
      .filter((item: any) => item && item.active !== false && item.isActive !== false)
      .map((s: any, idx: number) => ({
        id: s.id || String(idx + 1),
        title: s.title || s.heading || 'Artisan Workshop',
        tagline: s.tagline || s.subtitle || s.subTitle || '',
        description: s.description || '',
        imageUrl: s.imageUrl || s.url || s.image || s.bannerUrl || s.src || '',
        route: s.route || s.link || '/courses',
        category: s.category || '',
        order: s.order !== undefined ? Number(s.order) : idx + 1,
        active: s.active !== false,
        isActive: s.isActive !== false,
        queryParams: s.category ? { category: s.category } : (s.queryParams || undefined)
      }))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  loadCarousel(): void {
    this.isLoadingCarousel.set(true);
    this.http.get<any>(`${environment.apiUrl}/content/carousel`).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (this.applyBackendData(data)) {
          this.isLoadingCarousel.set(false);
          return;
        }
        this.tryFallbackEndpoints();
      },
      error: () => {
        this.tryFallbackEndpoints();
      }
    });
  }

  private applyBackendData(data: any[]): boolean {
    if (!Array.isArray(data) || data.length === 0) return false;
    const activeList = this.parseSlides(data);
    if (activeList.length > 0) {
      this.slides.set(activeList);
      this.startTimer();
      return true;
    }
    return false;
  }

  private tryFallbackEndpoints(): void {
    this.http.get<any>(`${environment.apiUrl}/carousel`).subscribe({
      next: (res) => {
        const data = Array.isArray(res) ? res : res?.data;
        if (this.applyBackendData(data)) {
          this.isLoadingCarousel.set(false);
          return;
        }
        this.trySettingsFallback();
      },
      error: () => {
        this.trySettingsFallback();
      }
    });
  }

  private trySettingsFallback(): void {
    this.http.get<any>(`${environment.apiUrl}/admin/settings`).subscribe({
      next: (res) => {
        this.isLoadingCarousel.set(false);
        const settings = Array.isArray(res) ? res : res?.data || [];
        if (Array.isArray(settings)) {
          const setting = settings.find((s: any) => s.settingKey === 'homepage_carousel');
          if (setting && setting.settingValue) {
            try {
              const list = JSON.parse(setting.settingValue);
              if (this.applyBackendData(list)) return;
            } catch {}
          }
        }
      },
      error: () => {
        this.isLoadingCarousel.set(false);
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
    if (!slide) return '';
    if (typeof slide === 'string') return slide;
    return slide.imageUrl || slide.url || slide.image || slide.bannerUrl || slide.src || '';
  }

  getSlideRoute(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.route) return slide.route;
    if (typeof slide === 'object' && slide?.link) return slide.link;
    return '/courses';
  }

  getSlideQueryParams(slide: any, index: number): Record<string, string> | null {
    if (typeof slide === 'object' && slide?.queryParams) return slide.queryParams;
    if (typeof slide === 'object' && slide?.category) return { category: slide.category };
    return null;
  }

  getSlideTagline(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.tagline) return slide.tagline;
    return '';
  }

  getSlideTitle(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.title) return slide.title;
    return 'Artisan Masterclass';
  }

  getSlideDescription(slide: any, index: number): string {
    if (typeof slide === 'object' && slide?.description) return slide.description;
    return '';
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
