import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CarouselItem {
  id: string;
  url: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-carousel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Homepage Hero Carousel</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Manage banners and promotional slides displayed on the homepage.</p>
        </div>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 shadow-sm space-y-6">
        <h3 class="font-bold text-sm">Add New Banner Image URL</h3>
        <div class="flex gap-3">
          <input 
            type="url" 
            placeholder="https://images.unsplash.com/photo-..."
            [ngModel]="newUrl()"
            (ngModelChange)="newUrl.set($event)"
            class="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
          />
          <button 
            (click)="handleAdd()"
            class="px-5 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer">
            Add Slide
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
          @for (item of images(); track item.id) {
            <div class="border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low relative group">
              <img [src]="item.url" class="w-full h-36 object-cover" alt="Banner slide" />
              <div class="p-3 flex justify-between items-center bg-surface-container-lowest">
                <span class="text-[11px] font-semibold">Slide #{{ item.id }}</span>
                <button 
                  (click)="handleDelete(item.id)"
                  class="text-red-600 hover:text-red-700 font-semibold cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </main>
  `
})
export class AdminCarouselComponent implements OnInit {
  images = signal<CarouselItem[]>([]);
  newUrl = signal<string>('');

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('homepage_carousel');
      if (stored) {
        this.images.set(JSON.parse(stored));
      } else {
        const defaults: CarouselItem[] = [
          { id: '1', url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600&h=600", active: true },
          { id: '2', url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1600&h=600", active: true },
          { id: '3', url: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1600&h=600", active: true }
        ];
        this.images.set(defaults);
        localStorage.setItem('homepage_carousel', JSON.stringify(defaults));
      }
    }
  }

  save(newList: CarouselItem[]): void {
    this.images.set(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem('homepage_carousel', JSON.stringify(newList));
      window.dispatchEvent(new Event('carousel_updated'));
    }
  }

  handleAdd(): void {
    if (!this.newUrl().trim()) return;
    const newItem: CarouselItem = {
      id: Date.now().toString(),
      url: this.newUrl().trim(),
      active: true
    };
    this.save([...this.images(), newItem]);
    this.newUrl.set('');
  }

  handleDelete(id: string): void {
    this.save(this.images().filter(i => i.id !== id));
  }
}
