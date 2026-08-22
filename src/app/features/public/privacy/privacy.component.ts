import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'collection', label: '1. Information We Collect' },
  { id: 'usage', label: '2. How We Use Information' },
  { id: 'sharing', label: '3. Sharing & Disclosures' },
  { id: 'security', label: '4. Data Security' },
  { id: 'cookies', label: '5. Cookies & Tracking' },
  { id: 'rights', label: '6. Your Privacy Rights' },
  { id: 'updates', label: '7. Policy Updates' },
];

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy.component.html'
})
export class PrivacyComponent implements OnInit, OnDestroy {
  sections = SECTIONS;
  activeSection = signal<string>('introduction');

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
