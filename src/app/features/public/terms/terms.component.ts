import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const SECTIONS = [
  { id: 'acceptance', label: '1. Acceptance of Terms' },
  { id: 'accounts', label: '2. Registration & Security' },
  { id: 'intellectual', label: '3. Intellectual Property' },
  { id: 'payments', label: '4. Fees & Billing' },
  { id: 'refunds', label: '5. Cancellations & Refunds' },
  { id: 'liability', label: '6. Limitation of Liability' },
  { id: 'governing', label: '7. Governing Law' },
];

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="bg-surface min-h-screen text-on-surface py-12 md:py-16 text-xs">
      <div class="max-w-[1200px] mx-auto px-4 mb-12">
        <span class="bg-primary-container text-on-primary-container text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full inline-block mb-3">
          Legal
        </span>
        <h1 class="text-4xl md:text-5xl font-extrabold text-on-surface mb-2 playfair">
          Terms of Service
        </h1>
        <p class="text-on-surface-variant text-xs md:text-sm">
          Effective Date: August 19, 2026 | Last Updated: August 19, 2026
        </p>
      </div>

      <div class="max-w-[1200px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-12 relative">
        <div class="hidden lg:block lg:col-span-1">
          <div class="sticky top-28 bg-surface-container-low border border-outline-variant/30 rounded-3xl p-6 space-y-3">
            <h4 class="font-bold text-xs uppercase tracking-wider text-outline mb-2">Sections</h4>
            <nav class="flex flex-col space-y-1">
              @for (section of sections; track section.id) {
                <button
                  (click)="scrollToSection(section.id)"
                  class="text-left text-xs font-semibold py-2 px-3 rounded-xl transition-all cursor-pointer"
                  [class.bg-primary]="activeSection() === section.id"
                  [class.text-white]="activeSection() === section.id"
                  [class.font-bold]="activeSection() === section.id"
                  [class.shadow-sm]="activeSection() === section.id"
                  [class.text-on-surface-variant]="activeSection() !== section.id"
                  [class.hover:bg-surface-container]="activeSection() !== section.id">
                  {{ section.label }}
                </button>
              }
            </nav>
          </div>
        </div>

        <div class="lg:col-span-3 space-y-12 leading-relaxed text-sm md:text-base text-on-surface-variant font-body-md">
          <section id="acceptance" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Lemon Academia, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <hr class="border-outline-variant/25" />

          <section id="accounts" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">2. Registration &amp; Security</h2>
            <p>
              You must maintain the confidentiality of your account credentials. You are responsible for all activities that occur under your account.
            </p>
          </section>

          <hr class="border-outline-variant/25" />

          <section id="intellectual" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">3. Intellectual Property</h2>
            <p>
              All course curriculum, videos, blueprints, and branding are the exclusive property of Lemon Academia and its master instructors. Unauthorized recording or duplication is strictly prohibited.
            </p>
          </section>

          <hr class="border-outline-variant/25" />

          <section id="payments" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">4. Fees &amp; Billing</h2>
            <p>
              Course and workshop fees are billed upfront at checkout. Lifetime access is granted immediately upon successful transaction completion.
            </p>
          </section>

          <hr class="border-outline-variant/25" />

          <section id="refunds" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">5. Cancellations &amp; Refunds</h2>
            <p>
              We offer a 14-day refund window for digital courses if less than 20% of the lessons have been completed.
            </p>
          </section>

          <hr class="border-outline-variant/25" />

          <section id="liability" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">6. Limitation of Liability</h2>
            <p>
              Lemon Academia provides educational crafting tutorials. Users must take reasonable workshop safety precautions when using resin, ceramic cutters, and clay heat tools.
            </p>
          </section>

          <hr class="border-outline-variant/25" />

          <section id="governing" class="space-y-4 scroll-mt-24">
            <h2 class="text-xl md:text-2xl font-extrabold text-on-surface playfair">7. Governing Law</h2>
            <p>
              These Terms are governed by and construed in accordance with standard statutory laws of India.
            </p>
          </section>
        </div>
      </div>
    </main>
  `
})
export class TermsComponent implements OnInit, OnDestroy {
  sections = SECTIONS;
  activeSection = signal<string>('acceptance');

  private scrollHandler = () => {
    if (typeof window === 'undefined') return;
    const scrollPosition = window.scrollY + 160;

    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const top = element.offsetTop;
        const height = element.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          this.activeSection.set(section.id);
          break;
        }
      }
    }
  };

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.scrollHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  scrollToSection(id: string): void {
    if (typeof document !== 'undefined') {
      const element = document.getElementById(id);
      if (element) {
        const offsetTop = element.offsetTop - 100;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        this.activeSection.set(id);
      }
    }
  }
}
