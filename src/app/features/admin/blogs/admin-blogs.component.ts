import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPost } from '../../../core/models/common.model';
import { BlogService } from '../../../core/services/blog.service';
import { BlogCategoryService } from '../../../core/services/blog-category.service';
import { BlogCategory } from '../../../core/models/blog-category.model';
import { UploadService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Editorial Blog Management</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Publish articles, craft tutorials, and artisan guides.</p>
        </div>
        <button 
          (click)="isWriting.set(!isWriting())"
          class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer">
          <span class="material-symbols-outlined text-sm">edit</span>
          Write New Article
        </button>
      </div>

      @if (isWriting()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
          <h3 class="font-bold text-sm">Compose Article</h3>
          <form (ngSubmit)="handlePublish()" class="space-y-3">
            <div>
              <label class="block font-semibold mb-1">Article Title</label>
              <input 
                type="text" 
                placeholder="e.g. Masterclass in Mirror Placement"
                [ngModel]="title()"
                (ngModelChange)="title.set($event)"
                name="title"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
              />
            </div>
            <div>
              <label class="block font-semibold mb-1">Content</label>
              <textarea 
                rows="6"
                placeholder="Write your full article content..."
                [ngModel]="content()"
                (ngModelChange)="content.set($event)"
                name="content"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1">Slug</label>
                <input 
                  type="text" 
                  placeholder="e.g. masterclass-mirror-placement"
                  [ngModel]="slug()"
                  (ngModelChange)="slug.set($event)"
                  name="slug"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
                />
              </div>
            <div>
                <label class="block font-semibold mb-1">Category</label>
                <select
                  [ngModel]="selectedCategoryId()"
                  (ngModelChange)="selectedCategoryId.set($event)"
                  name="categoryId"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
                >
                  <option value="">Select Category (optional)</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>
              <div class="space-y-1">
                <label class="block font-semibold mb-1">Cover Image</label>
                <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input 
                    type="url" 
                    [ngModel]="featuredImageUrl()"
                    (ngModelChange)="featuredImageUrl.set($event)"
                    name="featuredImageUrl"
                    placeholder="https://images.unsplash.com/..."
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs font-mono"
                  />
                  <div class="shrink-0">
                    <input 
                      type="file" 
                      #blogFileInput 
                      (change)="onBlogImageSelected($event)" 
                      accept="image/png,image/jpeg,image/webp,image/jpg" 
                      class="hidden" 
                    />
                    <button 
                      type="button" 
                      (click)="blogFileInput.click()" 
                      [disabled]="isUploadingImage()"
                      class="px-3 py-2.5 bg-surface-container-high hover:bg-surface-dim text-on-surface rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs border border-outline-variant/30 transition-all disabled:opacity-50">
                      @if (isUploadingImage()) {
                        <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                        <span>Uploading...</span>
                      } @else {
                        <span class="material-symbols-outlined text-sm text-primary">add_photo_alternate</span>
                        <span>Upload</span>
                      }
                    </button>
                  </div>
                </div>
                @if (featuredImageUrl()) {
                  <div class="p-2 bg-surface-container-low rounded-lg flex items-center gap-2.5 border border-outline-variant/20 mt-2">
                    <img [src]="featuredImageUrl()" alt="Cover preview" class="w-12 h-10 object-cover rounded-md border border-outline-variant/30 shrink-0" />
                    <div class="truncate text-[11px] text-on-surface-variant">
                      <span class="font-semibold text-on-surface">Cover Loaded</span>
                      <p class="truncate text-[10px] font-mono text-on-surface-variant/80">{{ featuredImageUrl() }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
            @if (publishError()) {
              <div class="text-red-600 text-xs font-medium bg-red-50 p-2 rounded-lg">
                {{ publishError() }}
              </div>
            }
            <button 
              type="submit" 
              [disabled]="isPublishing() || isUploadingImage()"
              class="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
              @if (isPublishing()) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Publishing...</span>
              } @else {
                <span class="material-symbols-outlined text-sm">publish</span>
                <span>Publish Post to Blog</span>
              }
            </button>
          </form>
        </div>
      }

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm animate-pulse">
              <div class="h-36 bg-surface-container-high rounded-lg mb-3"></div>
              <div class="h-4 bg-surface-container-high rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-surface-container-high rounded w-full mb-1"></div>
              <div class="h-3 bg-surface-container-high rounded w-2/3"></div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (post of posts(); track post.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div class="space-y-3">
                <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
                  @if (post.image || post.imageUrl) {
                    <img class="w-full h-full object-cover" [src]="post.image || post.imageUrl" [alt]="post.title" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-surface-container">
                      <span class="material-symbols-outlined text-3xl text-outline">image</span>
                    </div>
                  }
                  <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                    {{ post.category }}
                  </span>
                  @if (post.isPublished !== undefined) {
                    <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          [class]="post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ post.isPublished ? 'Published' : 'Draft' }}
                    </span>
                  }
                </div>
                <h3 class="font-bold text-sm">{{ post.title }}</h3>
                <p class="text-xs text-on-surface-variant leading-relaxed">{{ post.excerpt }}</p>
              </div>
              <div class="pt-3 border-t border-outline-variant/20 mt-4 flex justify-between items-center text-[11px] text-on-surface-variant">
                <span>{{ post.author }} • {{ post.date }}</span>
                <div class="flex items-center gap-2">
                  <span>{{ post.readTime }}</span>
                  <button 
                    (click)="togglePublish(post)"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                    [class]="post.isPublished ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'">
                    {{ post.isPublished ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button 
                    (click)="deleteBlog(post)"
                    class="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        @if (posts().length === 0) {
          <div class="text-center py-16 bg-surface-container-low rounded-2xl space-y-3">
            <span class="material-symbols-outlined text-outline text-4xl">article</span>
            <h3 class="font-bold text-sm text-on-surface">No blog posts yet</h3>
            <p class="text-xs text-on-surface-variant">Click "Write New Article" to create your first blog post.</p>
          </div>
        }
      }
    </main>
  `
})
export class AdminBlogsComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  isWriting = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  isPublishing = signal<boolean>(false);
  publishError = signal<string>('');
  isUploadingImage = signal<boolean>(false);

  title = signal<string>('');
  content = signal<string>('');
  slug = signal<string>('');
  featuredImageUrl = signal<string>('');
  selectedCategoryId = signal<string>('');
  categories = signal<BlogCategory[]>([]);

  constructor(
    private blogService: BlogService, 
    private blogCategoryService: BlogCategoryService,
    private uploadService: UploadService
  ) {}

  onBlogImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.isUploadingImage.set(true);
      this.uploadService.uploadImage(file, 'blogs').subscribe({
        next: (res: any) => {
          this.isUploadingImage.set(false);
          const url = res.url || res.secure_url || res.data?.url;
          if (url) this.featuredImageUrl.set(url);
          input.value = '';
        },
        error: () => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.isUploadingImage.set(false);
            if (e.target?.result) this.featuredImageUrl.set(e.target.result as string);
            input.value = '';
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadBlogs();
    this.loadCategories();
  }

  loadBlogs(): void {
    this.isLoading.set(true);
    this.blogService.getBlogs().subscribe(blogs => {
      this.posts.set(blogs);
      this.isLoading.set(false);
    });
  }

  loadCategories(): void {
    this.blogCategoryService.getCategories().subscribe(cats => {
      this.categories.set(cats);
    });
  }

  handlePublish(): void {
    if (!this.title().trim() || !this.content().trim() || !this.slug().trim()) return;

    this.isPublishing.set(true);
    this.publishError.set('');

    this.blogService.createBlog({
      title: this.title(),
      slug: this.slug(),
      content: this.content(),
      featuredImageUrl: this.featuredImageUrl() || undefined,
      categoryId: this.selectedCategoryId() || undefined
    }).subscribe({
      next: () => {
        this.isWriting.set(false);
        this.title.set('');
        this.content.set('');
        this.slug.set('');
        this.featuredImageUrl.set('');
        this.selectedCategoryId.set('');
        this.isPublishing.set(false);
        this.loadBlogs();
      },
      error: (err) => {
        this.publishError.set(err.error?.message || 'Failed to publish blog. Please try again.');
        this.isPublishing.set(false);
      }
    });
  }

  togglePublish(post: BlogPost): void {
    this.blogService.togglePublish(String(post.id)).subscribe({
      next: () => this.loadBlogs(),
      error: () => {}
    });
  }

  deleteBlog(post: BlogPost): void {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    this.blogService.deleteBlog(String(post.id)).subscribe({
      next: () => this.loadBlogs(),
      error: () => {}
    });
  }
}
