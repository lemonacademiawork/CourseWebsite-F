import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { GalleryService } from '../../../core/services/gallery.service';
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
        <a routerLink="/gallery/student-creations" class="bg-primary text-on-primary font-semibold text-xs px-4 py-2.5 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-sm">school</span>
          Student Creations
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">
        @for (item of items(); track item.id; let idx = $index) {
          <div 
            class="gallery-item group relative rounded-xl overflow-hidden bg-surface-container-lowest shadow-sm"
            [class.md:col-span-2]="idx === 0"
            [class.row-span-2]="idx === 0"
            [class.col-span-1]="idx !== 0"
            [class.row-span-1]="idx !== 0">
            <img 
              [alt]="item.title" 
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              [src]="item.imageUrl" 
            />
            <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span class="inline-block px-2.5 py-0.5 bg-primary-container text-on-primary-container font-label-md text-[10px] rounded-full mb-2 font-bold shadow-xs">
                {{ item.category || 'Handcrafted Art' }}
              </span>
              <h3 class="text-white font-bold text-base md:text-lg mb-0.5 line-clamp-1">{{ item.title }}</h3>
              <p class="text-surface-variant text-xs">By {{ item.studentName || 'Artisan' }} • {{ item.courseTitle || 'Studio Masterclass' }}</p>
            </div>
          </div>
        }
      </div>
    </main>
  `
})
export class GalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);

  items = signal<AdminGalleryItem[]>([
    {
      id: '1',
      title: 'Royal Peacock Lippan Art Panel',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfmBf1HSwY5uR-LAAxu6GpESBkYs22BffeVjJ_nVZyFSdWuRswGeUhxlqCnGAx97UnLPW0ecOB9DC2c3CqgC1b6d2M_GdBM48vhdzppVxuNwgxhXHhGw0c-ojwwa2Pfk3ZwyPO_GtPzr_xDy1OlUWSEpWvopOof-IO7oxPtO6QRlD2lKIw7bN3dZ_UGWSPjzXjEcJv8RBQ2c6QJcPObAIVE9rCB8hsUYBaa_iSyBUMAt5OzWEUgwp9',
      studentName: 'Elena Cruz (Trainer)',
      courseTitle: 'The Art of Lippan Masterclass',
      category: 'Lippan Art',
      status: 'APPROVED'
    },
    {
      id: '2',
      title: 'Geometric Terracotta Vessel',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq71zD4kY7nTDde58ZxISgQJ05XWSf-2SsAABr66KdXAYd9wiMfjnx3ROCjH_FoWA7htsaNcXu2PonSBGBgx7Lto46F7ZfZojRz8QcgB6e_UC3EuCIlJ3eAHyGkexhkghUaF9DqElFpN91MA6GyMQi7ufXk1vOwZJBVyTR1DvsspweWMSxBVRCRsvjZsvuCDSfn1m-t0eTPHpvdXvuoG28Uc3b_ErkJrgpY-jcAnhSDnpdsvIhcvvs',
      studentName: 'Sejal Agarwal',
      courseTitle: 'Clay Molding Foundations',
      category: 'Ceramics & Clay',
      status: 'APPROVED'
    },
    {
      id: '3',
      title: 'Blue Ochre Resin Geode',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt9yOGawqhaqbmuB9P7UgFvZgVCD7j0KURoVlO1CbGC02jeRs-IKWCj3_6lV9fycKoll-uWQZYmbtrnVVvGbgqz0-xknjGsaAe-J4Y0XWtigHaTLy4M6GBwr4Ghg4d6mnf2w9Etr6jUiM4o3d85D2S-y8B5Zp4H-uh3r7uL-pEC2uBucjDsIX0Vf-9AZYcOJ0KEEHHyVurOBDOfwsKw0CvOZZBsTS64rB0oFgNvkAPo3x4tb2hPptE',
      studentName: 'Kavita Rao',
      courseTitle: 'Resin & Glass Studio',
      category: 'Resin Art',
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
}
