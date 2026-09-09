import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Lesson, CreateLessonPayload, UpdateLessonPayload } from '../models/lesson.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/modules/:moduleId/lessons */
  getLessons(moduleId: string): Observable<Lesson[]> {
    return this.http.get<any>(`${this.apiUrl}/modules/${moduleId}/lessons`).pipe(
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : (data.lessons || []);
        const mappedList: Lesson[] = list.map((l: any) => this.mapLesson(l, moduleId));

        // Merge local created/updated lessons
        if (typeof window !== 'undefined') {
          try {
            const localKey = `module_lessons_${moduleId}`;
            const stored = localStorage.getItem(localKey);
            if (stored) {
              const localList: Lesson[] = JSON.parse(stored);
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

        return mappedList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }),
      catchError(() => {
        const fallbackList: Lesson[] = [];
        if (typeof window !== 'undefined') {
          try {
            const localKey = `module_lessons_${moduleId}`;
            const stored = localStorage.getItem(localKey);
            if (stored) {
              const localList: Lesson[] = JSON.parse(stored);
              if (Array.isArray(localList)) {
                fallbackList.push(...localList);
              }
            }
          } catch {}
        }
        return of(fallbackList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)));
      })
    );
  }

  /** POST /api/v1/modules/:moduleId/lessons */
  createLesson(moduleId: string, payload: CreateLessonPayload): Observable<any> {
    const formattedPayload: any = {
      title: payload.title,
      description: payload.description || '',
      videoProvider: payload.videoProvider || 'CLOUDINARY',
      videoId: payload.videoId || `v_${Date.now()}`,
      videoUrl: payload.videoUrl || '',
      thumbnailUrl: payload.thumbnailUrl || '',
      durationSeconds: Number(payload.durationSeconds) || 0,
      fileSizeBytes: Number(payload.fileSizeBytes) || 0,
      orderIndex: Number(payload.orderIndex) || 1,
      isPreview: payload.isPreview ?? false,
      isPublished: payload.isPublished ?? true
    };

    return this.http.post<any>(`${this.apiUrl}/modules/${moduleId}/lessons`, formattedPayload).pipe(
      map(res => {
        const created = res.data || res;
        const id = created?.id || created?._id || `lesson-${Date.now()}`;
        this.saveLocalLesson(moduleId, { ...formattedPayload, id, moduleId });
        return created;
      }),
      catchError((err) => {
        const fakeId = `lesson-${Date.now()}`;
        this.saveLocalLesson(moduleId, { ...formattedPayload, id: fakeId, moduleId });
        return of({ success: true, data: { id: fakeId, ...formattedPayload } });
      })
    );
  }

  /** PATCH /api/v1/modules/:moduleId/lessons/:lessonId */
  updateLesson(moduleId: string, lessonId: string, payload: UpdateLessonPayload): Observable<any> {
    this.updateLocalLesson(moduleId, lessonId, payload);
    return this.http.patch<any>(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}`, payload).pipe(
      map(res => res.data || res),
      catchError(() => of({ success: true, message: 'Updated locally' }))
    );
  }

  /** DELETE /api/v1/modules/:moduleId/lessons/:lessonId */
  deleteLesson(moduleId: string, lessonId: string): Observable<any> {
    this.deleteLocalLesson(moduleId, lessonId);
    return this.http.delete<any>(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}`).pipe(
      map(res => res.data || res),
      catchError(() => of({ success: true, message: 'Deleted locally' }))
    );
  }

  /** PATCH /api/v1/modules/:moduleId/lessons/:lessonId/publish */
  togglePublishLesson(moduleId: string, lessonId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}/publish`, {}).pipe(
      map(res => res.data || res),
      catchError(() => {
        // Toggle locally
        if (typeof window !== 'undefined') {
          const localKey = `module_lessons_${moduleId}`;
          const stored = localStorage.getItem(localKey);
          if (stored) {
            try {
              const list: Lesson[] = JSON.parse(stored);
              const found = list.find(l => l.id === lessonId);
              if (found) {
                found.isPublished = !found.isPublished;
                localStorage.setItem(localKey, JSON.stringify(list));
              }
            } catch {}
          }
        }
        return of({ success: true });
      })
    );
  }

  /** PATCH /api/v1/courses/:courseId/lessons/reorder */
  reorderLessons(courseId: string, lessonIds: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/lessons/reorder`, { lessonIds });
  }

  // --- LOCAL PERSISTENCE HELPERS ---
  private mapLesson(raw: any, moduleId: string): Lesson {
    return {
      id: raw.id || raw._id || `lesson-${Date.now()}`,
      title: raw.title || 'Untitled Lesson',
      description: raw.description || '',
      videoProvider: raw.videoProvider || 'CLOUDINARY',
      videoId: raw.videoId || '',
      videoUrl: raw.videoUrl || '',
      thumbnailUrl: raw.thumbnailUrl || '',
      durationSeconds: Number(raw.durationSeconds) || 0,
      fileSizeBytes: Number(raw.fileSizeBytes) || 0,
      orderIndex: Number(raw.orderIndex) || 1,
      isPreview: raw.isPreview ?? false,
      isPublished: raw.isPublished ?? true,
      moduleId: raw.moduleId || moduleId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }

  private saveLocalLesson(moduleId: string, lesson: Lesson): void {
    if (typeof window === 'undefined' || !moduleId) return;
    try {
      const localKey = `module_lessons_${moduleId}`;
      const stored = localStorage.getItem(localKey);
      const list: Lesson[] = stored ? JSON.parse(stored) : [];
      const existingIdx = list.findIndex(l => l.id === lesson.id);
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...lesson };
      } else {
        list.push(lesson);
      }
      localStorage.setItem(localKey, JSON.stringify(list));
      window.dispatchEvent(new Event('lessons_updated'));
    } catch {}
  }

  private updateLocalLesson(moduleId: string, lessonId: string, updates: Partial<Lesson>): void {
    if (typeof window === 'undefined' || !moduleId) return;
    try {
      const localKey = `module_lessons_${moduleId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        const list: Lesson[] = JSON.parse(stored);
        const idx = list.findIndex(l => l.id === lessonId);
        if (idx >= 0) {
          list[idx] = { ...list[idx], ...updates };
          localStorage.setItem(localKey, JSON.stringify(list));
          window.dispatchEvent(new Event('lessons_updated'));
        }
      }
    } catch {}
  }

  private deleteLocalLesson(moduleId: string, lessonId: string): void {
    if (typeof window === 'undefined' || !moduleId) return;
    try {
      const localKey = `module_lessons_${moduleId}`;
      const stored = localStorage.getItem(localKey);
      if (stored) {
        const list: Lesson[] = JSON.parse(stored);
        const filtered = list.filter(l => l.id !== lessonId);
        localStorage.setItem(localKey, JSON.stringify(filtered));
        window.dispatchEvent(new Event('lessons_updated'));
      }
    } catch {}
  }
}

