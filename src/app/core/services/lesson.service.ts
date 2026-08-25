import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Lesson, CreateLessonPayload, UpdateLessonPayload } from '../models/lesson.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  /** GET /api/v1/modules/:moduleId/lessons */
  getLessons(moduleId: string): Observable<Lesson[]> {
    return this.http.get<any>(`${this.apiUrl}/modules/${moduleId}/lessons`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/modules/:moduleId/lessons */
  createLesson(moduleId: string, payload: CreateLessonPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/modules/${moduleId}/lessons`, payload);
  }

  /** PATCH /api/v1/modules/:moduleId/lessons/:lessonId */
  updateLesson(moduleId: string, lessonId: string, payload: UpdateLessonPayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}`, payload);
  }

  /** DELETE /api/v1/modules/:moduleId/lessons/:lessonId */
  deleteLesson(moduleId: string, lessonId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}`);
  }

  /** PATCH /api/v1/modules/:moduleId/lessons/:lessonId/publish */
  togglePublishLesson(moduleId: string, lessonId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/modules/${moduleId}/lessons/${lessonId}/publish`, {});
  }
}
