import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  AdminDashboardMetrics,
  AdminUser,
  AdminEnrollment,
  AdminGalleryItem,
  AdminCommission,
  AdminSetting
} from '../models/admin.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/admin/dashboard — normalizes any backend naming convention */
  getDashboard(): Observable<AdminDashboardMetrics | null> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      map(res => {
        const d = res.data || res;
        // Normalize field names from any backend convention
        return {
          totalRevenue: d.totalRevenue ?? d.total_revenue ?? d.revenue ?? 0,
          totalStudents: d.totalStudents ?? d.total_students ?? d.studentsCount ?? d.students_count ?? d.students ?? 0,
          totalCourses: d.totalCourses ?? d.total_courses ?? d.coursesCount ?? d.courses_count ?? d.courses ?? 0,
          totalTrainers: d.totalTrainers ?? d.total_trainers ?? d.trainersCount ?? d.trainers_count ?? d.trainers ?? 0,
          totalEnrollments: d.totalEnrollments ?? d.total_enrollments ?? d.enrollmentsCount ?? d.enrollments_count ?? d.activeEnrollments ?? d.active_enrollments ?? 0,
          pendingApplications: d.pendingApplications ?? d.pending_applications ?? d.pendingTrainerRequests ?? d.pending_trainer_requests ?? 0,
          activeEnrollments: d.activeEnrollments ?? d.active_enrollments ?? d.totalEnrollments ?? d.total_enrollments ?? 0,
          totalOrders: d.totalOrders ?? d.total_orders ?? d.ordersCount ?? 0,
          pendingReviews: d.pendingReviews ?? d.pending_reviews ?? d.pendingGallery ?? d.pending_gallery ?? 0,
          recentOrders: d.recentOrders ?? d.recent_orders ?? [],
          ...d  // preserve any extra fields
        } as AdminDashboardMetrics;
      }),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/admin/users */
  getUsers(params?: { role?: string; isActive?: boolean; search?: string; page?: number; limit?: number }): Observable<AdminUser[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.role) httpParams = httpParams.set('role', params.role);
      if (params.isActive !== undefined) httpParams = httpParams.set('isActive', String(params.isActive));
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this.http.get<any>(`${this.apiUrl}/users`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.users || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/admin/users/:id */
  getUser(id: string): Observable<AdminUser | null> {
    return this.http.get<any>(`${this.apiUrl}/users/${id}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** PATCH /api/v1/admin/users/:id/role */
  updateUserRole(id: string, role: 'STUDENT' | 'TRAINER' | 'ADMIN'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/role`, { role });
  }

  /** PATCH /api/v1/admin/users/:id/status */
  updateUserStatus(id: string, isActive: boolean): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}/status`, { isActive });
  }

  /** GET /api/v1/admin/enrollments */
  getEnrollments(params?: { courseId?: string; studentId?: string; status?: string; page?: number; limit?: number }): Observable<AdminEnrollment[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.courseId) httpParams = httpParams.set('courseId', params.courseId);
      if (params.studentId) httpParams = httpParams.set('studentId', params.studentId);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this.http.get<any>(`${this.apiUrl}/enrollments`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.enrollments || [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/admin/enrollments */
  manualEnroll(studentId: string, courseId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enrollments`, { studentId, courseId });
  }

  /** PATCH /api/v1/admin/enrollments/:id/status */
  updateEnrollmentStatus(id: string, status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/enrollments/${id}/status`, { status });
  }

  /** GET /api/v1/admin/gallery */
  getGallery(params?: { status?: string; isFeatured?: boolean; courseId?: string; page?: number; limit?: number }): Observable<AdminGalleryItem[]> {
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

  /** PATCH /api/v1/admin/gallery/:id/moderate */
  moderateGallery(id: string, payload: { status: 'APPROVED' | 'REJECTED' | 'PENDING'; adminFeedback?: string; isFeatured?: boolean }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/gallery/${id}/moderate`, payload);
  }

  /** GET /api/v1/admin/commissions */
  getCommissions(params?: { status?: string; page?: number; limit?: number }): Observable<AdminCommission[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
    }
    return this.http.get<any>(`${this.apiUrl}/commissions`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.commissions || [];
      }),
      catchError(() => of([]))
    );
  }

  /** PATCH /api/v1/admin/commissions/:id */
  updateCommission(id: string, payload: { status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED'; transactionReference?: string }): Observable<any> {
    return this.http.patch(`${this.apiUrl}/commissions/${id}`, payload);
  }

  /** GET /api/v1/admin/settings */
  getSettings(): Observable<AdminSetting[]> {
    return this.http.get<any>(`${this.apiUrl}/settings`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** PUT /api/v1/admin/settings */
  updateSetting(payload: { settingKey: string; settingValue: string; description?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/settings`, payload);
  }

  /** GET /api/v1/content/carousel */
  getCarouselSlides(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/content/carousel`).pipe(
      map(res => {
        const data = Array.isArray(res) ? res : res?.data;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** Save full list of carousel slides to backend */
  saveCarouselSlides(slides: any[]): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/content/carousel`, { slides, data: slides }).pipe(
      catchError(() => this.http.post<any>(`${environment.apiUrl}/content/carousel`, { slides, data: slides })),
      catchError(() => this.http.put<any>(`${this.apiUrl}/carousel`, { slides, data: slides })),
      catchError(() => of(null))
    );
  }

  /** Create single slide in backend */
  createCarouselSlide(slide: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/content/carousel`, slide).pipe(
      catchError(() => this.http.post<any>(`${this.apiUrl}/carousel`, slide)),
      catchError(() => of(null))
    );
  }

  /** Update single slide in backend */
  updateCarouselSlide(id: string, slide: any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/content/carousel/${id}`, slide).pipe(
      catchError(() => this.http.put<any>(`${this.apiUrl}/carousel/${id}`, slide)),
      catchError(() => of(null))
    );
  }

  /** Delete single slide in backend */
  deleteCarouselSlide(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/content/carousel/${id}`).pipe(
      catchError(() => this.http.delete<any>(`${this.apiUrl}/carousel/${id}`)),
      catchError(() => of(null))
    );
  }
}
