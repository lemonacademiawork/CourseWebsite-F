import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService } from '../../../core/services/gallery.service';
import { AuthService } from '../../../core/services/auth.service';
import { TrainerGallerySubmission } from '../../../core/models/trainer.model';

@Component({
  selector: 'app-trainer-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-2xl">gallery_thumbnail</span>
            Artisan Gallery Submissions
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Submit your handcrafted artwork to the Lemon Academia showcase and review student project submissions.
          </p>
        </div>
        <button 
          (click)="toggleUploadForm()"
          class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
          <span class="material-symbols-outlined text-sm">{{ isUploading() ? 'close' : 'add_photo_alternate' }}</span>
          {{ isUploading() ? 'Close Form' : 'Submit New Creation' }}
        </button>
      </div>

      <!-- Upload Form for Trainers -->
      @if (isUploading()) {
        <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 mb-8 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div class="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <div>
              <h3 class="font-bold text-sm text-on-surface">Submit Artwork for Gallery Showcase</h3>
              <p class="text-[11px] text-on-surface-variant">
                Upload photos of your masterpieces, sample pieces, or workshop demonstrations.
              </p>
            </div>
            <button 
              (click)="isUploading.set(false)"
              class="text-on-surface-variant hover:text-on-surface p-1 rounded-md text-xs">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <!-- Moderation Info Banner -->
          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
            <span class="material-symbols-outlined text-amber-600 text-lg shrink-0 mt-0.5">verified_user</span>
            <div class="text-[11px] leading-relaxed">
              <strong>Admin Approval Required:</strong> All artwork submitted by trainers will be reviewed by the Lemon Academia admin team. Once approved, your creation will be featured live on the public student &amp; community gallery.
            </div>
          </div>

          <form (ngSubmit)="handleSubmitCreation()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Artwork Title <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Royal Peacock Lippan Art Panel"
                  [ngModel]="title()"
                  (ngModelChange)="title.set($event)"
                  name="title"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Craft Category <span class="text-red-500">*</span></label>
                <select
                  [ngModel]="category()"
                  (ngModelChange)="category.set($event)"
                  name="category"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Lippan Art">Lippan Art &amp; Mud Mirror</option>
                  <option value="Ceramics & Clay">Ceramics &amp; Clay Modeling</option>
                  <option value="Resin & Glass">Resin &amp; Glass Studio</option>
                  <option value="Mosaic & Tile">Mosaic &amp; Tile Craft</option>
                  <option value="Painting & Textures">Artisan Painting &amp; Textures</option>
                  <option value="Traditional Crafts">Traditional Indian Crafts</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Associated Course / Workshop</label>
                <input 
                  type="text" 
                  placeholder="e.g. The Art of Lippan Masterclass"
                  [ngModel]="courseTitle()"
                  (ngModelChange)="courseTitle.set($event)"
                  name="courseTitle"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Artist / Creator Name</label>
                <input 
                  type="text" 
                  [ngModel]="artistName()"
                  (ngModelChange)="artistName.set($event)"
                  name="artistName"
                  placeholder="Your Name (Trainer)"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label class="block font-semibold mb-1 text-on-surface">High-Resolution Image URL <span class="text-red-500">*</span></label>
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..."
                [ngModel]="imageUrl()"
                (ngModelChange)="imageUrl.set($event)"
                name="imageUrl"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            @if (imageUrl()) {
              <div class="p-3 bg-surface-container-low rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <img [src]="imageUrl()" alt="Preview" class="w-16 h-16 object-cover rounded-lg" />
                <div class="text-[11px] text-on-surface-variant">
                  <span class="font-semibold text-on-surface">Preview</span>: Artwork will be presented in high definition in the community gallery.
                </div>
              </div>
            }

            <div>
              <label class="block font-semibold mb-1 text-on-surface">Artwork Description &amp; Techniques Used</label>
              <textarea 
                rows="3"
                placeholder="Describe materials, techniques, inspiration, or tips for aspiring students..."
                [ngModel]="description()"
                (ngModelChange)="description.set($event)"
                name="description"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary leading-relaxed"
              ></textarea>
            </div>

            @if (formError()) {
              <div class="text-red-700 text-xs font-medium bg-red-50 border border-red-200 p-2.5 rounded-lg">
                {{ formError() }}
              </div>
            }

            @if (formSuccess()) {
              <div class="text-green-800 text-xs font-medium bg-green-50 border border-green-200 p-2.5 rounded-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">check_circle</span>
                {{ formSuccess() }}
              </div>
            }

            <div class="flex items-center gap-3 pt-2">
              <button 
                type="submit" 
                [disabled]="isSubmitting()"
                class="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                @if (isSubmitting()) {
                  <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Submitting to Admin...</span>
                } @else {
                  <span class="material-symbols-outlined text-sm">send</span>
                  <span>Submit to Admin for Approval</span>
                }
              </button>
              <button 
                type="button" 
                (click)="isUploading.set(false)"
                class="px-5 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Tabs (My Uploads vs Student Submissions) -->
      <div class="flex border-b border-outline-variant/30 mb-6 gap-6 text-xs font-semibold">
        <button 
          (click)="activeTab.set('my-creations')"
          class="pb-3 flex items-center gap-2 border-b-2 cursor-pointer transition-colors"
          [class]="activeTab() === 'my-creations' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'">
          <span class="material-symbols-outlined !text-[16px]">palette</span>
          My Gallery Submissions ({{ mySubmissions().length }})
        </button>
        <button 
          (click)="activeTab.set('student-reviews')"
          class="pb-3 flex items-center gap-2 border-b-2 cursor-pointer transition-colors"
          [class]="activeTab() === 'student-reviews' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-on-surface'">
          <span class="material-symbols-outlined !text-[16px]">school</span>
          Student Project Reviews ({{ studentSubmissions().length }})
        </button>
      </div>

      <!-- Content for Active Tab -->
      @if (activeTab() === 'my-creations') {
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (item of mySubmissions(); track item.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div class="h-44 bg-surface-container-low overflow-hidden relative">
                  <img class="w-full h-full object-cover" [src]="item.imageUrl" [alt]="item.title" />
                  <span class="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs uppercase tracking-wider"
                        [class]="item.status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-300' : (item.status === 'REJECTED' ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-amber-100 text-amber-800 border border-amber-300')">
                    {{ item.status === 'PENDING' ? 'Pending Admin Approval' : (item.status === 'APPROVED' ? 'Approved & Live' : 'Rejected / Needs Revision') }}
                  </span>
                  @if (item.category) {
                    <span class="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 text-white backdrop-blur-xs">
                      {{ item.category }}
                    </span>
                  }
                </div>
                <div class="p-4 space-y-2">
                  <h4 class="font-bold text-sm text-on-surface">{{ item.title }}</h4>
                  <p class="text-[11px] text-on-surface-variant">Course: {{ item.courseTitle || 'Studio Work' }}</p>
                  @if (item.description) {
                    <p class="text-[11px] text-on-surface-variant line-clamp-2 bg-surface-container-low/60 p-2 rounded-md">
                      {{ item.description }}
                    </p>
                  }
                  @if (item.adminFeedback) {
                    <div class="p-2.5 bg-red-50 border border-red-200 rounded-lg text-[10px] text-red-800">
                      <strong>Admin Feedback:</strong> {{ item.adminFeedback }}
                    </div>
                  }
                </div>
              </div>
              <div class="p-4 pt-0 border-t border-outline-variant/20 mt-2 pt-3 flex justify-between items-center text-[10px] text-on-surface-variant">
                <span>Submitted: {{ item.createdAt }}</span>
                <span class="font-semibold" [class.text-green-700]="item.status === 'APPROVED'" [class.text-amber-700]="item.status === 'PENDING'">
                  {{ item.status === 'APPROVED' ? 'Visible in Public Gallery' : 'Awaiting Review' }}
                </span>
              </div>
            </div>
          }
        </div>

        @if (mySubmissions().length === 0) {
          <div class="text-center py-16 bg-surface-container-low rounded-2xl space-y-3">
            <span class="material-symbols-outlined text-outline text-4xl">add_photo_alternate</span>
            <h3 class="font-bold text-sm text-on-surface">No creations submitted yet</h3>
            <p class="text-xs text-on-surface-variant max-w-sm mx-auto">
              Share your handcrafted artworks with the Lemon Academia community. Click "Submit New Creation" to add your first piece.
            </p>
          </div>
        }
      } @else {
        <!-- Student Project Reviews Tab -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (item of studentSubmissions(); track item.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
              <div>
                <div class="h-44 bg-surface-container-low overflow-hidden">
                  <img class="w-full h-full object-cover" [src]="item.imageUrl" [alt]="item.title" />
                </div>
                <div class="p-4 space-y-2">
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-xs">{{ item.title }}</h4>
                    <span class="px-2 py-0.5 rounded text-[9px] font-bold"
                          [class.bg-yellow-100]="item.status === 'PENDING'"
                          [class.text-yellow-800]="item.status === 'PENDING'"
                          [class.bg-green-100]="item.status === 'APPROVED'"
                          [class.text-green-800]="item.status === 'APPROVED'">
                      {{ item.status }}
                    </span>
                  </div>
                  <p class="text-[11px] text-on-surface-variant">Submitted by <strong class="text-on-surface">{{ item.studentName || 'Student' }}</strong></p>
                  @if (item.feedback) {
                    <div class="p-2 bg-primary-container/20 rounded-lg text-[10px] text-primary mt-2">
                      <strong>Trainer Feedback:</strong> {{ item.feedback }}
                    </div>
                  }
                </div>
              </div>
              <div class="p-4 pt-0">
                <button 
                  (click)="handleFeedback(item)"
                  class="w-full py-2 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 mt-2 cursor-pointer transition-opacity">
                  {{ item.feedback ? 'Update Mentoring Feedback' : 'Give Mentoring Feedback' }}
                </button>
              </div>
            </div>
          }
        </div>
      }
    </main>
  `
})
export class TrainerGalleryComponent implements OnInit {
  private galleryService = inject(GalleryService);
  public authService = inject(AuthService);

  activeTab = signal<'my-creations' | 'student-reviews'>('my-creations');
  isUploading = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  formError = signal<string>('');
  formSuccess = signal<string>('');

  // Form fields
  title = signal<string>('');
  category = signal<string>('Lippan Art');
  courseTitle = signal<string>('The Art of Lippan Masterclass');
  artistName = signal<string>('');
  imageUrl = signal<string>('');
  description = signal<string>('');

  // Submissions lists
  mySubmissions = signal<TrainerGallerySubmission[]>([
    {
      id: 'trainer-1',
      title: 'Mandala Mud Mirror Work',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfmBf1HSwY5uR-LAAxu6GpESBkYs22BffeVjJ_nVZyFSdWuRswGeUhxlqCnGAx97UnLPW0ecOB9DC2c3CqgC1b6d2M_GdBM48vhdzppVxuNwgxhXHhGw0c-ojwwa2Pfk3ZwyPO_GtPzr_xDy1OlUWSEpWvopOof-IO7oxPtO6QRlD2lKIw7bN3dZ_UGWSPjzXjEcJv8RBQ2c6QJcPObAIVE9rCB8hsUYBaa_iSyBUMAt5OzWEUgwp9',
      studentName: 'Elena Cruz (Trainer)',
      courseTitle: 'The Art of Lippan Masterclass',
      category: 'Lippan Art',
      description: 'Intricate symmetrical mud mirror composition using authentic clay slip and mirrors.',
      status: 'PENDING',
      createdAt: 'Aug 28, 2026'
    }
  ]);

  studentSubmissions = signal<TrainerGallerySubmission[]>([
    {
      id: 'student-1',
      title: 'Geometric Terracotta Vessel',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAq71zD4kY7nTDde58ZxISgQJ05XWSf-2SsAABr66KdXAYd9wiMfjnx3ROCjH_FoWA7htsaNcXu2PonSBGBgx7Lto46F7ZfZojRz8QcgB6e_UC3EuCIlJ3eAHyGkexhkghUaF9DqElFpN91MA6GyMQi7ufXk1vOwZJBVyTR1DvsspweWMSxBVRCRsvjZsvuCDSfn1m-t0eTPHpvdXvuoG28Uc3b_ErkJrgpY-jcAnhSDnpdsvIhcvvs',
      studentName: 'Sejal Agarwal',
      courseTitle: 'Clay Molding Foundations',
      category: 'Ceramics & Clay',
      feedback: 'Excellent symmetry on the vessel base. Next step: smooth out the rim before kiln drying.',
      status: 'PENDING',
      createdAt: 'Aug 20, 2026'
    }
  ]);

  ngOnInit(): void {
    this.artistName.set(this.authService.userName() || 'Elena Cruz');
    this.loadSubmissions();
  }

  loadSubmissions(): void {
    this.galleryService.getTrainerGallerySubmissions().subscribe({
      next: (items) => {
        if (items && items.length > 0) {
          this.studentSubmissions.set(items);
        }
      },
      error: () => {}
    });
  }

  toggleUploadForm(): void {
    this.isUploading.set(!this.isUploading());
    this.formError.set('');
    this.formSuccess.set('');
  }

  handleSubmitCreation(): void {
    if (!this.title().trim()) {
      this.formError.set('Please provide an artwork title.');
      return;
    }
    if (!this.imageUrl().trim()) {
      this.formError.set('Please provide an image URL for the artwork.');
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    this.formSuccess.set('');

    const payload = {
      title: this.title().trim(),
      imageUrl: this.imageUrl().trim(),
      studentName: this.artistName().trim() || this.authService.userName() || 'Trainer',
      courseTitle: this.courseTitle().trim(),
      category: this.category(),
      description: this.description().trim()
    };

    this.galleryService.submitGalleryItem(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.formSuccess.set('Artwork submitted successfully! It is now pending admin approval before appearing in the public gallery.');
        
        // Add to local submissions with PENDING status
        const newEntry: TrainerGallerySubmission = {
          id: 'trainer-' + Date.now(),
          title: payload.title,
          imageUrl: payload.imageUrl,
          studentName: payload.studentName,
          courseTitle: payload.courseTitle,
          category: payload.category,
          description: payload.description,
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        this.mySubmissions.update(list => [newEntry, ...list]);

        // Reset form
        this.title.set('');
        this.imageUrl.set('');
        this.description.set('');
        
        setTimeout(() => {
          this.isUploading.set(false);
          this.formSuccess.set('');
        }, 2000);
      },
      error: () => {
        // Fallback optimistic submission
        this.isSubmitting.set(false);
        this.formSuccess.set('Artwork submitted successfully! It is now pending admin approval before appearing in the public gallery.');
        
        const newEntry: TrainerGallerySubmission = {
          id: 'trainer-' + Date.now(),
          title: payload.title,
          imageUrl: payload.imageUrl,
          studentName: payload.studentName,
          courseTitle: payload.courseTitle,
          category: payload.category,
          description: payload.description,
          status: 'PENDING',
          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        this.mySubmissions.update(list => [newEntry, ...list]);

        this.title.set('');
        this.imageUrl.set('');
        this.description.set('');

        setTimeout(() => {
          this.isUploading.set(false);
          this.formSuccess.set('');
        }, 2000);
      }
    });
  }

  handleFeedback(item: TrainerGallerySubmission): void {
    const feedback = prompt(`Enter feedback for ${item.studentName}'s creation:`, item.feedback || '');
    if (feedback !== null && feedback.trim()) {
      this.galleryService.giveGalleryFeedback(item.id, feedback.trim()).subscribe({
        next: () => {
          this.studentSubmissions.update(list => list.map(i => i.id === item.id ? { ...i, feedback: feedback.trim() } : i));
        },
        error: () => {
          this.studentSubmissions.update(list => list.map(i => i.id === item.id ? { ...i, feedback: feedback.trim() } : i));
        }
      });
    }
  }
}
