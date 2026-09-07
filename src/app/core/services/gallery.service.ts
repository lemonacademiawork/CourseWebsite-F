import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminGalleryItem } from '../models/admin.model';
import { TrainerGallerySubmission } from '../models/trainer.model';

export interface CreateGalleryPayload {
  courseId?: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  mediaType?: string;
  imageUrl?: string;
  studentName?: string;
  courseTitle?: string;
  category?: string;
  tags?: string[];
}

export interface ModerateGalleryPayload {
  status: 'APPROVED' | 'REJECTED' | 'PENDING';
  adminFeedback?: string;
  isFeatured?: boolean;
}

const FALLBACK_ARTISAN_IMAGE = 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80';

export function normalizeGalleryItem(item: any): AdminGalleryItem {
  if (!item) return item;
  const img = item.mediaUrl || item.imageUrl || item.image || item.media_url || item.url || item.fileUrl || FALLBACK_ARTISAN_IMAGE;
  const sName = item.studentName || (item.student ? (item.student.name || item.student.fullName) : '') || (item.user ? (item.user.name || item.user.fullName) : '') || item.authorName || 'Artisan Maker';
  const cTitle = item.courseTitle || (item.course ? item.course.title : '') || 'Artisan Workshop';
  const cat = item.category || (item.course ? item.course.category : '') || 'Handcrafted Art';

  return {
    ...item,
    id: item.id || item._id || String(Math.random()),
    title: item.title || 'Untitled Creation',
    imageUrl: img,
    mediaUrl: img,
    studentName: sName,
    courseTitle: cTitle,
    category: cat,
    status: item.status || 'APPROVED'
  };
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/gallery — Get public approved student gallery submissions */
  getPublicGallery(params?: { courseId?: string; isFeatured?: boolean; page?: number; limit?: number }): Observable<AdminGalleryItem[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.courseId) httpParams = httpParams.set('courseId', params.courseId);
      if (params.isFeatured !== undefined) httpParams = httpParams.set('isFeatured', String(params.isFeatured));
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this.http.get<any>(`${this.apiUrl}/gallery`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.items || data.submissions || [];
        return list.map(normalizeGalleryItem);
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/gallery/admin/submissions — Get all gallery submissions for moderation (Admin) */
  getAdminGallery(params?: { status?: string; isFeatured?: boolean; courseId?: string; page?: number; limit?: number }): Observable<AdminGalleryItem[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.status && params.status !== 'all') httpParams = httpParams.set('status', params.status);
      if (params.courseId) httpParams = httpParams.set('courseId', params.courseId);
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this.http.get<any>(`${this.apiUrl}/gallery/admin/submissions`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.items || data.submissions || [];
        return list.map(normalizeGalleryItem);
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/gallery — Submit a project or artwork to the gallery */
  submitGalleryItem(payload: CreateGalleryPayload): Observable<any> {
    const body = {
      courseId: payload.courseId,
      title: payload.title,
      description: payload.description || '',
      mediaUrl: payload.mediaUrl || payload.imageUrl || '',
      mediaType: payload.mediaType || 'IMAGE'
    };
    return this.http.post(`${this.apiUrl}/gallery`, body);
  }

  /** PATCH /api/v1/gallery/:id/moderate — Moderate gallery submission (Approve/Reject/Feature) */
  moderateGalleryItem(id: string, payload: ModerateGalleryPayload): Observable<any> {
    const body: any = {};
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.isFeatured !== undefined) body.isFeatured = payload.isFeatured;
    if (payload.adminFeedback !== undefined) body.adminFeedback = payload.adminFeedback;
    return this.http.patch(`${this.apiUrl}/gallery/${id}/moderate`, body);
  }

  /** DELETE /api/v1/gallery/:id — Delete gallery submission (Author student or Admin) */
  deleteGalleryItem(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/gallery/${id}`);
  }

  /** GET /api/v1/gallery/my — Get all gallery submissions created by the logged-in student */
  getMyGallerySubmissions(): Observable<AdminGalleryItem[]> {
    return this.http.get<any>(`${this.apiUrl}/gallery/my`).pipe(
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.items || [];
        return list.map(normalizeGalleryItem);
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/courses/:courseId/gallery — Get approved student gallery submissions for a specific course */
  getCourseGallery(courseId: string): Observable<AdminGalleryItem[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/gallery`).pipe(
      map(res => {
        const data = res.data || res;
        const list = Array.isArray(data) ? data : data.items || [];
        return list.map(normalizeGalleryItem);
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

