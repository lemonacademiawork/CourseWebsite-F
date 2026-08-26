import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost } from '../../../core/models/common.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (isLoading()) {
      <main class="min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-12 max-w-3xl mx-auto text-xs text-on-surface">
        <div class="animate-pulse space-y-6">
          <div class="h-4 bg-surface-container-high rounded w-24"></div>
          <div class="space-y-3">
            <div class="h-5 bg-surface-container-high rounded w-20"></div>
            <div class="h-8 bg-surface-container-high rounded w-3/4"></div>
            <div class="h-3 bg-surface-container-high rounded w-1/3"></div>
          </div>
          <div class="w-full aspect-[16/9] bg-surface-container-high rounded-xl"></div>
          <div class="space-y-3">
            <div class="h-3 bg-surface-container-high rounded w-full"></div>
            <div class="h-3 bg-surface-container-high rounded w-full"></div>
            <div class="h-3 bg-surface-container-high rounded w-2/3"></div>
          </div>
        </div>
      </main>
    } @else if (post()) {
      <main class="min-h-screen bg-surface px-margin-mobile md:px-margin-desktop py-12 max-w-3xl mx-auto text-xs text-on-surface">
        <div class="mb-6">
          <a routerLink="/blogs" class="text-primary hover:underline font-semibold flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Blogs
          </a>
        </div>

        <article class="space-y-6">
          <header class="space-y-3">
            @if (post()!.categoryColor) {
              <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider {{ post()!.categoryColor }}">
                {{ post()!.category }}
              </span>
            } @else {
              <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-container text-on-primary-container">
                {{ post()!.category }}
              </span>
            }
            <h1 class="playfair text-2xl md:text-3xl font-extrabold text-on-surface leading-tight">
              {{ post()!.title }}
            </h1>
            <div class="flex gap-4 text-on-surface-variant text-[11px] font-medium">
              <span>By {{ post()!.author }}</span>
              <span>•</span>
              <span>{{ post()!.date }}</span>
              <span>•</span>
              <span>{{ post()!.readTime }}</span>
            </div>
          </header>

          @if (post()!.image || post()!.imageUrl) {
            <div class="w-full aspect-[16/9] rounded-xl overflow-hidden border bg-surface-container mb-6">
              <img [src]="post()!.image || post()!.imageUrl" class="w-full h-full object-cover" [alt]="post()!.title" />
            </div>
          }

          <div class="prose text-xs text-on-surface-variant leading-relaxed whitespace-pre-line space-y-4">
            {{ post()!.content }}
          </div>

          @if (post()!.tags && post()!.tags!.length > 0) {
            <div class="flex flex-wrap gap-2 pt-4 border-t border-outline/10">
              @for (tag of post()!.tags!; track tag) {
                <span class="px-3 py-1 rounded-full text-[10px] font-semibold bg-surface-container-low text-on-surface-variant">
                  #{{ tag }}
                </span>
              }
            </div>
          }
        </article>
      </main>
    } @else {
      <div class="min-h-screen flex flex-col items-center justify-center text-xs text-on-surface-variant gap-3">
        <span class="material-symbols-outlined text-4xl text-outline">article</span>
        <p>Blog post not found.</p>
        <a routerLink="/blogs" class="text-primary hover:underline font-semibold">
          ← Back to all articles
        </a>
      </div>
    }
  `
})
export class BlogDetailComponent implements OnInit {
  @Input() id!: string;
  post = signal<BlogPost | null>(null);
  isLoading = signal<boolean>(true);

  constructor(private route: ActivatedRoute, private blogService: BlogService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const blogId = params.get('id') || '';
      if (blogId) {
        this.isLoading.set(true);
        this.blogService.getBlog(blogId).subscribe(blog => {
          this.post.set(blog);
          this.isLoading.set(false);
        });
      } else {
        this.isLoading.set(false);
      }
    });
  }
}
