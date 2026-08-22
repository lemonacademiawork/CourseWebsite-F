import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogPost } from '../../../core/models/common.model';

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
              <label class="block font-semibold mb-1">Excerpt Summary</label>
              <textarea 
                rows="2"
                placeholder="Brief summary..."
                [ngModel]="excerpt()"
                (ngModelChange)="excerpt.set($event)"
                name="excerpt"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
              ></textarea>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-semibold mb-1">Category</label>
                <select 
                  [ngModel]="category()"
                  (ngModelChange)="category.set($event)"
                  name="category"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs">
                  <option>Crafting Tips</option>
                  <option>Materials Guide</option>
                  <option>Artisan Spotlight</option>
                  <option>Community</option>
                </select>
              </div>
              <div>
                <label class="block font-semibold mb-1">Cover Image URL</label>
                <input 
                  type="url" 
                  [ngModel]="image()"
                  (ngModelChange)="image.set($event)"
                  name="image"
                  class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>
            <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 cursor-pointer">
              Publish Post to Blog
            </button>
          </form>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (post of posts(); track post.id) {
          <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div class="space-y-3">
              <div class="h-36 bg-surface-container-low rounded-lg overflow-hidden relative">
                <img class="w-full h-full object-cover" [src]="post.image" [alt]="post.title" />
                <span class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-container text-on-primary-container">
                  {{ post.category }}
                </span>
              </div>
              <h3 class="font-bold text-sm">{{ post.title }}</h3>
              <p class="text-xs text-on-surface-variant leading-relaxed">{{ post.excerpt }}</p>
            </div>
            <div class="pt-3 border-t border-outline-variant/20 mt-4 flex justify-between items-center text-[11px] text-on-surface-variant">
              <span>{{ post.author }} • {{ post.date }}</span>
              <span>{{ post.readTime }}</span>
            </div>
          </div>
        }
      </div>
    </main>
  `
})
export class AdminBlogsComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  isWriting = signal<boolean>(false);

  title = signal<string>('');
  excerpt = signal<string>('');
  category = signal<string>('Crafting Tips');
  image = signal<string>('https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600');

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('blogs_database');
      if (stored) {
        this.posts.set(JSON.parse(stored));
      } else {
        const defaults: BlogPost[] = [
          {
            id: 1,
            title: "10 Essential Tools for Lippan Art Beginners",
            excerpt: "Discover the must-have tools, mud pastes, and mirrors to start your journey into traditional Lippan Art.",
            category: "Crafting Tips",
            categoryColor: "bg-primary-container text-on-primary-container",
            image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
            date: "Aug 10, 2026",
            author: "Meera Nair",
            readTime: "5 min read"
          },
          {
            id: 2,
            title: "The Alchemy of Resin: Mastering Curing & Micro-bubbles",
            excerpt: "Tired of cloudy finishes? Our master artisan breaks down temperature control and pouring heights.",
            category: "Materials Guide",
            categoryColor: "bg-tertiary-fixed text-on-tertiary-fixed",
            image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600",
            date: "Aug 06, 2026",
            author: "Vikram Sharma",
            readTime: "7 min read"
          }
        ];
        this.posts.set(defaults);
        localStorage.setItem('blogs_database', JSON.stringify(defaults));
      }
    }
  }

  handlePublish(): void {
    if (!this.title().trim() || !this.excerpt().trim()) return;

    const newPost: BlogPost = {
      id: Date.now(),
      title: this.title(),
      excerpt: this.excerpt(),
      category: this.category(),
      categoryColor: 'bg-primary-container text-on-primary-container',
      image: this.image(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      author: 'Admin User',
      readTime: '4 min read'
    };

    const updated = [newPost, ...this.posts()];
    this.posts.set(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blogs_database', JSON.stringify(updated));
    }
    this.isWriting.set(false);
    this.title.set('');
    this.excerpt.set('');
  }
}
