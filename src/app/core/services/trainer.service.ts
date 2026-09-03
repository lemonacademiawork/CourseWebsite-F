import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  TrainerProfile,
  TrainerDashboardMetrics,
  TrainerStudent,
  TrainerReview,
  TrainerGallerySubmission
} from '../models/trainer.model';
import { Course } from '../models/course.model';
import { BusinessGuidance } from '../models/business-guidance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = `${environment.apiUrl}/trainers/me`;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/trainers/me */
  getTrainerProfile(): Observable<TrainerProfile | null> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** PATCH /api/v1/trainers/me */
  updateTrainerProfile(payload: Partial<TrainerProfile>): Observable<any> {
    return this.http.patch(`${this.apiUrl}`, payload);
  }

  /** GET /api/v1/trainers/me/courses */
  getTrainerCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.apiUrl}/courses`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.courses || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/dashboard */
  getTrainerDashboard(): Observable<TrainerDashboardMetrics | null> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/trainers/me/students */
  getTrainerStudents(): Observable<TrainerStudent[]> {
    return this.http.get<any>(`${this.apiUrl}/students`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.students || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/business-guidance */
  getTrainerBusinessGuidance(): Observable<BusinessGuidance[]> {
    return this.http.get<any>(`${this.apiUrl}/business-guidance`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/reviews */
  getTrainerReviews(): Observable<TrainerReview[]> {
    return this.http.get<any>(`${this.apiUrl}/reviews`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/gallery-submissions */
  getTrainerGallerySubmissions(): Observable<TrainerGallerySubmission[]> {
    return this.http.get<any>(`${this.apiUrl}/gallery-submissions`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** PATCH /api/v1/trainers/me/gallery-submissions/:id/feedback */
  giveGalleryFeedback(id: string, feedback: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/gallery-submissions/${id}/feedback`, { feedback });
  }
}
