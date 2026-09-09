import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { BlogCategoryService } from '../../../core/services/blog-category.service';
import { BlogCategory } from '../../../core/models/blog-category.model';
import { BlogPost } from '../../../core/models/common.model';
import { AuthService } from '../../../core/services/auth.service';
import { UploadService } from '../../../core/services/upload.service';

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
            Artisan Blog Contributions &amp; Categories
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Create, manage, and publish crafting guides, studio stories, and blog categories for the Lemon Academia community.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button 
            (click)="showCategoryModal.set(true)"
            class="bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold px-3.5 py-2.5 rounded-lg border border-outline-variant/30 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all">
            <span class="material-symbols-outlined text-sm text-primary">category</span>
            Manage Categories ({{ categories().length }})
          </button>
          <button 
            (click)="toggleWriteMode()"
            class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-all">
            <span class="material-symbols-outlined text-sm">{{ isWriting() ? 'close' : 'edit' }}</span>
            {{ isWriting() ? (editingPostId() ? 'Cancel Edit' : 'Close Form') : 'Write New Article' }}
          </button>
        </div>
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
              class="text-on-surface-variant hover:text-on-surface p-1 rounded-md text-xs cursor-pointer">
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
                <div class="flex justify-between items-center mb-1">
                  <label class="font-semibold text-on-surface">Blog Category</label>
                  <button 
                    type="button"
                    (click)="showCategoryModal.set(true)"
                    class="text-primary hover:underline font-bold text-[11px] flex items-center gap-0.5 cursor-pointer">
                    <span class="material-symbols-outlined text-[13px]">add</span>
                    + Add New Category
                  </button>
                </div>
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
              <div class="space-y-1">
                <label class="block font-semibold mb-1 text-on-surface">Cover Image</label>
                <div class="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                  <input 
                    type="url" 
                    [ngModel]="featuredImageUrl()"
                    (ngModelChange)="featuredImageUrl.set($event)"
                    name="featuredImageUrl"
                    placeholder="https://images.unsplash.com/..."
                    class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:outline-none focus:border-primary font-mono"
                  />
                  <div class="shrink-0">
                    <input 
                      type="file" 
                      #trainerBlogFileInput 
                      (change)="onBlogImageSelected($event)" 
                      accept="image/png,image/jpeg,image/webp,image/jpg" 
                      class="hidden" 
                    />
                    <button 
                      type="button" 
                      (click)="trainerBlogFileInput.click()" 
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
              </div>
            </div>

            <!-- Image Preview if available -->
            @if (featuredImageUrl()) {
              <div class="p-3 bg-surface-container-low rounded-xl flex items-center gap-3 border border-outline-variant/20">
                <img [src]="featuredImageUrl()" alt="Preview" class="w-16 h-12 object-cover rounded-lg border border-outline-variant/30 shrink-0" (error)="imageLoadError = true" />
                <div class="truncate text-[11px] text-on-surface-variant">
                  <span class="font-semibold text-on-surface">Cover Preview</span>: <span class="font-mono text-[10px] text-on-surface-variant/80">{{ featuredImageUrl() }}</span>
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

        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <!-- Category Filter Dropdown -->
          <select 
            [ngModel]="selectedCategoryFilter()" 
            (ngModelChange)="selectedCategoryFilter.set($event)"
            class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary">
            <option value="">All Categories</option>
            @for (cat of categories(); track cat.id) {
              <option [value]="cat.name">{{ cat.name }}</option>
            }
          </select>

          <div class="flex items-center gap-1.5">
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

      <!-- Blog Category Management Modal -->
      @if (showCategoryModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">category</span>
                <div>
                  <h3 class="text-base font-bold text-on-surface">Blog Categories</h3>
                  <p class="text-[11px] text-on-surface-variant">Create and manage artisan blog categories</p>
                </div>
              </div>
              <button 
                (click)="showCategoryModal.set(false)"
                class="w-7 h-7 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface cursor-pointer">
                <span class="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <!-- Create New Category Form -->
            <form (ngSubmit)="handleCreateCategory()" class="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 space-y-3">
              <h4 class="font-bold text-xs text-on-surface flex items-center gap-1">
                <span class="material-symbols-outlined text-sm text-primary">add_circle</span>
                Add New Blog Category
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-on-surface mb-1">Category Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lippan Mirror Crafts"
                    [ngModel]="newCategoryName()"
                    (ngModelChange)="onNewCategoryNameChange($event)"
                    name="newCategoryName"
                    required
                    class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-on-surface mb-1">Category Slug *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. lippan-mirror-crafts"
                    [ngModel]="newCategorySlug()"
                    (ngModelChange)="newCategorySlug.set($event)"
                    name="newCategorySlug"
                    required
                    class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 text-xs focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-on-surface mb-1">Description (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Short overview of articles under this topic..."
                  [ngModel]="newCategoryDescription()"
                  (ngModelChange)="newCategoryDescription.set($event)"
                  name="newCategoryDescription"
                  class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg p-2 text-xs focus:outline-none focus:border-primary"
                />
              </div>

              @if (categoryError()) {
                <p class="text-[11px] text-red-600 font-medium">{{ categoryError() }}</p>
              }
              @if (categorySuccess()) {
                <p class="text-[11px] text-green-700 font-medium">{{ categorySuccess() }}</p>
              }

              <div class="flex justify-end">
                <button 
                  type="submit"
                  [disabled]="isSavingCategory() || !newCategoryName().trim()"
                  class="bg-primary text-on-primary font-bold px-4 py-2 rounded-lg text-xs hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center gap-1">
                  @if (isSavingCategory()) {
                    <span class="material-symbols-outlined text-xs animate-spin">progress_activity</span>
                    <span>Saving...</span>
                  } @else {
                    <span class="material-symbols-outlined text-xs">add</span>
                    <span>Create Category</span>
                  }
                </button>
              </div>
            </form>

            <!-- Existing Categories List -->
            <div class="space-y-2">
              <h4 class="font-bold text-xs text-on-surface">Existing Categories ({{ categories().length }})</h4>
              <div class="divide-y divide-outline-variant/15 border border-outline-variant/20 rounded-xl overflow-hidden bg-surface-container-lowest">
                @for (cat of categories(); track cat.id) {
                  <div class="p-3 flex items-center justify-between hover:bg-surface-container-low/40 transition-colors">
                    <div>
                      <div class="font-bold text-xs text-on-surface flex items-center gap-2">
                        <span>{{ cat.name }}</span>
                        <span class="font-mono text-[10px] text-on-surface-variant/70 font-normal">/{{ cat.slug }}</span>
                      </div>
                      @if (cat.description) {
                        <p class="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">{{ cat.description }}</p>
                      }
                    </div>
                    <button 
                      type="button"
                      (click)="deleteCategory(cat)"
                      class="p-1 rounded text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Delete Category">
                      <span class="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                }

                @if (categories().length === 0) {
                  <div class="p-4 text-center text-on-surface-variant text-xs">
                    No categories created yet.
                  </div>
                }
              </div>
            </div>

            <div class="flex justify-end pt-2 border-t border-outline-variant/20">
              <button 
                type="button" 
                (click)="showCategoryModal.set(false)"
                class="px-4 py-2 bg-surface-container-high font-semibold text-on-surface rounded-lg hover:bg-surface-variant cursor-pointer text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class TrainerBlogsComponent implements OnInit {
  private blogService = inject(BlogService);
  private blogCategoryService = inject(BlogCategoryService);
  private uploadService = inject(UploadService);
  public authService = inject(AuthService);

  posts = signal<BlogPost[]>([]);
  categories = signal<BlogCategory[]>([]);
  isLoading = signal<boolean>(true);
  isWriting = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  isUploadingImage = signal<boolean>(false);
  errorMessage = signal<string>('');
  editingPostId = signal<string | null>(null);

  // Category management modal
  showCategoryModal = signal<boolean>(false);
  newCategoryName = signal<string>('');
  newCategorySlug = signal<string>('');
  newCategoryDescription = signal<string>('');
  isSavingCategory = signal<boolean>(false);
  categoryError = signal<string>('');
  categorySuccess = signal<string>('');

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
  selectedCategoryFilter = signal<string>('');
  selectedFilter = signal<'all' | 'published' | 'draft'>('all');

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

  publishedCount = computed(() => this.posts().filter(p => p.isPublished).length);
  draftCount = computed(() => this.posts().filter(p => !p.isPublished).length);

  filteredPosts = computed(() => {
    let list = this.posts();
    const q = this.searchQuery().trim().toLowerCase();
    const filter = this.selectedFilter();
    const catFilter = this.selectedCategoryFilter().trim().toLowerCase();

    if (filter === 'published') {
      list = list.filter(p => p.isPublished);
    } else if (filter === 'draft') {
      list = list.filter(p => !p.isPublished);
    }

    if (catFilter) {
      list = list.filter(p => (p.category || '').toLowerCase() === catFilter);
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
        this.categories.set(cats || []);
      },
      error: () => {
        this.categories.set([]);
      }
    });
  }

  onNewCategoryNameChange(name: string): void {
    this.newCategoryName.set(name);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    this.newCategorySlug.set(slug);
  }

  handleCreateCategory(): void {
    const name = this.newCategoryName().trim();
    const slug = this.newCategorySlug().trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!name) {
      this.categoryError.set('Please provide a category name.');
      return;
    }

    this.isSavingCategory.set(true);
    this.categoryError.set('');
    this.categorySuccess.set('');

    const payload = {
      name,
      slug,
      description: this.newCategoryDescription().trim() || undefined
    };

    this.blogCategoryService.createCategory(payload).subscribe({
      next: (res: any) => {
        this.isSavingCategory.set(false);
        this.categorySuccess.set(`Category "${name}" created successfully!`);
        this.newCategoryName.set('');
        this.newCategorySlug.set('');
        this.newCategoryDescription.set('');
        this.loadCategories();
        const createdId = res?.data?.id || res?.id;
        if (createdId) {
          this.selectedCategoryId.set(createdId);
        }
      },
      error: (err: any) => {
        this.isSavingCategory.set(false);
        this.categoryError.set(err?.error?.message || 'Failed to create category.');
      }
    });
  }

  deleteCategory(cat: BlogCategory): void {
    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    this.blogCategoryService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.categories.update(list => list.filter(c => c.id !== cat.id));
        if (this.selectedCategoryId() === cat.id) {
          this.selectedCategoryId.set('');
        }
      },
      error: (err) => {
        alert(err?.error?.message || 'Failed to delete category');
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

    const foundCat = this.categories().find(c => c.name.toLowerCase() === (post.category || '').toLowerCase() || c.id === post.category);
    this.selectedCategoryId.set(foundCat ? foundCat.id : '');

    this.errorMessage.set('');
    this.isWriting.set(true);

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
