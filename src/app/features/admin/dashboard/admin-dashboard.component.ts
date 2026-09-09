import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin, of, catchError, map } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { AdminDashboardMetrics } from '../../../core/models/admin.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private http = inject(HttpClient);

  metrics = signal<AdminDashboardMetrics | null>(null);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.adminService.getDashboard().subscribe({
      next: (data) => {
        this.metrics.set(data);
        this.isLoading.set(false);

        // If key metrics are still 0/null, enrich from individual endpoints
        if (!data || (data.totalStudents === 0 && data.totalRevenue === 0 && data.totalCourses === 0)) {
          this.enrichFromFallbacks(data);
        }
      },
      error: () => {
        this.isLoading.set(false);
        // Dashboard endpoint failed entirely — build from scratch
        this.enrichFromFallbacks(null);
      }
    });
  }

  /** Aggregate metrics from individual admin endpoints as fallback */
  private enrichFromFallbacks(existing: AdminDashboardMetrics | null): void {
    const apiUrl = environment.apiUrl;

    forkJoin({
      students: this.adminService.getUsers({ role: 'STUDENT', limit: 1 }).pipe(
        // The users endpoint may return total count in response
        catchError(() => of([]))
      ),
      allUsers: this.http.get<any>(`${apiUrl}/admin/users?limit=1`).pipe(
        map(res => {
          const data = res?.data || res;
          // Try to extract totalCount or pagination info
          return {
            totalStudents: res?.totalStudents ?? res?.total_students ?? data?.totalStudents ?? data?.pagination?.total ?? 0,
            totalUsers: res?.totalUsers ?? res?.total ?? data?.total ?? 0
          };
        }),
        catchError(() => of({ totalStudents: 0, totalUsers: 0 }))
      ),
      studentUsers: this.http.get<any>(`${apiUrl}/admin/users?role=STUDENT&limit=1`).pipe(
        map(res => {
          const data = res?.data || res;
          const pagination = res?.pagination || data?.pagination;
          const users = Array.isArray(data) ? data : (data?.users || []);
          return pagination?.total ?? res?.total ?? users.length ?? 0;
        }),
        catchError(() => of(0))
      ),
      courses: this.http.get<any>(`${apiUrl}/courses`).pipe(
        map(res => {
          const data = Array.isArray(res) ? res : (res?.data || []);
          return Array.isArray(data) ? data.length : 0;
        }),
        catchError(() => of(0))
      ),
      enrollments: this.adminService.getEnrollments({ limit: 1 }).pipe(
        catchError(() => of([]))
      ),
      enrollmentsFull: this.http.get<any>(`${apiUrl}/admin/enrollments?limit=1`).pipe(
        map(res => {
          const data = res?.data || res;
          const pagination = res?.pagination || data?.pagination;
          return pagination?.total ?? res?.total ?? 0;
        }),
        catchError(() => of(0))
      ),
      trainerRequests: this.http.get<any>(`${apiUrl}/trainer-requests?status=PENDING&limit=1`).pipe(
        map(res => {
          const data = res?.data || res;
          const pagination = res?.pagination || data?.pagination;
          const items = Array.isArray(data) ? data : (data?.requests || []);
          return pagination?.total ?? res?.total ?? items.length ?? 0;
        }),
        catchError(() => of(0))
      ),
      revenue: this.http.get<any>(`${apiUrl}/admin/enrollments?limit=999`).pipe(
        map(res => {
          const data = res?.data || res;
          const enrollments = Array.isArray(data) ? data : (data?.enrollments || []);
          // Try to calculate revenue from orders/payments if available
          let total = 0;
          enrollments.forEach((e: any) => {
            if (e.order?.amount) total += Number(e.order.amount);
            else if (e.amount) total += Number(e.amount);
          });
          return { total, count: enrollments.length };
        }),
        catchError(() => of({ total: 0, count: 0 }))
      ),
      galleryPending: this.http.get<any>(`${apiUrl}/admin/gallery?status=PENDING&limit=1`).pipe(
        map(res => {
          const data = res?.data || res;
          const pagination = res?.pagination || data?.pagination;
          const items = Array.isArray(data) ? data : (data?.items || []);
          return pagination?.total ?? res?.total ?? items.length ?? 0;
        }),
        catchError(() => of(0))
      )
    }).subscribe(results => {
      const current = existing || {} as AdminDashboardMetrics;

      const totalStudents = current.totalStudents || results.studentUsers || results.allUsers.totalStudents || 0;
      const totalCourses = current.totalCourses || results.courses || 0;
      const totalRevenue = current.totalRevenue || results.revenue.total || 0;
      const totalEnrollments = current.activeEnrollments || results.enrollmentsFull || results.revenue.count || 0;
      const pendingApplications = current.pendingApplications || results.trainerRequests || 0;
      const pendingReviews = (current as any).pendingReviews || results.galleryPending || 0;

      this.metrics.set({
        ...current,
        totalRevenue,
        totalStudents,
        totalCourses,
        totalEnrollments,
        activeEnrollments: totalEnrollments,
        pendingApplications,
        pendingReviews
      });
    });
  }
}
