import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface HeroSlide {
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Learn. Create. Inspire.",
    tagline: "Master the art of Lippan Mirror Work",
    description: "Explore mirror & clay magic. Discover traditional Indian craft techniques in our modern online studio classes.",
    imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600&h=600"
  },
  {
    title: "Craft. Design. Innovate.",
    tagline: "Modern Mosaic Art Techniques",
    description: "Assemble colorful ceramic and glass tiles into elegant designs under expert guidance.",
    imageUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600"
  },
  {
    title: "Soothe. Pour. Relax.",
    tagline: "Hand-poured Soy Candle Making",
    description: "Create premium organic botanical candles with rich, calming custom aroma profiles.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600"
  },
  {
    title: "Mold. Spin. Glaze.",
    tagline: "Artisanal Pottery Workshops",
    description: "Experience the calming touch of clay on the wheel and learn glazing and throwing from scratch.",
    imageUrl: "https://images.unsplash.com/photo-1565192647048-f997ded87958?auto=format&fit=crop&q=80&w=1600&h=600"
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
  slides = signal<string[]>([]);
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
        const activeList = list.filter((item: any) => item.active).map((item: any) => item.url);
        if (activeList.length > 0) {
          this.slides.set(activeList);
          this.startTimer();
          return;
        }
      } catch {}
    }

    this.slides.set([
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600&h=600",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600",
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600"
    ]);
    this.startTimer();
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
