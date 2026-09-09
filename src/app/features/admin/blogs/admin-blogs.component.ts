import { Component, OnInit, computed, signal } from '@angular/core';
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
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-2xl">menu_book</span>
            Editorial Blog &amp; Category Management
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Publish artisan stories, manage blog categories, and curate tutorials.</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            (click)="isManagingCategories.set(!isManagingCategories())"
            class="bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant/40 font-semibold px-3.5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer">
            <span class="material-symbols-outlined text-sm text-primary">category</span>
            Manage Categories ({{ categories().length }})
          </button>
          <button 
            (click)="isWriting.set(!isWriting())"
            class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-sm">edit</span>
            {{ isWriting() ? 'Close Editor' : 'Write New Article' }}
          </button>
        </div>
      </div>

      <!-- Category Management Drawer / Card -->
      @if (isManagingCategories()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
          <div class="flex justify-between items-center border-b border-outline-variant/20 pb-3">
            <div>
              <h3 class="font-bold text-sm text-on-surface flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-base">category</span>
                Blog Categories
              </h3>
              <p class="text-[11px] text-on-surface-variant">Create and manage content categories for articles and tutorials.</p>
            </div>
            <button (click)="isManagingCategories.set(false)" class="text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <!-- Add Category Form -->
          <div class="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-3">
            <h4 class="font-bold text-xs text-on-surface">Add New Blog Category</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-semibold mb-1 text-[11px]">Category Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Crafting Tips & Tutorials"
                  [ngModel]="newCategoryName()"
                  (ngModelChange)="onNewCategoryNameChange($event)"
                  class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-[11px]">Category Slug *</label>
                <input 
                  type="text" 
                  placeholder="e.g. crafting-tips"
                  [ngModel]="newCategorySlug()"
                  (ngModelChange)="newCategorySlug.set($event)"
                  class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none font-mono"
                />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-[11px]">Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Step-by-step guides for makers"
                  [ngModel]="newCategoryDesc()"
                  (ngModelChange)="newCategoryDesc.set($event)"
                  class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>

            @if (categoryError()) {
              <p class="text-red-600 text-xs font-medium">{{ categoryError() }}</p>
            }

            <div class="flex justify-end">
              <button 
                (click)="handleAddCategory()"
                [disabled]="isAddingCategory() || !newCategoryName().trim()"
                class="bg-primary text-on-primary font-semibold px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 cursor-pointer text-xs flex items-center gap-1.5">
                @if (isAddingCategory()) {
                  <span class="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                  <span>Saving...</span>
                } @else {
                  <span class="material-symbols-outlined text-xs">add</span>
                  <span>Add Category</span>
                }
              </button>
            </div>
          </div>

          <!-- Existing Categories List -->
          <div>
            <h4 class="font-bold text-xs text-on-surface mb-2">Existing Categories ({{ categories().length }})</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              @for (cat of categories(); track cat.id) {
                <div class="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/30 flex items-center justify-between shadow-2xs">
                  <div>
                    <span class="font-bold text-xs text-on-surface block">{{ cat.name }}</span>
                    <span class="text-[10px] text-on-surface-variant font-mono block">{{ cat.slug }}</span>
                    @if (cat.description) {
                      <span class="text-[10px] text-on-surface-variant line-clamp-1 mt-0.5">{{ cat.description }}</span>
                    }
                  </div>
                  <button 
                    (click)="handleDeleteCategory(cat)"
                    class="w-7 h-7 rounded bg-red-50 text-red-700 hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                    title="Delete Category">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              }

              @if (categories().length === 0) {
                <p class="text-on-surface-variant text-xs col-span-3 py-3 text-center">No custom categories created yet.</p>
              }
            </div>
          </div>
        </div>
      }

      <!-- Blog Composer Form -->
      @if (isWriting()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
          <h3 class="font-bold text-sm text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-base">edit_note</span>
            Compose Blog Article
          </h3>
          <form (ngSubmit)="handlePublish()" class="space-y-3">
            <div>
              <label class="block font-semibold mb-1">Article Title *</label>
              <input 
                type="text" 
                placeholder="e.g. Masterclass in Mirror Placement and Clay Curing"
                [ngModel]="title()"
                (ngModelChange)="onTitleChange($event)"
                name="title"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label class="block font-semibold mb-1">Article Content *</label>
              <textarea 
                rows="7"
                placeholder="Write your full article content, instructions, tips, and insights here..."
                [ngModel]="content()"
                (ngModelChange)="content.set($event)"
                name="content"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none leading-relaxed"
              ></textarea>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1">Article Slug *</label>
                <input 
                  type="text" 
                  placeholder="e.g. masterclass-mirror-placement"
                  [ngModel]="slug()"
                  (ngModelChange)="slug.set($event)"
                  name="slug"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="block font-semibold">Category</label>
                  <button 
                    type="button" 
                    (click)="isManagingCategories.set(true)" 
                    class="text-[10px] text-primary hover:underline font-semibold cursor-pointer">
                    + Add New Category
                  </button>
                </div>
                <select
                  [ngModel]="selectedCategoryId()"
                  (ngModelChange)="selectedCategoryId.set($event)"
                  name="categoryId"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="">Select Category (Optional)</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>
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
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
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
                    class="px-3.5 py-2.5 bg-surface-container-high hover:bg-surface-dim text-on-surface rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs border border-outline-variant/30 transition-all disabled:opacity-50">
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

            @if (publishError()) {
              <div class="text-red-600 text-xs font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                {{ publishError() }}
              </div>
            }

            <button 
              type="submit" 
              [disabled]="isPublishing() || isUploadingImage()"
              class="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm">
              @if (isPublishing()) {
                <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                <span>Publishing...</span>
              } @else {
                <span class="material-symbols-outlined text-sm">publish</span>
                <span>Publish Article to Blog</span>
              }
            </button>
          </form>
        </div>
      }

      <!-- Search & Category Filters -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button 
            (click)="selectedCategoryFilter.set('All')"
            class="px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
            [class]="selectedCategoryFilter() === 'All' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            All Articles ({{ posts().length }})
          </button>
          @for (cat of categories(); track cat.id) {
            <button 
              (click)="selectedCategoryFilter.set(cat.name)"
              class="px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
              [class]="selectedCategoryFilter() === cat.name ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
              {{ cat.name }}
            </button>
          }
        </div>
      </div>

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
          @for (post of filteredPosts(); track post.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div class="space-y-3">
                <div class="h-40 bg-surface-container-low rounded-lg overflow-hidden relative">
                  @if (post.image || post.imageUrl) {
                    <img class="w-full h-full object-cover" [src]="post.image || post.imageUrl" [alt]="post.title" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-surface-container">
                      <span class="material-symbols-outlined text-3xl text-outline">image</span>
                    </div>
                  }
                  <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container shadow-xs">
                    {{ post.category || 'Article' }}
                  </span>
                  @if (post.isPublished !== undefined) {
                    <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs"
                          [class]="post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ post.isPublished ? 'Published' : 'Draft' }}
                    </span>
                  }
                </div>
                <h3 class="font-bold text-sm text-on-surface line-clamp-2">{{ post.title }}</h3>
                <p class="text-xs text-on-surface-variant leading-relaxed line-clamp-3">{{ post.excerpt || post.content }}</p>
              </div>
              <div class="pt-3 border-t border-outline-variant/20 mt-4 flex justify-between items-center text-[11px] text-on-surface-variant">
                <span>{{ post.author || 'Artisan' }} • {{ post.date }}</span>
                <div class="flex items-center gap-2">
                  <button 
                    (click)="togglePublish(post)"
                    class="px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-colors"
                    [class]="post.isPublished ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'">
                    {{ post.isPublished ? 'Unpublish' : 'Publish' }}
                  </button>
                  <button 
                    (click)="deleteBlog(post)"
                    class="px-2.5 py-1 rounded text-[10px] font-semibold bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          }
        </div>

        @if (filteredPosts().length === 0) {
          <div class="text-center py-16 bg-surface-container-low rounded-2xl space-y-3">
            <span class="material-symbols-outlined text-outline text-4xl">article</span>
            <h3 class="font-bold text-sm text-on-surface">No blog posts found</h3>
            <p class="text-xs text-on-surface-variant">Click "Write New Article" to compose an article for this category.</p>
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

  // Category State
  isManagingCategories = signal<boolean>(false);
  categories = signal<BlogCategory[]>([]);
  selectedCategoryFilter = signal<string>('All');
  newCategoryName = signal<string>('');
  newCategorySlug = signal<string>('');
  newCategoryDesc = signal<string>('');
  isAddingCategory = signal<boolean>(false);
  categoryError = signal<string>('');

  // Form State
  title = signal<string>('');
  content = signal<string>('');
  slug = signal<string>('');
  featuredImageUrl = signal<string>('');
  selectedCategoryId = signal<string>('');

  constructor(
    private blogService: BlogService, 
    private blogCategoryService: BlogCategoryService,
    private uploadService: UploadService
  ) {}

  filteredPosts = computed(() => {
    const filter = this.selectedCategoryFilter();
    if (filter === 'All') return this.posts();
    return this.posts().filter(p => p.category === filter);
  });

  ngOnInit(): void {
    this.loadBlogs();
    this.loadCategories();
  }

  onTitleChange(val: string): void {
    this.title.set(val);
    if (!this.slug()) {
      this.slug.set(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }

  onNewCategoryNameChange(val: string): void {
    this.newCategoryName.set(val);
    if (!this.newCategorySlug()) {
      this.newCategorySlug.set(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  }

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

  loadBlogs(): void {
    this.isLoading.set(true);
    this.blogService.getBlogs().subscribe(blogs => {
      this.posts.set(blogs);
      this.isLoading.set(false);
    });
  }

  loadCategories(): void {
    this.blogCategoryService.getCategories().subscribe(cats => {
      this.categories.set(cats || []);
    });
  }

  handleAddCategory(): void {
    const name = this.newCategoryName().trim();
    const slug = this.newCategorySlug().trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    if (!name) return;

    this.isAddingCategory.set(true);
    this.categoryError.set('');

    this.blogCategoryService.createCategory({
      name,
      slug,
      description: this.newCategoryDesc().trim() || undefined
    }).subscribe({
      next: (created) => {
        this.isAddingCategory.set(false);
        this.newCategoryName.set('');
        this.newCategorySlug.set('');
        this.newCategoryDesc.set('');
        this.loadCategories();
      },
      error: (err) => {
        this.isAddingCategory.set(false);
        // If backend fails, add locally to signal list
        const localCat: BlogCategory = {
          id: 'cat_' + Date.now(),
          name,
          slug,
          description: this.newCategoryDesc().trim()
        };
        this.categories.update(list => [...list, localCat]);
        this.newCategoryName.set('');
        this.newCategorySlug.set('');
        this.newCategoryDesc.set('');
      }
    });
  }

  handleDeleteCategory(cat: BlogCategory): void {
    if (!confirm(`Delete category "${cat.name}"?`)) return;

    this.blogCategoryService.deleteCategory(cat.id).subscribe({
      next: () => this.loadCategories(),
      error: () => {
        this.categories.update(list => list.filter(c => c.id !== cat.id));
      }
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
