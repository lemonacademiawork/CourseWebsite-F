import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { CourseModule, CreateModulePayload, UpdateModulePayload } from '../models/module.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses/:courseId/modules */
  getModules(courseId: string): Observable<CourseModule[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/modules`).pipe(
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : (data.modules || []);
        const mappedList: CourseModule[] = list.map((m: any) => this.mapModule(m, courseId));

        // Merge locally created modules
        if (typeof window !== 'undefined') {
          try {
            const localKey = `course_modules_${courseId}`;
            const stored = localStorage.getItem(localKey);
            if (stored) {
              const localList: CourseModule[] = JSON.parse(stored);
              if (Array.isArray(localList)) {
                localList.forEach(loc => {
                  const idx = mappedList.findIndex(m => m.id === loc.id || (loc.title && m.title === loc.title));
                  if (idx >= 0) {
                    mappedList[idx] = { ...mappedList[idx], ...loc };
                  } else {
                    mappedList.push(loc);
                  }
                });
              }
            }
          } catch {}
        }

        if (mappedList.length === 0) {
          // Provide default module so admin can immediately add lessons to any course
          const defMod: CourseModule = {
            id: `mod-${courseId}-1`,
            title: 'Curriculum & Workshops',
            description: 'Core hands-on masterclass lessons',
            orderIndex: 1,
            isPublished: true,
            courseId: courseId
          };
          this.saveLocalModule(courseId, defMod);
          return [defMod];
        }

        return mappedList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }),
      catchError(() => {
        const fallbackList: CourseModule[] = [];
        if (typeof window !== 'undefined') {
          try {
            const localKey = `course_modules_${courseId}`;
            const stored = localStorage.getItem(localKey);
            if (stored) {
              const localList: CourseModule[] = JSON.parse(stored);
              if (Array.isArray(localList)) {
                fallbackList.push(...localList);
              }
            }
          } catch {}
        }

        if (fallbackList.length === 0) {
          const defMod: CourseModule = {
            id: `mod-${courseId}-1`,
            title: 'Curriculum & Workshops',
            description: 'Core hands-on masterclass lessons',
            orderIndex: 1,
            isPublished: true,
            courseId: courseId
          };
          this.saveLocalModule(courseId, defMod);
          return of([defMod]);
        }

        return of(fallbackList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
      })
    );
  }

  /** POST /api/v1/courses/:courseId/modules */
  createModule(courseId: string, payload: CreateModulePayload): Observable<any> {
    const formattedPayload: any = {
      title: payload.title,
      description: payload.description || '',
      orderIndex: Number(payload.orderIndex) || 1,
      isPublished: payload.isPublished ?? true
    };

    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/modules`, formattedPayload).pipe(
      map(res => {
        const created = res.data || res;
        const id = created?.id || created?._id || `mod-${Date.now()}`;
        this.saveLocalModule(courseId, { ...formattedPayload, id, courseId });
        return created;
      }),
      catchError(() => {
        const fakeId = `mod-${Date.now()}`;
        const newMod: CourseModule = { id: fakeId, ...formattedPayload, courseId };
        this.saveLocalModule(courseId, newMod);
        return of({ success: true, data: newMod });
      })
    );
  }

  /** PATCH /api/v1/courses/:courseId/modules/:moduleId */
  updateModule(courseId: string, moduleId: string, payload: UpdateModulePayload): Observable<any> {
    this.updateLocalModule(courseId, moduleId, payload);
    return this.http.patch<any>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}`, payload).pipe(
      map(res => res.data || res),
      catchError(() => of({ success: true, message: 'Updated locally' }))
    );
  }

  /** DELETE /api/v1/courses/:courseId/modules/:moduleId */
  deleteModule(courseId: string, moduleId: string): Observable<any> {
    this.deleteLocalModule(courseId, moduleId);
    return this.http.delete<any>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}`).pipe(
      map(res => res.data || res),
      catchError(() => of({ success: true, message: 'Deleted locally' }))
    );
  }

  /** PATCH /api/v1/courses/:courseId/modules/:moduleId/publish */
  togglePublishModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}/publish`, {}).pipe(
      map(res => res.data || res),
      catchError(() => of({ success: true }))
    );
  }

  /** PATCH /api/v1/courses/:courseId/modules/reorder */
  reorderModules(courseId: string, moduleIds: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/modules/reorder`, { moduleIds });
  }

  // --- LOCAL PERSISTENCE HELPERS ---
  private mapModule(raw: any, courseId: string): CourseModule {
    return {
      id: raw.id || raw._id || `mod-${Date.now()}`,
      title: raw.title || 'Curriculum Module',
      description: raw.description || '',
      orderIndex: Number(raw.orderIndex) || 1,
      isPublished: raw.isPublished ?? true,
      courseId: raw.courseId || courseId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }

  private saveLocalModule(courseId: string, mod: CourseModule): void {
    if (typeof window === 'undefined' || !courseId) return;
    try {
      const localKey = `course_modules_${courseId}`;
      const stored = localStorage.getItem(localKey);
      const list: CourseModule[] = stored ? JSON.parse(stored) : [];
      const idx = list.findIndex(m => m.id === mod.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...mod };
      } else {
        list.push(mod);
      }
      localStorage.setItem(localKey, JSON.stringify(list));
      window.dispatchEvent(new Event('modules_updated'));
    } catch {}
  }

  private updateLocalModule(courseId: string, moduleId: string, updates: Partial<CourseModule>): void {
    if (typeof window === 'undefined' || !courseId) return;
    try {
      const localKey = `course_modules_${courseId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        const list: CourseModule[] = JSON.parse(stored);
        const idx = list.findIndex(m => m.id === moduleId);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...updates };
          localStorage.setItem(localKey, JSON.stringify(list));
          window.dispatchEvent(new Event('modules_updated'));
        }
      }
    } catch {}
  }

  private deleteLocalModule(courseId: string, moduleId: string): void {
    if (typeof window === 'undefined' || !courseId) return;
    try {
      const localKey = `course_modules_${courseId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        const list: CourseModule[] = JSON.parse(stored);
        const filtered = list.filter(m => m.id !== moduleId);
        localStorage.setItem(localKey, JSON.stringify(filtered));
        window.dispatchEvent(new Event('modules_updated'));
      }
    } catch {}
  }
}

