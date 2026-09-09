import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AppNotification } from '../../../core/models/notification.model';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './top-navbar.component.html'
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
  router = inject(Router);

  mobileMenuOpen = signal<boolean>(false);
  notificationsOpen = signal<boolean>(false);
  hasCourses = signal<boolean>(false);

  private authListener = () => {
    this.checkCourses();
    if (this.authService.isLoggedIn()) {
      this.notificationService.getNotifications().subscribe();
    }
  };
  private coursesListener = () => this.checkCourses();

  ngOnInit(): void {
    this.authService.loadAuthState();
    this.checkCourses();

    if (this.authService.isLoggedIn()) {
      this.notificationService.getNotifications().subscribe();
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('auth_state_changed', this.authListener);
      window.addEventListener('courses_updated', this.coursesListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('auth_state_changed', this.authListener);
      window.removeEventListener('courses_updated', this.coursesListener);
    }
  }

  checkCourses(): void {
    if (typeof window === 'undefined') return;
    const purchased = localStorage.getItem('purchased_courses');
    if (purchased) {
      try {
        const list = JSON.parse(purchased);
        this.hasCourses.set(Array.isArray(list) && list.length > 0);
      } catch {
        this.hasCourses.set(false);
      }
    } else {
      this.hasCourses.set(false);
    }
  }

  toggleNotifications(): void {
    this.notificationsOpen.update(v => !v);
    if (this.notificationsOpen()) {
      this.notificationService.getNotifications().subscribe();
    }
  }

  closeNotifications(): void {
    this.notificationsOpen.set(false);
  }

  markRead(notification: AppNotification, event?: Event): void {
    if (event) event.stopPropagation();
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
    }
  }

  dismissNotification(notification: AppNotification, event?: Event): void {
    if (event) event.stopPropagation();
    this.notificationService.dismissNotification(notification.id);
  }

  markAllRead(): void {
    this.notificationService.markAllAsRead();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  handleLogout(): void {
    this.closeMobileMenu();
    this.closeNotifications();
    this.authService.logout();
  }
}
