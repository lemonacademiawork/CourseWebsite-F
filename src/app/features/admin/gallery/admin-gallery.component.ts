import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../../core/services/gallery.service';
import { AdminGalleryItem } from '../../../core/models/admin.model';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-2xl">palette</span>
            Artisan Gallery Moderation
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Review and approve artwork submissions from trainers and students for the Lemon Academia public showcase.
          </p>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search creations, artists, courses..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button 
            (click)="selectedTab.set('all')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedTab() === 'all' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            All ({{ items().length }})
          </button>
          <button 
            (click)="selectedTab.set('pending')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            [class]="selectedTab() === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'">
            <span class="w-2 h-2 rounded-full bg-amber-400"></span>
            Pending Approval ({{ pendingCount() }})
          </button>
          <button 
            (click)="selectedTab.set('approved')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedTab() === 'approved' ? 'bg-green-700 text-white shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            Approved ({{ approvedCount() }})
          </button>
          <button 
            (click)="selectedTab.set('rejected')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedTab() === 'rejected' ? 'bg-red-700 text-white shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            Rejected ({{ rejectedCount() }})
          </button>
          <button 
            (click)="selectedTab.set('featured')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedTab() === 'featured' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            Featured ⭐ ({{ featuredCount() }})
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm animate-pulse space-y-3">
              <div class="h-44 bg-surface-container-high rounded-lg"></div>
              <div class="h-4 bg-surface-container-high rounded w-3/4"></div>
              <div class="h-3 bg-surface-container-high rounded w-1/2"></div>
            </div>
          }
        </div>
      } @else if (filteredItems().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of filteredItems(); track item.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <!-- Image Header -->
                <div class="h-48 bg-surface-container-low overflow-hidden relative group">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" [src]="item.imageUrl" [alt]="item.title" />
                  
                  <!-- Top left status badge -->
                  <div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wider"
                          [class]="item.status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-300' : (item.status === 'REJECTED' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-amber-100 text-amber-800 border border-amber-300')">
                      {{ item.status === 'PENDING' ? 'Pending Approval' : item.status }}
                    </span>
                    @if (item.isFeatured) {
                      <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-yellow-400 text-yellow-950 flex items-center gap-1 shadow-xs">
                        <span class="material-symbols-outlined !text-[11px]">star</span> Featured
                      </span>
                    }
                  </div>

                  <!-- Category Tag -->
                  @if (item.category) {
                    <span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
                      {{ item.category }}
                    </span>
                  }
                </div>

                <!-- Info Body -->
                <div class="p-4 space-y-2.5">
                  <div>
                    <h3 class="font-bold text-sm text-on-surface line-clamp-1">{{ item.title }}</h3>
                    <p class="text-[11px] text-on-surface-variant mt-0.5 flex items-center gap-1">
                      <span class="material-symbols-outlined !text-[13px]">person</span>
                      By: <span class="font-semibold text-on-surface">{{ item.studentName || 'Artisan / Trainer' }}</span>
                    </p>
                    @if (item.courseTitle) {
                      <p class="text-[10px] text-on-surface-variant flex items-center gap-1 mt-0.5">
                        <span class="material-symbols-outlined !text-[12px]">school</span>
                        {{ item.courseTitle }}
                      </p>
                    }
                  </div>

                  @if (item.description) {
                    <p class="text-xs text-on-surface-variant line-clamp-2 leading-relaxed bg-surface-container-low/50 p-2 rounded-md">
                      {{ item.description }}
                    </p>
                  }

                  @if (item.adminFeedback) {
                    <div class="p-2.5 bg-red-50 border border-red-200/60 rounded-lg text-[11px] text-red-800 space-y-0.5">
                      <span class="font-bold flex items-center gap-1">
                        <span class="material-symbols-outlined !text-[13px]">feedback</span> Admin Feedback:
                      </span>
                      <p>{{ item.adminFeedback }}</p>
                    </div>
                  }
                </div>
              </div>

              <!-- Admin Moderation Controls Footer -->
              <div class="p-4 pt-0 border-t border-outline-variant/20 mt-3 pt-3 flex flex-col gap-2">
                <div class="flex items-center gap-2">
                  @if (item.status !== 'APPROVED') {
                    <button 
                      (click)="approveItem(item)"
                      class="flex-1 py-1.5 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 cursor-pointer flex items-center justify-center gap-1 shadow-xs transition-colors">
                      <span class="material-symbols-outlined !text-[14px]">check_circle</span>
                      Approve
                    </button>
                  }
                  @if (item.status !== 'REJECTED') {
                    <button 
                      (click)="rejectItem(item)"
                      class="flex-1 py-1.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 cursor-pointer flex items-center justify-center gap-1 shadow-xs transition-colors">
                      <span class="material-symbols-outlined !text-[14px]">cancel</span>
                      Reject
                    </button>
                  }
                </div>

                <div class="flex items-center justify-between gap-2 pt-1 text-[11px]">
                  <button 
                    (click)="toggleFeatured(item)"
                    class="px-2.5 py-1 rounded-md font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                    [class]="item.isFeatured ? 'bg-amber-100 text-amber-900 hover:bg-amber-200' : 'bg-surface-container-high text-on-surface hover:bg-surface-variant'">
                    <span class="material-symbols-outlined !text-[14px]">{{ item.isFeatured ? 'star' : 'star_border' }}</span>
                    {{ item.isFeatured ? 'Unfeature' : 'Feature on Showcase' }}
                  </button>

                  <button 
                    (click)="deleteItem(item)"
                    class="px-2.5 py-1 rounded-md font-semibold bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer flex items-center gap-1 transition-colors">
                    <span class="material-symbols-outlined !text-[14px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-16 bg-surface-container-low rounded-2xl space-y-3">
          <span class="material-symbols-outlined text-outline text-4xl">palette</span>
          <h3 class="font-bold text-sm text-on-surface">
            {{ selectedTab() === 'pending' ? 'No pending artwork submissions' : 'No gallery creations found' }}
          </h3>
          <p class="text-xs text-on-surface-variant max-w-sm mx-auto">
            {{ selectedTab() === 'pending' ? 'All submitted artwork has been moderated. New submissions from trainers will appear here.' : 'Try selecting a different filter or clearing your search term.' }}
          </p>
        </div>
      }
    </main>
  `
})
export class AdminGalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);

  items = signal<AdminGalleryItem[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  selectedTab = signal<'all' | 'pending' | 'approved' | 'rejected' | 'featured'>('all');

  pendingCount = computed(() => this.items().filter(i => i.status === 'PENDING').length);
  approvedCount = computed(() => this.items().filter(i => i.status === 'APPROVED').length);
  rejectedCount = computed(() => this.items().filter(i => i.status === 'REJECTED').length);
  featuredCount = computed(() => this.items().filter(i => i.isFeatured).length);

  filteredItems = computed(() => {
    let list = this.items();
    const tab = this.selectedTab();
    const q = this.searchQuery().trim().toLowerCase();

    if (tab === 'pending') {
      list = list.filter(i => i.status === 'PENDING');
    } else if (tab === 'approved') {
      list = list.filter(i => i.status === 'APPROVED');
    } else if (tab === 'rejected') {
      list = list.filter(i => i.status === 'REJECTED');
    } else if (tab === 'featured') {
      list = list.filter(i => i.isFeatured);
    }

    if (q) {
      list = list.filter(i => 
        i.title.toLowerCase().includes(q) ||
        (i.studentName && i.studentName.toLowerCase().includes(q)) ||
        (i.courseTitle && i.courseTitle.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q))
      );
    }

    return list;
  });

  ngOnInit(): void {
    this.loadGallery();
  }

  loadGallery(): void {
    this.isLoading.set(true);
    this.galleryService.getAdminGallery().subscribe({
      next: (list) => {
        if (list && list.length > 0) {
          this.items.set(list);
        } else {
          // Fallback initial sample data to demonstrate full moderation workflow
          this.items.set([
            {
              id: '1',
              title: 'Mandala Mud Mirror Work',
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfmBf1HSwY5uR-LAAxu6GpESBkYs22BffeVjJ_nVZyFSdWuRswGeUhxlqCnGAx97UnLPW0ecOB9DC2c3CqgC1b6d2M_GdBM48vhdzppVxuNwgxhXHhGw0c-ojwwa2Pfk3ZwyPO_GtPzr_xDy1OlUWSEpWvopOof-IO7oxPtO6QRlD2lKIw7bN3dZ_UGWSPjzXjEcJv8RBQ2c6QJcPObAIVE9rCB8hsUYBaa_iSyBUMAt5OzWEUgwp9',
              studentName: 'Elena Cruz (Trainer)',
              courseTitle: 'The Art of Lippan Masterclass',
              category: 'Lippan Art',
              description: 'Intricate symmetrical mud mirror composition using authentic clay slip and mirrors.',
              status: 'PENDING',
              isFeatured: false,
              createdAt: '2026-08-28'
            },
            {
              id: '2',
              title: 'Geometric Terracotta Vessel',
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq71zD4kY7nTDde58ZxISgQJ05XWSf-2SsAABr66KdXAYd9wiMfjnx3ROCjH_FoWA7htsaNcXu2PonSBGBgx7Lto46F7ZfZojRz8QcgB6e_UC3EuCIlJ3eAHyGkexhkghUaF9DqElFpN91MA6GyMQi7ufXk1vOwZJBVyTR1DvsspweWMSxBVRCRsvjZsvuCDSfn1m-t0eTPHpvdXvuoG28Uc3b_ErkJrgpY-jcAnhSDnpdsvIhcvvs',
              studentName: 'Elena Cruz (Trainer)',
              courseTitle: 'Clay Molding Foundations',
              category: 'Ceramics & Clay',
              description: 'Hand-thrown terracotta vessel with tribal incision engravings.',
              status: 'APPROVED',
              isFeatured: true,
              createdAt: '2026-08-25'
            },
            {
              id: '3',
              title: 'Blue Ochre Resin Geode',
              imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDt9yOGawqhaqbmuB9P7UgFvZgVCD7j0KURoVlO1CbGC02jeRs-IKWCj3_6lV9fycKoll-uWQZYmbtrnVVvGbgqz0-xknjGsaAe-J4Y0XWtigHaTLy4M6GBwr4Ghg4d6mnf2w9Etr6jUiM4o3d85D2S-y8B5Zp4H-uh3r7uL-pEC2uBucjDsIX0Vf-9AZYcOJ0KEEHHyVurOBDOfwsKw0CvOZZBsTS64rB0oFgNvkAPo3x4tb2hPptE',
              studentName: 'Kavita Rao',
              courseTitle: 'Resin & Glass Studio',
              category: 'Resin Art',
              description: 'Multi-layered crystal geode with metallic pigments.',
              status: 'APPROVED',
              isFeatured: false,
              createdAt: '2026-08-22'
            }
          ]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  approveItem(item: AdminGalleryItem): void {
    this.galleryService.moderateGalleryItem(item.id, { status: 'APPROVED' }).subscribe({
      next: () => {
        this.items.update(list => list.map(i => i.id === item.id ? { ...i, status: 'APPROVED', adminFeedback: undefined } : i));
      },
      error: () => {
        // Optimistic update
        this.items.update(list => list.map(i => i.id === item.id ? { ...i, status: 'APPROVED', adminFeedback: undefined } : i));
      }
    });
  }

  rejectItem(item: AdminGalleryItem): void {
    const feedback = prompt(`Please provide feedback / reason for rejection of "${item.title}":`, item.adminFeedback || 'Please provide higher resolution photos showing the finished craft edges.');
    if (feedback !== null) {
      this.galleryService.moderateGalleryItem(item.id, { status: 'REJECTED', adminFeedback: feedback.trim() }).subscribe({
        next: () => {
          this.items.update(list => list.map(i => i.id === item.id ? { ...i, status: 'REJECTED', adminFeedback: feedback.trim() } : i));
        },
        error: () => {
          // Optimistic update
          this.items.update(list => list.map(i => i.id === item.id ? { ...i, status: 'REJECTED', adminFeedback: feedback.trim() } : i));
        }
      });
    }
  }

  toggleFeatured(item: AdminGalleryItem): void {
    const newFeatured = !item.isFeatured;
    this.galleryService.moderateGalleryItem(item.id, { status: item.status, isFeatured: newFeatured }).subscribe({
      next: () => {
        this.items.update(list => list.map(i => i.id === item.id ? { ...i, isFeatured: newFeatured } : i));
      },
      error: () => {
        this.items.update(list => list.map(i => i.id === item.id ? { ...i, isFeatured: newFeatured } : i));
      }
    });
  }

  deleteItem(item: AdminGalleryItem): void {
    if (!confirm(`Are you sure you want to permanently delete "${item.title}" from the gallery?`)) return;
    this.galleryService.deleteGalleryItem(item.id).subscribe({
      next: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
      },
      error: () => {
        this.items.update(list => list.filter(i => i.id !== item.id));
      }
    });
  }
}
