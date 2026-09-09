import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminGalleryItem } from '../../../core/models/admin.model';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="flex-1 p-margin-mobile md:p-margin-desktop bg-surface max-w-container-max mx-auto w-full text-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">Community Gallery</h1>
          <p class="text-on-surface-variant text-sm mt-1">Explore approved masterworks and handcrafted creations by our artisans, trainers, and students.</p>
        </div>
        <div class="flex items-center gap-2">
          <a routerLink="/gallery/student-creations" class="bg-surface-container-high border border-outline-variant/30 text-on-surface font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-surface-container transition-colors inline-flex items-center gap-1.5 shadow-xs">
            <span class="material-symbols-outlined text-sm">school</span>
            Student Showcase
          </a>
          <a routerLink="/gallery/upload" class="bg-primary text-on-primary font-semibold text-xs px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 shadow-sm">
            <span class="material-symbols-outlined text-sm">add_photo_alternate</span>
            Share Artwork
          </a>
        </div>
      </div>

      @if (items().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          @for (item of items(); track item.id; let idx = $index) {
            <div 
              (click)="openDetailModal(item)"
              class="gallery-item group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm cursor-pointer border border-outline-variant/20 hover:shadow-md transition-all"
              [class.md:col-span-2]="idx === 0"
              [class.row-span-2]="idx === 0"
              [class.col-span-1]="idx !== 0"
              [class.row-span-1]="idx !== 0">
              <img 
                [alt]="item.title" 
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                [src]="item.imageUrl || item.mediaUrl" 
                (error)="onImgError($event)"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span class="inline-block px-2.5 py-0.5 bg-primary-container text-on-primary-container font-label-md text-[10px] rounded-full mb-2 font-bold shadow-xs">
                  {{ item.category || 'Handcrafted Art' }}
                </span>
                <h3 class="text-white font-bold text-base md:text-lg mb-0.5 line-clamp-1">{{ item.title }}</h3>
                <p class="text-surface-variant text-xs">By {{ item.studentName || 'Artisan' }} • {{ item.courseTitle || 'Studio Masterclass' }}</p>
                <div class="mt-2 flex items-center justify-between text-[11px] text-white/90">
                  <span class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-xs">visibility</span> Click to view details
                  </span>
                  @if (canDelete(item)) {
                    <button 
                      (click)="deleteItem(item, $event)" 
                      class="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-[10px] shadow-xs cursor-pointer flex items-center gap-1 transition-colors">
                      <span class="material-symbols-outlined text-xs">delete</span>
                      Delete
                    </button>
                  }
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-20 bg-[#EFE9DC]/30 border border-[#E7E1D3] rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div class="w-16 h-16 rounded-full bg-white text-[#6E5410] border border-[#E7E1D3] flex items-center justify-center mx-auto shadow-xs">
            <span class="material-symbols-outlined text-3xl">photo_library</span>
          </div>
          <h3 class="font-bold text-base text-[#1C1A17]">No Community Creations Yet</h3>
          <p class="text-xs text-[#5B5650] leading-relaxed">
            Be the first artisan to showcase your handcrafted masterpiece to the Lemon Academia community.
          </p>
          <a routerLink="/gallery/upload" class="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#6E5410] text-white font-bold text-xs rounded-xl hover:bg-[#5c4610] shadow-sm transition">
            <span class="material-symbols-outlined text-sm">add_photo_alternate</span>
            Share Your First Artwork
          </a>
        </div>
      }

      <!-- Detailed Image Modal -->
      @if (selectedItem()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div class="bg-surface-container-lowest rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-outline-variant/30 flex flex-col max-h-[90vh]">
            <!-- Modal Header -->
            <div class="p-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                  {{ selectedItem()?.category || 'Handcrafted Creation' }}
                </span>
                <span class="text-xs text-on-surface-variant font-medium">• {{ selectedItem()?.courseTitle || 'Masterclass' }}</span>
              </div>
              <button (click)="selectedItem.set(null)" class="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <!-- Image View -->
            <div class="relative bg-black/95 flex items-center justify-center max-h-[50vh] overflow-hidden">
              <img 
                [src]="selectedItem()?.imageUrl || selectedItem()?.mediaUrl" 
                [alt]="selectedItem()?.title" 
                class="w-full h-full object-contain max-h-[50vh]"
              />
            </div>

            <!-- Modal Info Body -->
            <div class="p-5 space-y-4 overflow-y-auto">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="text-lg font-bold text-on-surface">{{ selectedItem()?.title }}</h2>
                  <p class="text-xs text-on-surface-variant mt-0.5">
                    Created by <strong class="text-on-surface font-semibold">{{ selectedItem()?.studentName || 'Artisan Student' }}</strong>
                  </p>
                </div>
                @if (canDelete(selectedItem()!)) {
                  <button 
                    (click)="deleteItem(selectedItem()!)"
                    class="px-3.5 py-2 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200">
                    <span class="material-symbols-outlined text-sm">delete</span>
                    Delete Artwork
                  </button>
                }
              </div>

              @if (selectedItem()?.description) {
                <div class="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <h4 class="font-bold text-xs text-on-surface mb-1">About This Project:</h4>
                  <p class="text-xs text-on-surface-variant leading-relaxed">{{ selectedItem()?.description }}</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class GalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);
  public authService = inject(AuthService);

  items = signal<AdminGalleryItem[]>([]);
  selectedItem = signal<AdminGalleryItem | null>(null);

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.galleryService.getPublicGallery().subscribe({
      next: (approvedList) => {
        if (approvedList && approvedList.length > 0) {
          const onlyApproved = approvedList.filter(i => i.status === 'APPROVED');
          this.items.set(onlyApproved.length > 0 ? onlyApproved : approvedList);
        } else {
          this.items.set([]);
        }
      },
      error: () => {
        this.items.set([]);
      }
    });
  }

  openDetailModal(item: AdminGalleryItem): void {
    this.selectedItem.set(item);
  }

  canDelete(item: AdminGalleryItem): boolean {
    if (!this.authService.isLoggedIn()) return false;
    const user = (this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || '').toLowerCase().trim();
    const itemOwner = (item.studentName || '').toLowerCase().trim();
    return user === itemOwner || user === 'admin' || user === 'trainer' || this.authService.isLoggedIn();
  }

  deleteItem(item: AdminGalleryItem, event?: Event): void {
    if (event) event.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    this.galleryService.deleteGalleryItem(item.id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
        if (this.selectedItem()?.id === item.id) this.selectedItem.set(null);
      },
      error: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
        if (this.selectedItem()?.id === item.id) this.selectedItem.set(null);
      }
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80';
  }
}
