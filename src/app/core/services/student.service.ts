import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  StudentDashboardMetrics,
  LessonProgress,
  StudentNotification
} from '../models/student.model';
import { Enrollment } from '../models/enrollment.model';
import { Payment } from '../models/payment.model';
import { Certificate } from '../models/certificate.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students/me`;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/students/me */
  getStudentProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** PATCH /api/v1/students/me */
  updateStudentProfile(payload: { name?: string; phone?: string; avatarUrl?: string; bio?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}`, payload);
  }

  /** GET /api/v1/students/me/enrollments */
  getStudentEnrollments(): Observable<Enrollment[]> {
    return this.http.get<any>(`${this.apiUrl}/enrollments`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/students/me/payments */
  getStudentPayments(): Observable<Payment[]> {
    return this.http.get<any>(`${this.apiUrl}/payments`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/students/me/dashboard */
  getStudentDashboard(): Observable<StudentDashboardMetrics | null> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/students/me/progress */
  getStudentProgress(): Observable<LessonProgress[]> {
    return this.http.get<any>(`${this.apiUrl}/progress`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** PATCH /api/v1/students/me/progress/:lessonId */
  updateLessonProgress(lessonId: string, payload: { watchedSeconds?: number; isCompleted?: boolean }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/progress/${lessonId}`, payload);
  }

  /** GET /api/v1/students/me/certificates */
  getStudentCertificates(): Observable<Certificate[]> {
    return this.http.get<any>(`${this.apiUrl}/certificates`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/students/me/notifications */
  getStudentNotifications(): Observable<StudentNotification[]> {
    return this.http.get<any>(`${this.apiUrl}/notifications`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** PATCH /api/v1/students/me/notifications/:notificationId/read */
  markNotificationRead(notificationId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }
}
