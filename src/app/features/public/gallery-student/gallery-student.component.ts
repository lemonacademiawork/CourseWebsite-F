import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
import { AdminGalleryItem } from '../../../core/models/admin.model';

@Component({
  selector: 'app-gallery-student',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="flex-1 p-margin-mobile md:p-margin-desktop bg-surface max-w-container-max mx-auto w-full text-xs">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <a routerLink="/gallery" class="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">arrow_back</span> Community Gallery
            </a>
          </div>
          <h1 class="font-display-lg text-2xl md:text-3xl font-bold text-on-background">Student Showcase</h1>
          <p class="text-on-surface-variant text-sm mt-1 max-w-2xl">A curated showcase of handcrafted masterworks from the Lemon Academia artisan community. Be inspired by your peers.</p>
        </div>
        <a 
          routerLink="/gallery/upload" 
          class="flex items-center gap-2 bg-primary text-on-primary font-label-md text-xs px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md hover:opacity-90 transition-all font-semibold cursor-pointer">
          <span class="material-symbols-outlined text-base">add_photo_alternate</span>
          Upload Artwork
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
        @for (item of items(); track item.id; let idx = $index) {
          <div 
            class="gallery-item group relative rounded-2xl overflow-hidden bg-surface-container-lowest shadow-sm border border-outline-variant/20"
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
            <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span class="inline-block px-2.5 py-0.5 bg-primary-container text-on-primary-container font-label-md text-[10px] font-bold rounded-full mb-2">
                {{ item.category || 'Student Creation' }}
              </span>
              <h3 class="font-bold text-base md:text-lg text-white mb-1 line-clamp-1">{{ item.title }}</h3>
              <p class="text-surface-variant text-xs">By {{ item.studentName || 'Artisan Student' }} • {{ item.courseTitle || 'Studio Masterclass' }}</p>
            </div>
          </div>
        }

        <!-- Upload Invitation Card -->
        <div class="gallery-item group relative rounded-2xl overflow-hidden bg-[#FBF8F1] shadow-sm col-span-1 md:col-span-3 row-span-1 flex items-center justify-center border-2 border-dashed border-[#E7E1D3] hover:border-[#6E5410]/50 transition-colors">
          <div class="text-center p-8">
            <div class="w-14 h-14 rounded-full bg-white border border-[#E7E1D3] text-[#6E5410] flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-110 transition-transform">
              <span class="material-symbols-outlined text-3xl">add_photo_alternate</span>
            </div>
            <h3 class="font-bold text-lg text-[#1C1A17] mb-1">Your Artwork Here</h3>
            <p class="text-xs text-[#5B5650] mb-4">Join the showcase and inspire the global community of makers.</p>
            <a 
              routerLink="/gallery/upload" 
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#6E5410] text-white font-bold text-xs hover:bg-[#5c4610] shadow-sm transition">
              <span class="material-symbols-outlined text-sm">upload</span>
              Upload Now
            </a>
          </div>
        </div>
      </div>
    </main>
  `
})
export class GalleryStudentComponent implements OnInit {
  private galleryService = inject(GalleryService);

  items = signal<AdminGalleryItem[]>([
    {
      id: '1',
      title: 'Traditional Lippan Kaam Wall Decor',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfmBf1HSwY5uR-LAAxu6GpESBkYs22BffeVjJ_nVZyFSdWuRswGeUhxlqCnGAx97UnLPW0ecOB9DC2c3CqgC1b6d2M_GdBM48vhdzppVxuNwgxhXHhGw0c-ojwwa2Pfk3ZwyPO_GtPzr_xDy1OlUWSEpWvopOof-IO7oxPtO6QRlD2lKIw7bN3dZ_UGWSPjzXjEcJv8RBQ2c6QJcPObAIVE9rCB8hsUYBaa_iSyBUMAt5OzWEUgwp9',
      studentName: 'Sarah Jenkins',
      courseTitle: 'The Art of Lippan Masterclass',
      category: 'Lippan Art',
      status: 'APPROVED'
    },
    {
      id: '2',
      title: 'Hand-thrown Ceramic Planter',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq71zD4kY7nTDde58ZxISgQJ05XWSf-2SsAABr66KdXAYd9wiMfjnx3ROCjH_FoWA7htsaNcXu2PonSBGBgx7Lto46F7ZfZojRz8QcgB6e_UC3EuCIlJ3eAHyGkexhkghUaF9DqElFpN91MA6GyMQi7ufXk1vOwZJBVyTR1DvsspweWMSxBVRCRsvjZsvuCDSfn1m-t0eTPHpvdXvuoG28Uc3b_ErkJrgpY-jcAnhSDnpdsvIhcvvs',
      studentName: 'Alex Rivera',
      courseTitle: 'Ceramic Design Foundations',
      category: 'Ceramics & Clay',
      status: 'APPROVED'
    },
    {
      id: '3',
      title: 'Ocean Resin Wave Wall Clock',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt9yOGawqhaqbmuB9P7UgFvZgVCD7j0KURoVlO1CbGC02jeRs-IKWCj3_6lV9fycKoll-uWQZYmbtrnVVvGbgqz0-xknjGsaAe-J4Y0XWtigHaTLy4M6GBwr4Ghg4d6mnf2w9Etr6jUiM4o3d85D2S-y8B5Zp4H-uh3r7uL-pEC2uBucjDsIX0Vf-9AZYcOJ0KEEHHyVurOBDOfwsKw0CvOZZBsTS64rB0oFgNvkAPo3x4tb2hPptE',
      studentName: 'Emma Lin',
      courseTitle: 'Resin Craft Workshop',
      category: 'Resin & Glass',
      status: 'APPROVED'
    }
  ]);

  ngOnInit(): void {
    this.galleryService.getPublicGallery().subscribe({
      next: (approvedList) => {
        if (approvedList && approvedList.length > 0) {
          const onlyApproved = approvedList.filter(i => i.status === 'APPROVED');
          if (onlyApproved.length > 0) {
            this.items.set(onlyApproved);
          }
        }
      },
      error: () => {}
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80';
  }
}

