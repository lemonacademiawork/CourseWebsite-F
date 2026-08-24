import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

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
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses/lippan-art"
  },
  {
    title: "Soothe. Pour. Relax.",
    tagline: "Hand-poured Soy Candle Making",
    description: "Create premium organic botanical candles with rich, calming custom aroma profiles and clean burning wax.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: 'candle-making' }
  },
  {
    title: "Pour. Swirl. Glow.",
    tagline: "Ocean Resin Art & Liquid Glass",
    description: "Create ultra-glossy ocean tables, trays, and coaster sets with multi-layer pigment swirls and cell lacing.",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: 'resin-art' }
  },
  {
    title: "Craft. Design. Innovate.",
    tagline: "Modern Mosaic Art Techniques",
    description: "Assemble colorful ceramic and glass tiles into elegant designs under expert guidance.",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600",
    route: "/courses",
    queryParams: { category: 'mosaic-art' }
  }
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  heroSlides = HERO_SLIDES;
  slides = signal<any[]>([]);
  currentSlide = signal<number>(0);
  private timer: any;

  private carouselListener = () => this.loadCarousel();

  ngOnInit(): void {
    this.loadCarousel();
    if (typeof window !== 'undefined') {
      window.addEventListener('carousel_updated', this.carouselListener);
    }
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (typeof window !== 'undefined') {
      window.removeEventListener('carousel_updated', this.carouselListener);
    }
  }

  loadCarousel(): void {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('homepage_carousel');
    if (stored) {
      try {
        const list = JSON.parse(stored);
        const activeList = list.filter((item: any) => item.active !== false);
        if (activeList.length > 0) {
          this.slides.set(activeList);
          this.startTimer();
          return;
        }
      } catch {}
    }

    this.slides.set(HERO_SLIDES);
    this.startTimer();
  }

  getSlideUrl(slide: any, index: number): string {
    if (typeof slide === 'string') return slide;
    return slide?.imageUrl || slide?.url || HERO_SLIDES[index % HERO_SLIDES.length].imageUrl;
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
