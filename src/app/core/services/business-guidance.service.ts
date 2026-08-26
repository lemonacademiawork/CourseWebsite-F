import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { BusinessGuidance, CreateBusinessGuidancePayload, UpdateBusinessGuidancePayload } from '../models/business-guidance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusinessGuidanceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses/:courseId/business-guidance */
  getGuidance(courseId: string): Observable<BusinessGuidance[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/business-guidance`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/business-guidance */
  createGuidance(courseId: string, payload: CreateBusinessGuidancePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/business-guidance`, payload);
  }

  /** PATCH /api/v1/courses/:courseId/business-guidance/:guidanceId */
  updateGuidance(courseId: string, guidanceId: string, payload: UpdateBusinessGuidancePayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/business-guidance/${guidanceId}`, payload);
  }

  /** DELETE /api/v1/courses/:courseId/business-guidance/:guidanceId */
  deleteGuidance(courseId: string, guidanceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/business-guidance/${guidanceId}`);
  }

  /** PATCH /api/v1/courses/:courseId/business-guidance/:guidanceId/publish */
  togglePublishGuidance(courseId: string, guidanceId: string, isPublished: boolean): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/courses/${courseId}/business-guidance/${guidanceId}/publish`,
      { isPublished }
    );
  }
}
