import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BlogPost } from '../models/common.model';

export interface CreateBlogPayload {
  title: string;
  slug: string;
  content: string;
  categoryId?: string;
  featuredImageUrl?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateBlogPayload {
  title?: string;
  slug?: string;
  content?: string;
  categoryId?: string;
  featuredImageUrl?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  /** GET /api/v1/blogs — Get all published blogs */
  getBlogs(): Observable<BlogPost[]> {
    return this.http.get<any>(`${this.apiUrl}/blogs`).pipe(
      map(res => {
        const blogList = res.data || res;
        if (Array.isArray(blogList)) {
          return blogList.map((b: any) => this.mapBlog(b));
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/blogs/:id — Get blog by ID */
  getBlog(id: string): Observable<BlogPost | null> {
    return this.http.get<any>(`${this.apiUrl}/blogs/${id}`).pipe(
      map(res => {
        const b = res.data || res;
        if (b && (b.id || b._id)) {
          return this.mapBlog(b);
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/blogs — Create a new blog */
  createBlog(payload: CreateBlogPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/blogs`, payload);
  }

  /** PATCH /api/v1/blogs/:id — Update a blog */
  updateBlog(id: string, payload: UpdateBlogPayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/blogs/${id}`, payload);
  }

  /** DELETE /api/v1/blogs/:id — Delete a blog */
  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blogs/${id}`);
  }

  /** PATCH /api/v1/blogs/:id/publish — Toggle publish status */
  togglePublish(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/blogs/${id}/publish`, {});
  }

  /** Map raw API blog object to BlogPost interface */
  private mapBlog(b: any): BlogPost {
    const category = b.category?.name || b.category || 'General';
    return {
      id: b.id || b._id || '',
      title: b.title || 'Untitled',
      summary: b.summary || b.excerpt || '',
      excerpt: b.excerpt || b.summary || b.seoDescription || '',
      content: b.content || '',
      category: category,
      categoryColor: this.getCategoryColor(category),
      author: b.author?.name || b.author || 'Lemon Academy',
      date: b.publishedAt || b.createdAt
        ? new Date(b.publishedAt || b.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : '',
      imageUrl: b.featuredImageUrl || b.imageUrl || '',
      image: b.featuredImageUrl || b.imageUrl || b.image || '',
      readTime: b.readTime || this.estimateReadTime(b.content || ''),
      slug: b.slug || '',
      tags: b.tags || [],
      isPublished: b.isPublished ?? false,
      createdAt: b.createdAt || '',
      updatedAt: b.updatedAt || ''
    };
  }

  /** Generate a category color class string based on category name */
  private getCategoryColor(category: string): string {
    const map: Record<string, string> = {
      'Crafting Tips': 'bg-primary-container text-on-primary-container',
      'Materials Guide': 'bg-tertiary-fixed text-on-tertiary-fixed',
      'Artisan Spotlight': 'bg-secondary-fixed text-on-secondary-fixed',
      'Community': 'bg-surface-variant text-on-surface-variant'
    };
    return map[category] || 'bg-primary-container text-on-primary-container';
  }

  /** Estimate read time based on word count */
  private estimateReadTime(content: string): string {
    if (!content) return '3 min read';
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }
}
