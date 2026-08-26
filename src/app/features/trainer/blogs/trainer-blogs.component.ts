import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost } from '../../../core/models/common.model';

@Component({
  selector: 'app-trainer-blogs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Artisan Blog Contributions</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Your published tutorials and crafting articles.</p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="space-y-4">
          @for (i of [1,2]; track i) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm animate-pulse">
              <div class="h-5 bg-surface-container-high rounded w-2/3 mb-3"></div>
              <div class="h-3 bg-surface-container-high rounded w-1/3 mb-3"></div>
              <div class="h-4 bg-surface-container-high rounded w-20"></div>
            </div>
          }
        </div>
      } @else if (posts().length > 0) {
        <div class="space-y-4">
          @for (post of posts(); track post.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-sm">
              <h3 class="font-bold text-sm mb-2">{{ post.title }}</h3>
              <p class="text-xs text-on-surface-variant mb-4">{{ post.date }} • {{ post.readTime }}</p>
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    [class]="post.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                {{ post.isPublished ? 'Published Live' : 'Draft' }}
              </span>
            </div>
          }
        </div>
      } @else {
        <div class="text-center py-12 bg-surface-container-low rounded-2xl space-y-3">
          <span class="material-symbols-outlined text-outline text-4xl">article</span>
          <h3 class="font-bold text-sm text-on-surface">No blog contributions yet</h3>
          <p class="text-xs text-on-surface-variant">Your published articles will appear here.</p>
        </div>
      }
    </main>
  `
})
export class TrainerBlogsComponent implements OnInit {
  posts = signal<BlogPost[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(blogs => {
      this.posts.set(blogs);
      this.isLoading.set(false);
    });
  }
}
