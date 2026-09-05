import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { BlogCategoryService } from '../../../core/services/blog-category.service';
import { BlogCategory } from '../../../core/models/blog-category.model';
import { BlogPost } from '../../../core/models/common.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-blogs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-2xl">article</span>
            Artisan Blog Contributions
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Create, manage, and publish crafting guides, tutorials, and studio stories for the Lemon Academia community.
          </p>
        </div>
        <button 
          (click)="toggleWriteMode()"
          class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
          <span class="material-symbols-outlined text-sm">{{ isWriting() ? 'close' : 'edit' }}</span>
          {{ isWriting() ? (editingPostId() ? 'Cancel Edit' : 'Close Form') : 'Write New Article' }}
        </button>
      </div>

      <!-- Blog Editor Form (Create / Edit) -->
      @if (isWriting()) {
        <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-6 mb-8 shadow-sm space-y-4 animate-in fade-in duration-200">
          <div class="flex justify-between items-center pb-3 border-b border-outline-variant/20">
            <div>
              <h3 class="font-bold text-sm text-on-surface">
                {{ editingPostId() ? 'Edit Blog Article' : 'Compose New Blog Article' }}
              </h3>
              <p class="text-[11px] text-on-surface-variant">
                {{ editingPostId() ? 'Update the details below to refine your article.' : 'Share your craft wisdom and techniques with students worldwide.' }}
              </p>
            </div>
            <button 
              (click)="cancelForm()"
              class="text-on-surface-variant hover:text-on-surface p-1 rounded-md text-xs">
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          <form (ngSubmit)="handleSave()" class="space-y-4">
            <!-- Title & Slug -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Article Title <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. Masterclass in Lippan Art Mirror Placement"
                  [ngModel]="title()"
                  (ngModelChange)="onTitleChange($event)"
                  name="title"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label class="block font-semibold mb-1 text-on-surface">URL Slug <span class="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="e.g. masterclass-lippan-art-mirror-placement"
                  [ngModel]="slug()"
                  (ngModelChange)="slug.set($event)"
                  name="slug"
                  required
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <!-- Category & Image URL -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Category</label>
                <select
                  [ngModel]="selectedCategoryId()"
                  (ngModelChange)="selectedCategoryId.set($event)"
                  name="categoryId"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="">Select Category (optional)</option>
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block font-semibold mb-1 text-on-surface">Cover Image URL</label>
                <input 
                  type="url" 
                  [ngModel]="featuredImageUrl()"
                  (ngModelChange)="featuredImageUrl.set($event)"
                  name="featuredImageUrl"
                  placeholder="https://images.unsplash.com/..."
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <!-- Image Preview if available -->
            @if (featuredImageUrl()) {
              <div class="p-3 bg-surface-container-low rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <img [src]="featuredImageUrl()" alt="Preview" class="w-16 h-12 object-cover rounded-lg" (error)="imageLoadError = true" />
                <div class="text-[11px] text-on-surface-variant">
                  <span class="font-semibold text-on-surface">Cover Preview</span>: Ensure image is accessible and high resolution.
                </div>
              </div>
            }

            <!-- Excerpt / Summary -->
            <div>
              <label class="block font-semibold mb-1 text-on-surface">Short Summary / Excerpt</label>
              <input 
                type="text" 
                placeholder="A brief 1-2 sentence hook for readers..."
                [ngModel]="summary()"
                (ngModelChange)="summary.set($event)"
                name="summary"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <!-- Content Area -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block font-semibold text-on-surface">Article Content <span class="text-red-500">*</span></label>
                <span class="text-[10px] text-on-surface-variant">Supports multi-paragraph descriptions, material lists, and crafting advice</span>
              </div>
              <textarea 
                rows="7"
                placeholder="Write your complete article content here... Break into steps or sections for easy reading."
                [ngModel]="content()"
                (ngModelChange)="content.set($event)"
                name="content"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary leading-relaxed"
              ></textarea>
            </div>

            <!-- Tags -->
            <div>
              <label class="block font-semibold mb-1 text-on-surface">Tags (comma separated)</label>
              <input 
                type="text" 
                placeholder="e.g. Lippan Art, Clay, Beginners, Crafting Tips"
                [ngModel]="tagsInput()"
                (ngModelChange)="tagsInput.set($event)"
                name="tags"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary"
              />
            </div>

            <!-- Error Notice -->
            @if (errorMessage()) {
              <div class="text-red-700 text-xs font-medium bg-red-50 border border-red-200 p-2.5 rounded-lg flex items-center gap-2">
                <span class="material-symbols-outlined text-sm">error</span>
                {{ errorMessage() }}
              </div>
            }

            <!-- Form Action Buttons -->
            <div class="flex items-center gap-3 pt-2">
              <button 
                type="submit" 
                [disabled]="isSaving()"
                class="flex-1 py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                @if (isSaving()) {
                  <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Saving...</span>
                } @else {
                  <span class="material-symbols-outlined text-sm">publish</span>
                  <span>{{ editingPostId() ? 'Update Article' : 'Publish Article to Blog' }}</span>
                }
              </button>
              <button 
                type="button" 
                (click)="cancelForm()"
                class="px-5 py-2.5 bg-surface-container-high text-on-surface font-semibold rounded-lg hover:bg-surface-variant transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Search and Filters Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
        <div class="relative w-full sm:w-72">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search articles..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button 
            (click)="selectedFilter.set('all')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedFilter() === 'all' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            All ({{ posts().length }})
          </button>
          <button 
            (click)="selectedFilter.set('published')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedFilter() === 'published' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            Published ({{ publishedCount() }})
          </button>
          <button 
            (click)="selectedFilter.set('draft')"
            class="px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors cursor-pointer"
            [class]="selectedFilter() === 'draft' ? 'bg-primary text-on-primary shadow-xs' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'">
            Drafts ({{ draftCount() }})
          </button>
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
      } @else if (filteredPosts().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          @for (post of filteredPosts(); track post.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div class="space-y-3">
                <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
                  @if (post.image || post.imageUrl) {
                    <img class="w-full h-full object-cover" [src]="post.image || post.imageUrl" [alt]="post.title" />
                  } @else {
                    <div class="w-full h-full flex items-center justify-center bg-surface-container">
                      <span class="material-symbols-outlined text-3xl text-outline">article</span>
                    </div>
                  }
                  <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container shadow-xs">
                    {{ post.category }}
                  </span>
                  @if (post.isPublished !== undefined) {
                    <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs"
                          [class]="post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ post.isPublished ? 'Published Live' : 'Draft' }}
                    </span>
                  }
                </div>
                <div>
                  <h3 class="font-bold text-sm text-on-surface line-clamp-1">{{ post.title }}</h3>
                  <p class="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">{{ post.excerpt || post.summary || 'No excerpt available.' }}</p>
                </div>
              </div>

              <div class="pt-3 border-t border-outline-variant/20 mt-4 flex flex-col gap-2">
                <div class="flex justify-between items-center text-[11px] text-on-surface-variant">
                  <span>{{ post.author }} • {{ post.date }}</span>
                  <span>{{ post.readTime }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 pt-1">
                  <a [routerLink]="['/blogs', post.id]" class="text-primary hover:underline font-semibold flex items-center gap-1 text-[11px]">
                    <span class="material-symbols-outlined text-xs">visibility</span>
                    View Live
                  </a>
                  <div class="flex items-center gap-1.5">
                    <button 
                      (click)="editBlog(post)"
                      class="px-2.5 py-1 rounded text-[10px] font-semibold bg-surface-container-high text-on-surface hover:bg-surface-variant cursor-pointer flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">edit</span>
                      Edit
                    </button>
                    <button 
                      (click)="togglePublish(post)"
                      class="px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer"
                      [class]="post.isPublished ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'">
                      {{ post.isPublished ? 'Unpublish' : 'Publish' }}
                    </button>
                    <button 
                      (click)="deleteBlog(post)"
                      class="px-2.5 py-1 rounded text-[10px] font-semibold bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer flex items-center gap-1">
                      <span class="material-symbols-outlined text-[13px]">delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-16 bg-surface-container-low rounded-2xl space-y-3">
          <span class="material-symbols-outlined text-outline text-4xl">article</span>
          <h3 class="font-bold text-sm text-on-surface">
            {{ searchQuery() ? 'No matching blog posts found' : 'No blog contributions yet' }}
          </h3>
          <p class="text-xs text-on-surface-variant max-w-sm mx-auto">
            {{ searchQuery() ? 'Try modifying your search keywords or filter.' : 'Share your expertise with the Lemon Academia community. Write and publish your first article today.' }}
          </p>
          @if (!isWriting()) {
            <button 
              (click)="toggleWriteMode()"
              class="mt-2 bg-primary text-on-primary font-semibold px-4 py-2 rounded-lg hover:opacity-90 cursor-pointer inline-flex items-center gap-1.5 shadow-sm">
              <span class="material-symbols-outlined text-sm">edit</span>
              Write First Article
            </button>
          }
        </div>
      }
    </main>
  `
})
export class TrainerBlogsComponent implements OnInit {
  private blogService = inject(BlogService);
  private blogCategoryService = inject(BlogCategoryService);
  public authService = inject(AuthService);

  posts = signal<BlogPost[]>([]);
  categories = signal<BlogCategory[]>([]);
  isLoading = signal<boolean>(true);
  isWriting = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');
  editingPostId = signal<string | null>(null);

  // Form fields
  title = signal<string>('');
  slug = signal<string>('');
  content = signal<string>('');
  summary = signal<string>('');
  featuredImageUrl = signal<string>('');
  selectedCategoryId = signal<string>('');
  tagsInput = signal<string>('');

  imageLoadError = false;
  searchQuery = signal<string>('');
  selectedFilter = signal<'all' | 'published' | 'draft'>('all');

  publishedCount = computed(() => this.posts().filter(p => p.isPublished).length);
  draftCount = computed(() => this.posts().filter(p => !p.isPublished).length);

  filteredPosts = computed(() => {
    let list = this.posts();
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.selectedFilter();

    if (filter === 'published') {
      list = list.filter(p => p.isPublished);
    } else if (filter === 'draft') {
      list = list.filter(p => !p.isPublished);
    }

    if (q) {
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.excerpt && p.excerpt.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return list;
  });

  ngOnInit(): void {
    this.loadBlogs();
    this.loadCategories();
  }

  loadBlogs(): void {
    this.isLoading.set(true);
    this.blogService.getBlogs().subscribe({
      next: (blogs) => {
        this.posts.set(blogs);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  loadCategories(): void {
    this.blogCategoryService.getCategories().subscribe({
      next: (cats) => {
        if (cats && cats.length > 0) {
          this.categories.set(cats);
        } else {
          // Fallback categories if backend returns empty
          this.categories.set([
            { id: 'crafting-tips', name: 'Crafting Tips', slug: 'crafting-tips' },
            { id: 'materials-guide', name: 'Materials Guide', slug: 'materials-guide' },
            { id: 'artisan-spotlight', name: 'Artisan Spotlight', slug: 'artisan-spotlight' },
            { id: 'tutorials', name: 'Tutorials & Techniques', slug: 'tutorials' },
            { id: 'community', name: 'Community Stories', slug: 'community' }
          ]);
        }
      },
      error: () => {
        this.categories.set([
          { id: 'crafting-tips', name: 'Crafting Tips', slug: 'crafting-tips' },
          { id: 'materials-guide', name: 'Materials Guide', slug: 'materials-guide' },
          { id: 'artisan-spotlight', name: 'Artisan Spotlight', slug: 'artisan-spotlight' },
          { id: 'tutorials', name: 'Tutorials & Techniques', slug: 'tutorials' }
        ]);
      }
    });
  }

  toggleWriteMode(): void {
    if (this.isWriting()) {
      this.cancelForm();
    } else {
      this.resetForm();
      this.isWriting.set(true);
    }
  }

  onTitleChange(newTitle: string): void {
    this.title.set(newTitle);
    // Auto generate slug only when creating new article or if slug matches old auto pattern
    if (!this.editingPostId()) {
      const generatedSlug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      this.slug.set(generatedSlug);
    }
  }

  editBlog(post: BlogPost): void {
    this.editingPostId.set(String(post.id));
    this.title.set(post.title);
    this.slug.set(post.slug || '');
    this.content.set(post.content || '');
    this.summary.set(post.excerpt || post.summary || '');
    this.featuredImageUrl.set(post.image || post.imageUrl || '');
    this.tagsInput.set(post.tags ? post.tags.join(', ') : '');

    // Match category
    const foundCat = this.categories().find(c => c.name.toLowerCase() === post.category.toLowerCase() || c.id === post.category);
    this.selectedCategoryId.set(foundCat ? foundCat.id : '');

    this.errorMessage.set('');
    this.isWriting.set(true);

    // Scroll smoothly to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  cancelForm(): void {
    this.isWriting.set(false);
    this.editingPostId.set(null);
    this.resetForm();
  }

  resetForm(): void {
    this.title.set('');
    this.slug.set('');
    this.content.set('');
    this.summary.set('');
    this.featuredImageUrl.set('');
    this.selectedCategoryId.set('');
    this.tagsInput.set('');
    this.errorMessage.set('');
  }

  handleSave(): void {
    if (!this.title().trim()) {
      this.errorMessage.set('Please provide an article title.');
      return;
    }
    if (!this.slug().trim()) {
      this.errorMessage.set('Please provide a URL slug.');
      return;
    }
    if (!this.content().trim()) {
      this.errorMessage.set('Please provide the article content.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');

    const tags = this.tagsInput()
      ? this.tagsInput().split(',').map(t => t.trim()).filter(Boolean)
      : undefined;

    const payload = {
      title: this.title().trim(),
      slug: this.slug().trim(),
      content: this.content().trim(),
      featuredImageUrl: this.featuredImageUrl().trim() || undefined,
      categoryId: this.selectedCategoryId() || undefined,
      tags: tags,
      seoDescription: this.summary().trim() || undefined
    };

    if (this.editingPostId()) {
      // Update existing post
      this.blogService.updateBlog(this.editingPostId()!, payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isWriting.set(false);
          this.editingPostId.set(null);
          this.resetForm();
          this.loadBlogs();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to update article. Please try again.');
        }
      });
    } else {
      // Create new post
      this.blogService.createBlog(payload).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.isWriting.set(false);
          this.resetForm();
          this.loadBlogs();
        },
        error: (err) => {
          this.isSaving.set(false);
          this.errorMessage.set(err.error?.message || 'Failed to publish article. Please try again.');
        }
      });
    }
  }

  togglePublish(post: BlogPost): void {
    this.blogService.togglePublish(String(post.id)).subscribe({
      next: () => this.loadBlogs(),
      error: () => {}
    });
  }

  deleteBlog(post: BlogPost): void {
    if (!confirm(`Are you sure you want to delete "${post.title}"? This cannot be undone.`)) return;
    this.blogService.deleteBlog(String(post.id)).subscribe({
      next: () => this.loadBlogs(),
      error: () => {}
    });
  }
}
