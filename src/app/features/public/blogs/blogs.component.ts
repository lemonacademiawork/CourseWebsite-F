import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { BlogPost } from '../../../core/models/common.model';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './blogs.component.html'
})
export class BlogsComponent implements OnInit {
  categories = ["All Stories", "Crafting Tips", "Materials Guide", "Artisan Spotlight", "Community"];
  posts = signal<BlogPost[]>([]);
  selectedCategory = signal<string>("All Stories");
  searchQuery = signal<string>("");
  isLoading = signal<boolean>(true);

  constructor(private blogService: BlogService) {}

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe(blogs => {
      this.posts.set(blogs);
      this.isLoading.set(false);
    });
  }

  get filteredPosts(): BlogPost[] {
    const q = this.searchQuery().toLowerCase();
    const cat = this.selectedCategory();

    return this.posts().filter(post => {
      const matchesCategory = cat === "All Stories" || post.category === cat;
      const matchesSearch = post.title.toLowerCase().includes(q) ||
        (post.excerpt || '').toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }

  get featuredPost(): BlogPost | null {
    const posts = this.posts();
    return posts.length > 0 ? posts[0] : null;
  }

  selectCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }
}
