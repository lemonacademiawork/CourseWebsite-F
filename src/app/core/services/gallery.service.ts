import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminGalleryItem } from '../models/admin.model';
import { TrainerGallerySubmission } from '../models/trainer.model';

export interface CreateGalleryPayload {
  title: string;
  imageUrl: string;
  studentName?: string;
  courseTitle?: string;
  category?: string;
  description?: string;
  tags?: string[];
}

export interface ModerateGalleryPayload {
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  adminFeedback?: string;
  isFeatured?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/gallery — Get approved public gallery items */
  getPublicGallery(): Observable<AdminGalleryItem[]> {
    return this.http.get<any>(`${this.apiUrl}/gallery`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.items || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/admin/gallery — Admin fetch all items with optional filters */
  getAdminGallery(params?: { status?: string; isFeatured?: boolean; courseId?: string; page?: number; limit?: number }): Observable<AdminGalleryItem[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.isFeatured !== undefined) httpParams = httpParams.set('isFeatured', String(params.isFeatured));
      if (params.courseId) httpParams = httpParams.set('courseId', params.courseId);
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this.http.get<any>(`${this.apiUrl}/gallery`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.items || [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/gallery — Submit a new artwork to gallery (starts as PENDING for admin approval) */
  submitGalleryItem(payload: CreateGalleryPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/gallery`, payload);
  }

  /** PATCH /api/v1/gallery/:id/moderate — Admin approve / reject / feature gallery item */
  moderateGalleryItem(id: string, payload: ModerateGalleryPayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/gallery/${id}/moderate`, payload);
  }

  /** DELETE /api/v1/gallery/:id — Delete gallery item */
  deleteGalleryItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gallery/${id}`);
  }

  /** GET /api/v1/gallery/my — Get all gallery submissions created by the logged-in student */
  getMyGallerySubmissions(): Observable<AdminGalleryItem[]> {
    return this.http.get<any>(`${this.apiUrl}/gallery/my`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.items || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/courses/:courseId/gallery — Get approved student gallery submissions for a specific course */
  getCourseGallery(courseId: string): Observable<AdminGalleryItem[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/gallery`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.items || [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/gallery — Submit project to gallery for a specific course */
  submitCourseGallery(courseId: string, payload: CreateGalleryPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/gallery`, payload);
  }

  /** GET /api/v1/gallery-submissions — Trainer submissions and student works */
  getTrainerGallerySubmissions(): Observable<TrainerGallerySubmission[]> {
    return this.http.get<any>(`${this.apiUrl}/gallery-submissions`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** PATCH /api/v1/gallery-submissions/:id/feedback — Trainer giving mentoring feedback */
  giveGalleryFeedback(id: string, feedback: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/gallery-submissions/${id}/feedback`, { feedback });
  }
}

