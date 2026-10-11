import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) {
    // Purge old mock category cache if present
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('local_categories');
      } catch {}
    }
  }

  /** GET /api/v1/categories — Get all course categories directly from backend */
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const list = res?.data || res;
        const rawList = Array.isArray(list) ? list : [];
        return rawList.map(c => this.mapCategory(c));
      }),
      catchError(err => {
        console.error('Failed to get categories from backend:', err);
        return of([]);
      })
    );
  }

  /** POST /api/v1/categories — Create a new course category */
  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(res => {
        const created = res?.data || res;
        return this.mapCategory(created);
      })
    );
  }

  /** GET /api/v1/categories/slug/:slug — Get course category by slug */
  getCategoryBySlug(slug: string): Observable<Category | null> {
    return this.getCategories().pipe(
      map(list => list.find(c => c.slug === slug || c.id === slug) || null)
    );
  }

  /** GET /api/v1/categories/:id — Get course category by ID */
  getCategoryById(id: string): Observable<Category | null> {
    return this.getCategories().pipe(
      map(list => list.find(c => c.id === id || c.slug === id) || null)
    );
  }

  /** PATCH /api/v1/categories/:id — Update a course category */
  updateCategory(id: string, payload: UpdateCategoryPayload): Observable<Category> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => {
        const updated = res?.data || res;
        return this.mapCategory(updated);
      })
    );
  }

  /** DELETE /api/v1/categories/:id — Delete a course category */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res?.data || res)
    );
  }

  private mapCategory(c: any): Category {
    return {
      id: c.id || c._id || '',
      name: c.name || 'Category',
      slug: c.slug || (c.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: c.description || '',
      imageUrl: c.imageUrl || ''
    };
  }
}
