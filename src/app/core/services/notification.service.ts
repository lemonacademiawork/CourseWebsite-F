import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { AppNotification } from '../models/notification.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/users/me/notifications`;

  notifications = signal<AppNotification[]>([]);
  isLoading = signal<boolean>(false);

  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  constructor(private http: HttpClient) {}

  /** GET /api/v1/users/me/notifications — Fetches the notification list for any logged-in Student or Trainer */
  getNotifications(): Observable<AppNotification[]> {
    this.isLoading.set(true);
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const raw = res?.data || res;
        const list: AppNotification[] = Array.isArray(raw) ? raw : (raw?.notifications || []);
        this.notifications.set(list);
        this.isLoading.set(false);
        return list;
      }),
      catchError(() => {
        // Fallback to /api/v1/students/me/notifications
        return this.http.get<any>(`${environment.apiUrl}/students/me/notifications`).pipe(
          map(res => {
            const raw = res?.data || res;
            const list: AppNotification[] = Array.isArray(raw) ? raw : (raw?.notifications || []);
            this.notifications.set(list);
            this.isLoading.set(false);
            return list;
          }),
          catchError(() => {
            this.isLoading.set(false);
            return of(this.notifications());
          })
        );
      })
    );
  }

  /** PATCH /api/v1/users/me/notifications/:notificationId/read — Marks a notification as read */
  markAsRead(notificationId: string): Observable<any> {
    // Optimistic update
    this.notifications.update(list =>
      list.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );

    return this.http.patch<any>(`${this.apiUrl}/${notificationId}/read`, {}).pipe(
      catchError(() => {
        return this.http.patch<any>(`${environment.apiUrl}/students/me/notifications/${notificationId}/read`, {}).pipe(
          catchError(() => of({ success: true }))
        );
      })
    );
  }

  /** Mark all as read */
  markAllAsRead(): void {
    const unread = this.notifications().filter(n => !n.isRead);
    unread.forEach(n => this.markAsRead(n.id).subscribe());
  }
}
