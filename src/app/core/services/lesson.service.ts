import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, timeout } from 'rxjs';
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
      timeout(10000),
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : (data.lessons || []);
        const mappedList: Lesson[] = list.map((l: any) => this.mapLesson(l, moduleId));
        return mappedList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }),
      catchError(() => of([]))
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
      timeout(15000),
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/modules/:moduleId/lessons/:lessonId */
  updateLesson(moduleId: string, lessonId: string, payload: UpdateLessonPayload): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}`, payload).pipe(
      timeout(15000),
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/modules/:moduleId/lessons/:lessonId */
  deleteLesson(moduleId: string, lessonId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}`).pipe(
      timeout(15000),
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/modules/:moduleId/lessons/:lessonId/publish */
  togglePublishLesson(moduleId: string, lessonId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}/publish`, {}).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/courses/:courseId/lessons/reorder */
  reorderLessons(courseId: string, lessonIds: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/lessons/reorder`, { lessonIds });
  }

  private mapLesson(raw: any, moduleId: string): Lesson {
    return {
      id: raw.id || raw._id || '',
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
}
