import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CourseReview, Review, CourseReviewsResponse, CreateReviewPayload, UpdateReviewPayload } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** 
   * 1. GET /courses/:courseId/reviews (Public)
   * Fetches all published reviews for a course along with rating metrics (average rating, total count, and 1-5 star distribution).
   */
  getCourseReviews(courseId: string, page: number = 1, limit: number = 10, rating?: number): Observable<CourseReviewsResponse> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (rating) {
      params = params.set('rating', rating.toString());
    }

    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/reviews`, { params }).pipe(
      map(res => {
        const data = res?.data || res;
        const reviews: CourseReview[] = Array.isArray(data?.reviews) ? data.reviews : (Array.isArray(data) ? data : []);
        const stats = data?.stats || {
          totalReviews: data?.totalReviews || reviews.length,
          averageRating: data?.averageRating || 5.0,
          breakdown: data?.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: reviews.length }
        };
        const pagination = data?.pagination || {
          total: data?.total || reviews.length,
          page: page,
          limit: limit,
          totalPages: Math.ceil((data?.total || reviews.length) / limit) || 1
        };

        return {
          course: data?.course,
          stats,
          reviews,
          pagination,
          total: pagination.total
        };
      }),
      catchError(() => of({
        reviews: [],
        stats: { totalReviews: 0, averageRating: 5.0, breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } },
        pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
        total: 0
      }))
    );
  }

  /**
   * 2. POST /courses/:courseId/reviews (Enrolled Student)
   * Submit a review rating (1-5) and comment for an enrolled course.
   */
  submitCourseReview(courseId: string, payload: CreateReviewPayload): Observable<CourseReview> {
    return this.http.post<any>(`${this.apiUrl}/courses/${courseId}/reviews`, payload).pipe(
      map(res => res?.data || res)
    );
  }

  /**
   * 3. GET /courses/:courseId/reviews/my-review (Enrolled Student)
   * Checks if the currently logged-in student has already reviewed this course.
   */
  getMyCourseReview(courseId: string): Observable<CourseReview | null> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/reviews/my-review`).pipe(
      map(res => res?.data ?? res ?? null),
      catchError(() => of(null))
    );
  }

  /**
   * 4. PATCH /reviews/:id (Review Author / Admin)
   * Allows a student or Admin to update rating or comment.
   */
  updateReview(id: string, payload: UpdateReviewPayload): Observable<CourseReview> {
    return this.http.patch<any>(`${this.apiUrl}/reviews/${id}`, payload).pipe(
      map(res => res?.data || res)
    );
  }

  /**
   * 5. DELETE /reviews/:id (Review Author / Admin)
   * Delete review.
   */
  deleteReview(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reviews/${id}`).pipe(
      map(res => res?.data || res)
    );
  }

  /**
   * 6. GET /reviews (Admin Only)
   * Get all reviews with filters (courseId, rating, search, isPublished, page, limit).
   */
  getAllReviews(filters?: {
    courseId?: string;
    rating?: number;
    search?: string;
    isPublished?: boolean;
    page?: number;
    limit?: number;
  }): Observable<{ reviews: CourseReview[]; total: number; pagination?: any }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
      if (filters.courseId) params = params.set('courseId', filters.courseId);
      if (filters.rating) params = params.set('rating', filters.rating.toString());
      if (filters.isPublished !== undefined) params = params.set('isPublished', filters.isPublished.toString());
      if (filters.search) params = params.set('search', filters.search);
    }

    return this.http.get<any>(`${this.apiUrl}/reviews`, { params }).pipe(
      map(res => {
        const data = res?.data || res;
        const reviews: CourseReview[] = Array.isArray(data?.reviews) ? data.reviews : (Array.isArray(data) ? data : []);
        const total = data?.pagination?.total || data?.total || reviews.length;
        return {
          reviews,
          total,
          pagination: data?.pagination
        };
      }),
      catchError(() => of({ reviews: [], total: 0 }))
    );
  }

  /**
   * 7. PATCH /reviews/:id/publish (Admin Only)
   * Publish or unpublish a review.
   */
  togglePublishReview(id: string, isPublished: boolean): Observable<CourseReview> {
    return this.http.patch<any>(`${this.apiUrl}/reviews/${id}/publish`, { isPublished }).pipe(
      map(res => res?.data || res)
    );
  }
}
