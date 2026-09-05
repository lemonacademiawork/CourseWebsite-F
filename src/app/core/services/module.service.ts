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
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/modules */
  createModule(courseId: string, payload: CreateModulePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/modules`, payload);
  }

  /** PATCH /api/v1/courses/:courseId/modules/:moduleId */
  updateModule(courseId: string, moduleId: string, payload: UpdateModulePayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}`, payload);
  }

  /** DELETE /api/v1/courses/:courseId/modules/:moduleId */
  deleteModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}`);
  }

  /** PATCH /api/v1/courses/:courseId/modules/:moduleId/publish */
  togglePublishModule(courseId: string, moduleId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/modules/${moduleId}/publish`, {});
  }

  /** PATCH /api/v1/courses/:courseId/modules/reorder */
  reorderModules(courseId: string, moduleIds: string[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/modules/reorder`, { moduleIds });
  }
}

