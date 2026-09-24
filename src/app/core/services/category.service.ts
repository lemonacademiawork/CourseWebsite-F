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

  private defaultCategories: Category[] = [
    {
      id: 'cat-lippan',
      name: 'Lippan Art',
      slug: 'lippan-art',
      description: 'Traditional Gujarati mud and mirror mural craft workshops.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119'
    },
    {
      id: 'cat-candle',
      name: 'Botanical Candle Making',
      slug: 'candle-making',
      description: 'Soy wax, essential oil aromatherapy and floral embeds.',
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59'
    },
    {
      id: 'cat-resin',
      name: 'Resin Crafts',
      slug: 'resin-crafts',
      description: 'Epoxy resin preservation, coasters, clocks, and geode arts.',
      imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff'
    },
    {
      id: 'cat-mosaic',
      name: 'Mosaic & Glass Art',
      slug: 'mosaic-art',
      description: 'Stained glass, tesserae cutting, and architectural patterns.',
      imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f'
    },
    {
      id: 'cat-crochet',
      name: 'Crochet & Fiber Arts',
      slug: 'crochet-fiber-arts',
      description: 'Macrame, yarn knitting, tapestries, and textile crafts.',
      imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff'
    },
    {
      id: 'cat-soap',
      name: 'Artisan Soap Making',
      slug: 'soap-making',
      description: 'Cold-process and melt-and-pour handcrafted soaps.',
      imageUrl: 'https://images.unsplash.com/photo-1607006314164-946761596700'
    }
  ];

  constructor(private http: HttpClient) {}

  private getLocalCategories(): Category[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('local_categories');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveLocalCategory(category: Category): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getLocalCategories();
      const existingIdx = current.findIndex(c => c.id === category.id || c.slug === category.slug || c.name.toLowerCase() === category.name.toLowerCase());
      if (existingIdx >= 0) {
        current[existingIdx] = category;
      } else {
        current.push(category);
      }
      localStorage.setItem('local_categories', JSON.stringify(current));
    } catch {}
  }

  private mergeCategories(backendList: Category[]): Category[] {
    const map = new Map<string, Category>();

    // 1. Add default craft categories
    for (const cat of this.defaultCategories) {
      map.set(cat.slug || cat.name.toLowerCase(), cat);
    }

    // 2. Add local storage categories
    for (const cat of this.getLocalCategories()) {
      map.set(cat.slug || cat.name.toLowerCase(), cat);
    }

    // 3. Add backend categories (prioritizing backend data)
    for (const cat of backendList) {
      const key = cat.slug || cat.name.toLowerCase();
      map.set(key, { ...map.get(key), ...cat });
    }

    return Array.from(map.values());
  }

  /** GET /api/v1/categories — Get all course categories */
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const list = res.data || res;
        const rawList = Array.isArray(list) ? list : [];
        return this.mergeCategories(rawList);
      }),
      catchError(() => of(this.mergeCategories([])))
    );
  }

  /** POST /api/v1/categories — Create a new course category */
  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const localCat: Category = {
      id: 'cat-' + Date.now(),
      name: payload.name,
      slug: slug,
      description: payload.description || '',
      imageUrl: payload.imageUrl || ''
    };

    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(res => {
        const created = res.data || res || localCat;
        this.saveLocalCategory(created);
        return created;
      }),
      catchError(() => {
        this.saveLocalCategory(localCat);
        return of(localCat);
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
      map(res => res.data || res),
      catchError(() => {
        const updated: Category = {
          id,
          name: payload.name || 'Category',
          slug: payload.slug || id,
          description: payload.description,
          imageUrl: payload.imageUrl
        };
        this.saveLocalCategory(updated);
        return of(updated);
      })
    );
  }

  /** DELETE /api/v1/categories/:id — Delete a course category */
  deleteCategory(id: string): Observable<any> {
    if (typeof window !== 'undefined') {
      try {
        const current = this.getLocalCategories().filter(c => c.id !== id && c.slug !== id);
        localStorage.setItem('local_categories', JSON.stringify(current));
      } catch {}
    }
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of({ success: true }))
    );
  }
}
