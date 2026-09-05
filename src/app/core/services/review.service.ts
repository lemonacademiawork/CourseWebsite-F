import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, CourseReviewsResponse, CreateReviewPayload, UpdateReviewPayload } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses/:courseId/reviews — Get all published reviews & statistics for a course */
  getCourseReviews(courseId: string, page: number = 1, limit: number = 10): Observable<CourseReviewsResponse> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/reviews`, { params }).pipe(
      map(res => {
        const data = res.data || res;
        return {
          reviews: Array.isArray(data.reviews) ? data.reviews : (Array.isArray(data) ? data : []),
          stats: data.stats || {
            averageRating: data.averageRating || 5.0,
            totalReviews: data.totalReviews || (Array.isArray(data) ? data.length : 0)
          },
          total: data.total || (Array.isArray(data) ? data.length : 0)
        };
      }),
      catchError(() => of({ reviews: [], stats: { averageRating: 5.0, totalReviews: 0 }, total: 0 }))
    );
  }

  /** POST /api/v1/courses/:courseId/reviews — Submit review for enrolled course */
  submitCourseReview(courseId: string, payload: { rating: number; title?: string; comment: string }): Observable<Review> {
    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/reviews`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/courses/:courseId/reviews/my-review — Get current student's review for course */
  getMyCourseReview(courseId: string): Observable<Review | null> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/reviews/my-review`).pipe(
      map(res => res.data || res || null),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/reviews — Get all reviews (Admin list with filters) */
  getAllReviews(filters?: {
    search?: string;
    courseId?: string;
    rating?: number;
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }): Observable<{ reviews: Review[]; total: number }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.courseId) params = params.set('courseId', filters.courseId);
      if (filters.rating) params = params.set('rating', filters.rating.toString());
      if (filters.isPublished !== undefined) params = params.set('isPublished', filters.isPublished.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/reviews`, { params }).pipe(
      map(res => {
        const data = res.data || res;
        const reviews = Array.isArray(data.reviews) ? data.reviews : (Array.isArray(data) ? data : []);
        return {
          reviews,
          total: data.total || reviews.length
        };
      }),
      catchError(() => of({ reviews: [], total: 0 }))
    );
  }

  /** POST /api/v1/reviews — Create review */
  createReview(payload: CreateReviewPayload): Observable<Review> {
    return this.http.post<any>(`${this.apiUrl}/reviews`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/reviews/:id — Get review by ID */
  getReviewById(id: string): Observable<Review> {
    return this.http.get<any>(`${this.apiUrl}/reviews/${id}`).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/reviews/:id — Update review */
  updateReview(id: string, payload: UpdateReviewPayload): Observable<Review> {
    return this.http.patch<any>(`${this.apiUrl}/reviews/${id}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/reviews/:id — Delete review */
  deleteReview(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/reviews/${id}`);
  }

  /** PATCH /api/v1/reviews/:id/publish — Toggle or set review publication status */
  togglePublishReview(id: string, isPublished?: boolean): Observable<Review> {
    const body = isPublished !== undefined ? { isPublished } : {};
    return this.http.patch<any>(`${this.apiUrl}/reviews/${id}/publish`, body).pipe(
      map(res => res.data || res)
    );
  }
}
