import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BlogCategory, CreateBlogCategoryPayload, UpdateBlogCategoryPayload } from '../models/blog-category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogCategoryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/blog-categories — Get all blog categories */
  getCategories(): Observable<BlogCategory[]> {
    return this.http.get<any>(`${this.apiUrl}/blog-categories`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/blog-categories/:id — Get blog category by ID */
  getCategory(id: string): Observable<BlogCategory | null> {
    return this.http.get<any>(`${this.apiUrl}/blog-categories/${id}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/blog-categories — Create a blog category */
  createCategory(payload: CreateBlogCategoryPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/blog-categories`, payload);
  }

  /** PATCH /api/v1/blog-categories/:id — Update a blog category */
  updateCategory(id: string, payload: UpdateBlogCategoryPayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/blog-categories/${id}`, payload);
  }

  /** DELETE /api/v1/blog-categories/:id — Delete a blog category */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blog-categories/${id}`);
  }
}
