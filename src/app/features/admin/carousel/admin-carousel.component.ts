import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { UploadService } from '../../../core/services/upload.service';
import { HERO_SLIDES, HeroSlide } from '../../public/home/home.component';

export interface AdminCarouselSlide {
  id: string;
  title: string;
  tagline: string;
  description: string;
  imageUrl: string;
  route: string;
  category?: string;
  active: boolean;
}

@Component({
  selector: 'app-admin-carousel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Homepage Hero Carousel Management</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Manage slides and craft promotions displayed on the homepage.</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            (click)="openAddSlideModal()" 
            class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-sm">add_photo_alternate</span>
            Add Slide
          </button>
          <button 
            (click)="resetToDefaults()" 
            class="bg-surface-container-high text-on-surface font-semibold px-3.5 py-2.5 rounded-lg hover:bg-surface-dim flex items-center gap-1.5 shadow-xs cursor-pointer">
            <span class="material-symbols-outlined text-sm">restart_alt</span>
            Reset 6 Defaults
          </button>
        </div>
      </div>

      <!-- Slide Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        @for (slide of slides(); track slide.id; let i = $index) {
          <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div class="h-44 bg-surface-container-low relative overflow-hidden">
              <img [src]="slide.imageUrl" [alt]="slide.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
              
              <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span class="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                  Slide #{{ i + 1 }}
                </span>
                @if (slide.active) {
                  <span class="bg-green-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">Active</span>
                } @else {
                  <span class="bg-neutral-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">Hidden</span>
                }
              </div>

              <div class="absolute bottom-2.5 left-3 right-3 text-white">
                <span class="text-[9px] uppercase tracking-wider font-semibold text-primary-fixed block truncate">{{ slide.tagline }}</span>
                <h3 class="font-bold text-sm text-white drop-shadow truncate">{{ slide.title }}</h3>
              </div>
            </div>

            <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p class="text-[11px] text-on-surface-variant line-clamp-2">{{ slide.description }}</p>
              
              <div class="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                <span class="text-on-surface-variant truncate max-w-[140px]">
                  Target: <span class="font-semibold text-on-surface">{{ slide.category || slide.route }}</span>
                </span>
                
                <div class="flex items-center gap-1">
                  <button (click)="moveSlide(i, -1)" [disabled]="i === 0" class="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">arrow_upward</span>
                  </button>
                  <button (click)="moveSlide(i, 1)" [disabled]="i === slides().length - 1" class="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">arrow_downward</span>
                  </button>
                  <button (click)="toggleSlideActive(slide)" class="p-1 text-on-surface-variant hover:text-primary cursor-pointer">
                    <span class="material-symbols-outlined text-sm">{{ slide.active ? 'visibility' : 'visibility_off' }}</span>
                  </button>
                  <button (click)="openEditSlideModal(slide)" class="p-1 text-primary hover:text-primary/80 font-bold cursor-pointer">
                    <span class="material-symbols-outlined text-sm">edit</span>
                  </button>
                  <button (click)="deleteSlide(slide.id)" class="p-1 text-red-600 hover:text-red-700 cursor-pointer">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Add / Edit Modal -->
      @if (isSlideModalOpen()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 class="font-bold text-base text-on-surface">{{ editingSlideId() ? 'Edit Slide' : 'Add New Slide' }}</h3>
              <button (click)="isSlideModalOpen.set(false)" class="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <div class="space-y-3">
              <!-- File upload helper -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Slide Banner Image</label>
                <input 
                  #modalFileInput 
                  type="file" 
                  (change)="onModalFileSelected($event)" 
                  accept="image/png,image/jpeg,image/webp,image/jpg" 
                  class="hidden" 
                />
                <button 
                  type="button" 
                  (click)="modalFileInput.click()" 
                  [disabled]="isModalUploading()"
                  class="w-full mb-2 py-2 px-3 bg-surface-container-high hover:bg-surface-dim text-on-surface rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs border border-outline-variant/30">
                  @if (isModalUploading()) {
                    <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                    <span>Uploading...</span>
                  } @else {
                    <span class="material-symbols-outlined text-sm text-primary">cloud_upload</span>
                    <span>Upload Image from Device</span>
                  }
                </button>
                <input type="url" [ngModel]="modalSlide().imageUrl" (ngModelChange)="updateModalField('imageUrl', $event)" placeholder="Or enter direct image URL" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>

              @if (modalSlide().imageUrl) {
                <div class="rounded-xl overflow-hidden h-28 border border-outline-variant/30 bg-surface-container-low relative">
                  <img [src]="modalSlide().imageUrl" class="w-full h-full object-cover" alt="Preview" />
                </div>
              }

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Main Title</label>
                <input type="text" [ngModel]="modalSlide().title" (ngModelChange)="updateModalField('title', $event)" placeholder="e.g. Learn. Create. Inspire." class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Tagline</label>
                <input type="text" [ngModel]="modalSlide().tagline" (ngModelChange)="updateModalField('tagline', $event)" placeholder="e.g. Master the art of Lippan Mirror Work" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Description</label>
                <textarea rows="2" [ngModel]="modalSlide().description" (ngModelChange)="updateModalField('description', $event)" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Target Category</label>
                  <input type="text" [ngModel]="modalSlide().category" (ngModelChange)="updateModalField('category', $event)" placeholder="e.g. lippan-art" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
                </div>
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Route</label>
                  <input type="text" [ngModel]="modalSlide().route" (ngModelChange)="updateModalField('route', $event)" placeholder="/courses" class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none" />
                </div>
              </div>

              <div class="flex items-center gap-2 pt-2">
                <input type="checkbox" id="modalActive" [checked]="modalSlide().active" (change)="updateModalField('active', $any($event.target).checked)" class="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" />
                <label for="modalActive" class="font-semibold text-xs text-on-surface cursor-pointer">Active on Homepage</label>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              <button (click)="isSlideModalOpen.set(false)" class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-dim cursor-pointer">Cancel</button>
              <button (click)="saveSlideModal()" [disabled]="isModalUploading()" class="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 cursor-pointer shadow-sm disabled:opacity-50">Save</button>
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class AdminCarouselComponent implements OnInit {
  private adminService = inject(AdminService);
  private uploadService = inject(UploadService);

  slides = signal<AdminCarouselSlide[]>([]);
  isSlideModalOpen = signal<boolean>(false);
  isModalUploading = signal<boolean>(false);
  editingSlideId = signal<string | null>(null);
  modalSlide = signal<AdminCarouselSlide>({
    id: '',
    title: '',
    tagline: '',
    description: '',
    imageUrl: '',
    route: '/courses',
    category: '',
    active: true
  });

  ngOnInit(): void {
    this.loadCarousel();
  }

  loadCarousel(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('homepage_carousel');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            this.slides.set(parsed.map((item: any, idx: number) => ({
              id: item.id || String(idx + 1),
              title: item.title || HERO_SLIDES[idx % HERO_SLIDES.length].title,
              tagline: item.tagline || HERO_SLIDES[idx % HERO_SLIDES.length].tagline,
              description: item.description || HERO_SLIDES[idx % HERO_SLIDES.length].description,
              imageUrl: item.imageUrl || item.url || HERO_SLIDES[idx % HERO_SLIDES.length].imageUrl,
              route: item.route || '/courses',
              category: item.category || (item.queryParams ? item.queryParams['category'] : '') || '',
              active: item.active !== false
            })));
          }
        } catch {}
      }
    }

    this.adminService.getSettings().subscribe({
      next: (settings) => {
        const carouselSetting = settings.find(s => s.settingKey === 'homepage_carousel');
        if (carouselSetting && carouselSetting.settingValue) {
          try {
            const parsed = JSON.parse(carouselSetting.settingValue);
            if (Array.isArray(parsed) && parsed.length > 0) {
              this.slides.set(parsed.map((item: any, idx: number) => ({
                id: item.id || String(idx + 1),
                title: item.title || HERO_SLIDES[idx % HERO_SLIDES.length].title,
                tagline: item.tagline || HERO_SLIDES[idx % HERO_SLIDES.length].tagline,
                description: item.description || HERO_SLIDES[idx % HERO_SLIDES.length].description,
                imageUrl: item.imageUrl || item.url || HERO_SLIDES[idx % HERO_SLIDES.length].imageUrl,
                route: item.route || '/courses',
                category: item.category || (item.queryParams ? item.queryParams['category'] : '') || '',
                active: item.active !== false
              })));
              if (typeof window !== 'undefined') {
                localStorage.setItem('homepage_carousel', carouselSetting.settingValue);
              }
              return;
            }
          } catch {}
        }
        if (this.slides().length === 0) {
          this.resetToDefaults();
        }
      },
      error: () => {
        if (this.slides().length === 0) {
          this.resetToDefaults();
        }
      }
    });
  }

  resetToDefaults(): void {
    const defaultSlides: AdminCarouselSlide[] = HERO_SLIDES.map((slide, index) => ({
      id: String(index + 1),
      title: slide.title,
      tagline: slide.tagline,
      description: slide.description,
      imageUrl: slide.imageUrl,
      route: slide.route,
      category: slide.queryParams?.['category'] || '',
      active: true
    }));
    this.saveSlides(defaultSlides);
  }

  saveSlides(newSlides: AdminCarouselSlide[]): void {
    this.slides.set(newSlides);
    const payload = newSlides.map(s => ({
      id: s.id,
      title: s.title,
      tagline: s.tagline,
      description: s.description,
      imageUrl: s.imageUrl,
      url: s.imageUrl,
      route: s.route,
      category: s.category,
      queryParams: s.category ? { category: s.category } : undefined,
      active: s.active
    }));
    const jsonStr = JSON.stringify(payload);

    if (typeof window !== 'undefined') {
      localStorage.setItem('homepage_carousel', jsonStr);
      window.dispatchEvent(new Event('carousel_updated'));
      try {
        window.dispatchEvent(new StorageEvent('storage', { key: 'homepage_carousel', newValue: jsonStr }));
      } catch {}
    }

    this.adminService.updateSetting({
      settingKey: 'homepage_carousel',
      settingValue: jsonStr,
      description: 'Homepage Hero Carousel Slides'
    }).subscribe({
      error: (err) => console.warn('Setting save notice:', err)
    });
  }

  onModalFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isModalUploading.set(true);

      this.uploadService.uploadImage(file, 'carousel').subscribe({
        next: (res: any) => {
          this.isModalUploading.set(false);
          const uploadedUrl = res.url || res.secure_url || res.data?.url;
          this.updateModalField('imageUrl', uploadedUrl);
        },
        error: () => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.isModalUploading.set(false);
            this.updateModalField('imageUrl', e.target.result);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  openAddSlideModal(): void {
    this.editingSlideId.set(null);
    this.modalSlide.set({
      id: Date.now().toString(),
      title: '',
      tagline: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1600&h=600',
      route: '/courses',
      category: '',
      active: true
    });
    this.isSlideModalOpen.set(true);
  }

  openEditSlideModal(slide: AdminCarouselSlide): void {
    this.editingSlideId.set(slide.id);
    this.modalSlide.set({ ...slide });
    this.isSlideModalOpen.set(true);
  }

  updateModalField(field: keyof AdminCarouselSlide, value: any): void {
    this.modalSlide.update(prev => ({ ...prev, [field]: value }));
  }

  saveSlideModal(): void {
    const current = this.modalSlide();
    if (!current.title.trim() || !current.imageUrl.trim()) return;

    if (this.editingSlideId()) {
      const updated = this.slides().map(s => s.id === this.editingSlideId() ? current : s);
      this.saveSlides(updated);
    } else {
      this.saveSlides([...this.slides(), current]);
    }
    this.isSlideModalOpen.set(false);
  }

  deleteSlide(id: string): void {
    if (confirm('Delete this slide?')) {
      const updated = this.slides().filter(s => s.id !== id);
      this.saveSlides(updated);
    }
  }

  toggleSlideActive(slide: AdminCarouselSlide): void {
    const updated = this.slides().map(s => s.id === slide.id ? { ...s, active: !s.active } : s);
    this.saveSlides(updated);
  }

  moveSlide(index: number, direction: number): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.slides().length) return;
    const list = [...this.slides()];
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
    this.saveSlides(list);
  }
}
