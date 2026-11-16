import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Enrollment, CreateEnrollmentPayload } from '../models/enrollment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/enrollments — Get student's enrollments */
  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<any>(`${this.apiUrl}/enrollments`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/enrollments/my-courses — Get student's enrolled courses */
  getMyCourses(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/enrollments/my-courses`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => this.getEnrollments())
    );
  }

  /** Check enrollment status for course via my-courses */
  checkEnrollment(courseId: string): Observable<{ isEnrolled: boolean; enrollmentId?: string }> {
    return this.getMyCourses().pipe(
      map(enrollments => {
        const found = (Array.isArray(enrollments) ? enrollments : []).find((e: any) =>
          e.courseId === courseId ||
          e.course?.id === courseId ||
          e.course?.slug === courseId ||
          e.id === courseId
        );
        return {
          isEnrolled: !!found,
          enrollmentId: found?.id
        };
      }),
      catchError(() => of({ isEnrolled: false }))
    );
  }

  /** GET /api/v1/enrollments/:enrollmentId — Get enrollment by ID */
  getEnrollment(enrollmentId: string): Observable<Enrollment | null> {
    return this.http.get<any>(`${this.apiUrl}/enrollments/${enrollmentId}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/enrollments — Create an enrollment */
  createEnrollment(payload: CreateEnrollmentPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrollments`, payload);
  }
}
