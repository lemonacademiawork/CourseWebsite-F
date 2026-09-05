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

  constructor(private http: HttpClient) {}

  /** GET /api/v1/categories — Get all course categories */
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const list = res.data || res;
        return Array.isArray(list) ? list : [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/categories — Create a new course category */
  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/categories/slug/:slug — Get course category by slug */
  getCategoryBySlug(slug: string): Observable<Category | null> {
    return this.http.get<any>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(res => res.data || res || null),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/categories/:id — Get course category by ID */
  getCategoryById(id: string): Observable<Category | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res || null),
      catchError(() => of(null))
    );
  }

  /** PATCH /api/v1/categories/:id — Update a course category */
  updateCategory(id: string, payload: UpdateCategoryPayload): Observable<Category> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/categories/:id — Delete a course category */
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
