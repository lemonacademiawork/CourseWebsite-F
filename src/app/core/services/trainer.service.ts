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

  /** GET /api/v1/trainers — List all instructor profiles */
  getTrainers(): Observable<any[]> {
    const defaultTrainers = [
      { id: 'trainer-1', name: 'Shivani', email: 'lemonacademiawork@gmail.com', expertise: 'Lippan Mirror Art & Traditional Crafts' },
      { id: 'trainer-2', name: 'Manishi Nigam', email: 'manishi@lemonacademia.com', expertise: 'Botanical Candle & Resin Arts' },
      { id: 'trainer-3', name: 'Artisan Studio Master', email: 'trainer@lemonacademia.com', expertise: 'Pottery, Mosaic & Fiber Arts' }
    ];

    return this.http.get<any>(`${environment.apiUrl}/admin/users?role=TRAINER`).pipe(
      map(res => {
        const raw = res.data || res;
        const list = Array.isArray(raw) ? raw : (raw.users || raw.trainers || []);
        if (list.length > 0) {
          return list.map((t: any) => ({
            id: t.id || t._id || '',
            name: t.name || t.fullName || t.user?.name || 'Artisan Trainer',
            email: t.email || t.user?.email || '',
            expertise: t.expertise || t.bio || 'Studio Master'
          }));
        }
        return defaultTrainers;
      }),
      catchError(() => {
        return this.http.get<any>(`${environment.apiUrl}/users?role=TRAINER`).pipe(
          map(res => {
            const raw = res.data || res;
            const list = Array.isArray(raw) ? raw : (raw.users || []);
            if (list.length > 0) {
              return list.map((t: any) => ({
                id: t.id || t._id || '',
                name: t.name || t.fullName || 'Artisan Trainer',
                email: t.email || '',
                expertise: t.expertise || 'Studio Master'
              }));
            }
            return defaultTrainers;
          }),
          catchError(() => of(defaultTrainers))
        );
      })
    );
  }

  /** GET /api/v1/trainers/:id — Get instructor public bio and published courses */
  getTrainer(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/trainers/${id}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

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

  /** GET /api/v1/trainers/dashboard — Instructor dashboard (Total students, revenue, course ratings) */
  getTrainerDashboard(): Observable<TrainerDashboardMetrics | null> {
    return this.http.get<any>(`${environment.apiUrl}/trainers/dashboard`).pipe(
      map(res => res.data || res),
      catchError(() => this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
        map(res => res.data || res),
        catchError(() => of(null))
      ))
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
