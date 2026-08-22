import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './top-navbar.component.html'
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  router = inject(Router);

  mobileMenuOpen = signal<boolean>(false);
  hasCourses = signal<boolean>(false);

  private authListener = () => this.checkCourses();
  private coursesListener = () => this.checkCourses();

  ngOnInit(): void {
    this.authService.loadAuthState();
    this.checkCourses();

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

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  handleLogout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }
}
