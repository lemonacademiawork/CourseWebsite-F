import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { UploadService } from '../../../core/services/upload.service';
import { Course } from '../../../core/models/course.model';
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
  selector: 'app-admin-content',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface space-y-6">
      <!-- Hidden file input for quick direct upload -->
      <input 
        #directFileInput 
        type="file" 
        (change)="onDirectFileSelected($event)" 
        accept="image/png,image/jpeg,image/webp,image/jpg" 
        class="hidden" 
      />

      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Creative Content Management</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Manage the homepage hero carousel (6 craft slides), upload banner images, curriculum media, and studio assets.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          @if (activeTab() === 'carousel') {
            <!-- Quick Upload Image Button -->
            <button 
              (click)="directFileInput.click()" 
              [disabled]="isUploadingImage()"
              class="bg-surface-container-highest text-on-surface font-semibold px-3.5 py-2.5 rounded-lg hover:bg-surface-dim flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50">
              @if (isUploadingImage()) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Uploading Image...</span>
              } @else {
                <span class="material-symbols-outlined text-sm text-primary">upload_file</span>
                <span>Upload Banner Image</span>
              }
            </button>

            <!-- Add Slide with full modal -->
            <button 
              (click)="openAddSlideModal()" 
              class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer">
              <span class="material-symbols-outlined text-sm">add_photo_alternate</span>
              Add Carousel Slide
            </button>

            <!-- Reset defaults -->
            <button 
              (click)="resetToDefaults()" 
              class="bg-surface-container-high text-on-surface font-semibold px-3.5 py-2.5 rounded-lg hover:bg-surface-dim flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Reset to 6 Signature Default Slides">
              <span class="material-symbols-outlined text-sm">restart_alt</span>
              Reset 6 Defaults
            </button>
          } @else {
            <a routerLink="/admin/content/upload" class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-sm">upload</span>
              Upload Media
            </a>
          }
        </div>
      </div>

      <!-- Success / Feedback Toast -->
      @if (notificationMessage()) {
        <div class="p-3 bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg flex items-center gap-2 animate-fadeIn">
          <span class="material-symbols-outlined text-sm">check_circle</span>
          <span>{{ notificationMessage() }}</span>
        </div>
      }

      <!-- Tab Switcher -->
      <div class="flex border-b border-outline-variant/30 gap-6 font-semibold text-xs">
        <button 
          (click)="activeTab.set('carousel')" 
          [class.border-b-2]="activeTab() === 'carousel'"
          [class.border-primary]="activeTab() === 'carousel'"
          [class.text-primary]="activeTab() === 'carousel'"
          [class.text-on-surface-variant]="activeTab() !== 'carousel'"
          class="pb-3 flex items-center gap-2 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-sm">view_carousel</span>
          <span>Homepage Hero Carousel ({{ slides().length }} Slides)</span>
        </button>
        <button 
          (click)="activeTab.set('courses')" 
          [class.border-b-2]="activeTab() === 'courses'"
          [class.border-primary]="activeTab() === 'courses'"
          [class.text-primary]="activeTab() === 'courses'"
          [class.text-on-surface-variant]="activeTab() !== 'courses'"
          class="pb-3 flex items-center gap-2 cursor-pointer transition-colors">
          <span class="material-symbols-outlined text-sm">video_library</span>
          <span>Course Curriculum & Media ({{ courses().length }})</span>
        </button>
      </div>

      <!-- TAB 1: HERO CAROUSEL MANAGEMENT -->
      @if (activeTab() === 'carousel') {
        <div class="space-y-6">
          <div class="bg-primary/5 border border-primary/20 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-primary text-xl">auto_awesome</span>
              <div>
                <h4 class="font-bold text-xs text-on-surface">Homepage Signature Craft Carousel</h4>
                <p class="text-[11px] text-on-surface-variant">Upload custom banner images or edit titles and descriptions. Slides rotate every 5 seconds on the homepage.</p>
              </div>
            </div>
            <a routerLink="/" target="_blank" class="text-primary font-bold hover:underline flex items-center gap-1 text-xs">
              Preview Live Homepage <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>

          <!-- Carousel Slide Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            @for (slide of slides(); track slide.id; let i = $index) {
              <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group">
                <!-- Slide Image & Inset Badge -->
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

                <!-- Slide Details Body -->
                <div class="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <p class="text-[11px] text-on-surface-variant line-clamp-2">{{ slide.description }}</p>
                  
                  <div class="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[11px]">
                    <span class="text-on-surface-variant truncate max-w-[140px]">
                      Target: <span class="font-semibold text-on-surface">{{ slide.category || slide.route }}</span>
                    </span>
                    
                    <div class="flex items-center gap-1">
                      <!-- Move Up -->
                      <button 
                        (click)="moveSlide(i, -1)" 
                        [disabled]="i === 0" 
                        class="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30 cursor-pointer" 
                        title="Move Up">
                        <span class="material-symbols-outlined text-sm">arrow_upward</span>
                      </button>
                      <!-- Move Down -->
                      <button 
                        (click)="moveSlide(i, 1)" 
                        [disabled]="i === slides().length - 1" 
                        class="p-1 text-on-surface-variant hover:text-primary disabled:opacity-30 cursor-pointer" 
                        title="Move Down">
                        <span class="material-symbols-outlined text-sm">arrow_downward</span>
                      </button>
                      <!-- Toggle Active -->
                      <button 
                        (click)="toggleSlideActive(slide)" 
                        class="p-1 text-on-surface-variant hover:text-primary cursor-pointer" 
                        [title]="slide.active ? 'Hide Slide' : 'Activate Slide'">
                        <span class="material-symbols-outlined text-sm">{{ slide.active ? 'visibility' : 'visibility_off' }}</span>
                      </button>
                      <!-- Edit -->
                      <button 
                        (click)="openEditSlideModal(slide)" 
                        class="p-1 text-primary hover:text-primary/80 font-bold cursor-pointer" 
                        title="Edit Slide Details">
                        <span class="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <!-- Delete -->
                      <button 
                        (click)="deleteSlide(slide.id)" 
                        class="p-1 text-red-600 hover:text-red-700 cursor-pointer" 
                        title="Delete Slide">
                        <span class="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- TAB 2: COURSE MEDIA & ASSETS -->
      @if (activeTab() === 'courses') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (course of courses(); track course.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
              <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
                <img class="w-full h-full object-cover" [src]="course.imageUrl || course.thumbnailUrl || 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'" [alt]="course.title" />
                <span class="absolute top-2 left-2 bg-black/60 text-white px-2 py-0.5 rounded text-[10px] font-bold">{{ course.category || 'Workshop' }}</span>
              </div>
              <div>
                <h3 class="font-bold text-sm text-on-surface truncate">{{ course.title }}</h3>
                <p class="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">{{ course.description || 'Artisan Workshop Masterclass' }}</p>
              </div>
              <div class="pt-2 border-t border-outline-variant/20 flex justify-between items-center text-[10px] text-on-surface-variant">
                <span>Instructor: {{ course.instructor || 'Studio Master' }}</span>
                <a [routerLink]="['/courses', course.id]" class="text-primary font-bold hover:underline">View Curriculum</a>
              </div>
            </div>
          }

          @if (courses().length === 0 && !isLoadingCourses()) {
            <div class="col-span-3 p-12 text-center bg-surface-container-low rounded-2xl border border-outline-variant/30 text-on-surface-variant">
              <span class="material-symbols-outlined text-primary text-3xl mb-2">video_library</span>
              <p class="font-semibold text-xs text-on-surface">No Course Content Published Yet</p>
              <p class="text-[11px] text-on-surface-variant mt-0.5 mb-4">Upload curriculum video lessons and printable PDF blueprints.</p>
              <a routerLink="/admin/content/upload" class="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary font-semibold rounded-lg text-xs hover:opacity-90">
                <span class="material-symbols-outlined text-sm">upload</span> Upload First Content
              </a>
            </div>
          }
        </div>
      }

      <!-- MODAL: ADD / EDIT CAROUSEL SLIDE -->
      @if (isSlideModalOpen()) {
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl p-6 max-w-lg w-full border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b border-outline-variant/20 pb-3">
              <h3 class="font-bold text-base text-on-surface">
                {{ editingSlideId() ? 'Edit Carousel Slide' : 'Add New Homepage Slide' }}
              </h3>
              <button (click)="isSlideModalOpen.set(false)" class="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Upload File or Image URL -->
            <div class="space-y-3">
              <!-- Image Upload Zone -->
              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Slide Banner Image</label>
                
                <input 
                  #modalFileInput 
                  type="file" 
                  (change)="onModalFileSelected($event)" 
                  accept="image/png,image/jpeg,image/webp,image/jpg" 
                  class="hidden" 
                />

                <div class="flex gap-2 mb-2">
                  <button 
                    type="button" 
                    (click)="modalFileInput.click()" 
                    [disabled]="isModalUploading()"
                    class="flex-1 py-2 px-3 bg-surface-container-high hover:bg-surface-dim text-on-surface rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer text-xs border border-outline-variant/30">
                    @if (isModalUploading()) {
                      <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      <span>Uploading Image...</span>
                    } @else {
                      <span class="material-symbols-outlined text-sm text-primary">cloud_upload</span>
                      <span>Upload Image From Computer</span>
                    }
                  </button>
                </div>

                <div class="relative">
                  <input 
                    type="url" 
                    [ngModel]="modalSlide().imageUrl"
                    (ngModelChange)="updateModalField('imageUrl', $event)"
                    placeholder="Or paste direct image URL (https://images.unsplash.com/...)"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <!-- Live Preview -->
              @if (modalSlide().imageUrl) {
                <div class="rounded-xl overflow-hidden h-32 border border-outline-variant/30 bg-surface-container-low relative group">
                  <img [src]="modalSlide().imageUrl" class="w-full h-full object-cover" alt="Preview" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button (click)="modalFileInput.click()" class="bg-white/90 text-black px-3 py-1 rounded-lg font-bold text-xs cursor-pointer">Change Image</button>
                  </div>
                  <span class="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-bold">Image Preview</span>
                </div>
              }

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Main Title *</label>
                <input 
                  type="text" 
                  [ngModel]="modalSlide().title"
                  (ngModelChange)="updateModalField('title', $event)"
                  placeholder="e.g. Learn. Create. Inspire."
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Tagline / Subheading</label>
                <input 
                  type="text" 
                  [ngModel]="modalSlide().tagline"
                  (ngModelChange)="updateModalField('tagline', $event)"
                  placeholder="e.g. Master the art of Lippan Mirror Work"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label class="block font-semibold mb-1 text-on-surface-variant">Description</label>
                <textarea 
                  rows="2"
                  [ngModel]="modalSlide().description"
                  (ngModelChange)="updateModalField('description', $event)"
                  placeholder="Brief description of the craft masterclass..."
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Target Category Slug</label>
                  <input 
                    type="text" 
                    [ngModel]="modalSlide().category"
                    (ngModelChange)="updateModalField('category', $event)"
                    placeholder="e.g. lippan-art, candle-making"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label class="block font-semibold mb-1 text-on-surface-variant">Route</label>
                  <input 
                    type="text" 
                    [ngModel]="modalSlide().route"
                    (ngModelChange)="updateModalField('route', $event)"
                    placeholder="/courses"
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div class="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="slideActiveToggle"
                  [checked]="modalSlide().active"
                  (change)="updateModalField('active', $any($event.target).checked)"
                  class="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                />
                <label for="slideActiveToggle" class="font-semibold text-xs text-on-surface cursor-pointer">
                  Display this slide on the homepage
                </label>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
              <button 
                (click)="isSlideModalOpen.set(false)"
                class="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-semibold hover:bg-surface-dim cursor-pointer">
                Cancel
              </button>
              <button 
                (click)="saveSlideModal()"
                [disabled]="isModalUploading()"
                class="px-4 py-2 rounded-lg bg-primary text-on-primary font-semibold hover:opacity-90 cursor-pointer shadow-sm disabled:opacity-50">
                {{ editingSlideId() ? 'Save Changes' : 'Create Slide' }}
              </button>
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class AdminContentComponent implements OnInit {
  private courseService = inject(CourseService);
  private uploadService = inject(UploadService);

  activeTab = signal<'carousel' | 'courses'>('carousel');
  slides = signal<AdminCarouselSlide[]>([]);
  courses = signal<Course[]>([]);
  isLoadingCourses = signal<boolean>(true);
  notificationMessage = signal<string>('');
  isUploadingImage = signal<boolean>(false);
  isModalUploading = signal<boolean>(false);

  // Modal states
  isSlideModalOpen = signal<boolean>(false);
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
    this.loadCarouselSlides();
    this.loadCourses();
  }

  loadCarouselSlides(): void {
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
            return;
          }
        } catch {}
      }
    }

    this.resetToDefaults(false);
  }

  resetToDefaults(showNotification = true): void {
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
    if (showNotification) {
      this.showToast('Reset to 6 signature craft slides successfully!');
    }
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (list) => {
        this.courses.set(list || []);
        this.isLoadingCourses.set(false);
      },
      error: () => {
        this.courses.set([]);
        this.isLoadingCourses.set(false);
      }
    });
  }

  saveSlides(newSlides: AdminCarouselSlide[]): void {
    this.slides.set(newSlides);
    if (typeof window !== 'undefined') {
      const payload = newSlides.map(s => ({
        id: s.id,
        title: s.title,
        tagline: s.tagline,
        description: s.description,
        imageUrl: s.imageUrl,
        url: s.imageUrl,
        route: s.route,
        queryParams: s.category ? { category: s.category } : undefined,
        active: s.active
      }));
      localStorage.setItem('homepage_carousel', JSON.stringify(payload));
      window.dispatchEvent(new Event('carousel_updated'));
    }
  }

  // Quick Direct Upload from Header
  onDirectFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploadingImage.set(true);

      const titleFromFilename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const cleanTitle = titleFromFilename.charAt(0).toUpperCase() + titleFromFilename.slice(1);

      this.uploadService.uploadImage(file, 'carousel').subscribe({
        next: (res: any) => {
          this.isUploadingImage.set(false);
          const uploadedUrl = res.url || res.secure_url || res.data?.url;
          const newSlide: AdminCarouselSlide = {
            id: Date.now().toString(),
            title: cleanTitle,
            tagline: 'Artisan Workshop',
            description: 'Explore signature techniques in our craft masterclasses.',
            imageUrl: uploadedUrl,
            route: '/courses',
            category: '',
            active: true
          };
          this.saveSlides([...this.slides(), newSlide]);
          this.showToast(`Image "${file.name}" uploaded and added as slide!`);
          input.value = '';
        },
        error: () => {
          // Fallback reading via FileReader for instant preview if server offline
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.isUploadingImage.set(false);
            const fallbackUrl = e.target.result;
            const newSlide: AdminCarouselSlide = {
              id: Date.now().toString(),
              title: cleanTitle,
              tagline: 'Artisan Workshop',
              description: 'Explore signature techniques in our craft masterclasses.',
              imageUrl: fallbackUrl,
              route: '/courses',
              category: '',
              active: true
            };
            this.saveSlides([...this.slides(), newSlide]);
            this.showToast(`Image "${file.name}" added as slide!`);
            input.value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Modal File Upload
  onModalFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isModalUploading.set(true);

      if (!this.modalSlide().title.trim()) {
        const titleFromFilename = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const cleanTitle = titleFromFilename.charAt(0).toUpperCase() + titleFromFilename.slice(1);
        this.updateModalField('title', cleanTitle);
      }

      this.uploadService.uploadImage(file, 'carousel').subscribe({
        next: (res: any) => {
          this.isModalUploading.set(false);
          const uploadedUrl = res.url || res.secure_url || res.data?.url;
          this.updateModalField('imageUrl', uploadedUrl);
          this.showToast('Image uploaded successfully!');
        },
        error: () => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.isModalUploading.set(false);
            this.updateModalField('imageUrl', e.target.result);
            this.showToast('Image loaded!');
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
    if (!current.title.trim() || !current.imageUrl.trim()) {
      alert('Please provide at least a title and an image.');
      return;
    }

    if (this.editingSlideId()) {
      const updated = this.slides().map(s => s.id === this.editingSlideId() ? current : s);
      this.saveSlides(updated);
      this.showToast(`Slide "${current.title}" updated successfully!`);
    } else {
      this.saveSlides([...this.slides(), current]);
      this.showToast(`Slide "${current.title}" added to carousel!`);
    }

    this.isSlideModalOpen.set(false);
  }

  deleteSlide(id: string): void {
    if (confirm('Are you sure you want to remove this slide from the homepage carousel?')) {
      const updated = this.slides().filter(s => s.id !== id);
      this.saveSlides(updated);
      this.showToast('Slide removed from carousel.');
    }
  }

  toggleSlideActive(slide: AdminCarouselSlide): void {
    const updated = this.slides().map(s => s.id === slide.id ? { ...s, active: !s.active } : s);
    this.saveSlides(updated);
    this.showToast(`Slide ${slide.active ? 'hidden' : 'activated'}!`);
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

  showToast(msg: string): void {
    this.notificationMessage.set(msg);
    setTimeout(() => this.notificationMessage.set(''), 3500);
  }
}
