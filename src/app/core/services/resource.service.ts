import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../models/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses/:courseId/resources — Get all resources of a course */
  getCourseResources(courseId: string): Observable<Resource[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/resources`).pipe(
      map(res => {
        const list = res.data || res;
        return Array.isArray(list) ? list : [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/resources — Create a resource */
  createResource(courseId: string, payload: CreateResourcePayload): Observable<Resource> {
    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/resources`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/courses/:courseId/resources/:resourceId — Update a resource */
  updateResource(courseId: string, resourceId: string, payload: UpdateResourcePayload): Observable<Resource> {
    return this.http.patch<any>(`${this.apiUrl}/courses/${courseId}/resources/${resourceId}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/courses/:courseId/resources/:resourceId — Delete a resource */
  deleteResource(courseId: string, resourceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/resources/${resourceId}`);
  }
}
