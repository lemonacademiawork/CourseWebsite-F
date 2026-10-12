import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, timeout } from 'rxjs';
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
      timeout(10000),
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : (data.modules || []);
        const mappedList: CourseModule[] = list.map((m: any) => this.mapModule(m, courseId));
        return mappedList.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      }),
      catchError(() => of([]))
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
      timeout(15000),
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/courses/:courseId/modules/:moduleId */
  updateModule(courseId: string, moduleId: string, payload: UpdateModulePayload): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}`, payload).pipe(
      timeout(15000),
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/courses/:courseId/modules/:moduleId */
  deleteModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}`).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/courses/:courseId/modules/:moduleId/publish */
  togglePublishModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}/publish`, {}).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/courses/:courseId/modules/reorder */
  reorderModules(courseId: string, moduleIds: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/modules/reorder`, { moduleIds });
  }

  private mapModule(raw: any, courseId: string): CourseModule {
    return {
      id: raw.id || raw._id || '',
      title: raw.title || 'Curriculum Module',
      description: raw.description || '',
      orderIndex: Number(raw.orderIndex) || 1,
      isPublished: raw.isPublished ?? true,
      courseId: raw.courseId || courseId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    };
  }
}
