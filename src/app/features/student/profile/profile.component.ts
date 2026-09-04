import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] py-12 px-margin-mobile md:px-margin-desktop max-w-xl mx-auto text-xs">
      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4 border shadow-sm">
            {{ getInitials() }}
          </div>
          <h2 class="playfair text-xl font-bold text-on-surface">{{ authService.userName() }}</h2>
          <p class="text-on-surface-variant capitalize mt-0.5">{{ authService.userRole() }} Account</p>
        </div>

        <div class="border-t border-outline-variant/20 pt-4 space-y-3">
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Email Address</span>
            <span class="text-on-surface">{{ authService.userEmail() }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Account Type</span>
            <span class="text-on-surface capitalize">{{ authService.userRole() }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Active Courses</span>
            <span class="text-on-surface font-bold">{{ courseCount() }}</span>
          </div>
        </div>

        @if (authService.userRole() !== 'admin' && authService.userRole() !== 'trainer') {
          <div class="border-t border-outline-variant/20 pt-4 space-y-3">
            <h3 class="font-bold text-sm text-on-surface flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">receipt_long</span>
              Payment &amp; Purchase History
            </h3>
            @if (payments().length > 0) {
              <div class="space-y-2">
                @for (p of payments(); track p.id) {
                  <div class="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-between">
                    <div>
                      <span class="font-semibold text-on-surface block">Payment #{{ p.razorpayPaymentId || p.id.slice(0, 8) }}</span>
                      <span class="text-[10px] text-on-surface-variant">{{ p.createdAt ? (p.createdAt | date:'mediumDate') : 'Recent' }} • {{ p.paymentMethod || 'Online' }}</span>
                    </div>
                    <span class="font-bold text-primary">Rs. {{ p.amount }}</span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-xs text-on-surface-variant italic py-1">No past purchase invoices recorded yet.</p>
            }
          </div>
        }

        <div class="pt-4 flex flex-col gap-2">
          @if (authService.userRole() === 'admin') {
            <a routerLink="/admin/dashboard" class="w-full text-center bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Go to Admin Dashboard
            </a>
          } @else if (authService.userRole() === 'trainer') {
            <a routerLink="/trainer/dashboard" class="w-full text-center bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Go to Trainer Dashboard
            </a>
          } @else {
            <a routerLink="/my-courses" class="w-full text-center bg-primary text-on-primary font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
              Go to My Courses
            </a>
          }
          <button 
            (click)="handleLogout()"
            class="w-full bg-surface-container text-on-surface font-semibold py-2.5 rounded-lg hover:bg-surface-dim transition-colors cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>
    </main>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private enrollmentService = inject(EnrollmentService);
  private paymentService = inject(PaymentService);

  courseCount = signal<number>(0);
  payments = signal<Payment[]>([]);

  ngOnInit(): void {
    this.authService.fetchUserProfile().subscribe();
    this.enrollmentService.getEnrollments().subscribe({
      next: (enrollments) => {
        this.courseCount.set(enrollments.length);
      },
      error: () => {
        this.courseCount.set(0);
      }
    });

    if (this.authService.userRole() !== 'admin' && this.authService.userRole() !== 'trainer') {
      this.paymentService.getPayments().subscribe({
        next: (list) => this.payments.set(list),
        error: () => this.payments.set([])
      });
    }
  }

  getInitials(): string {
    const name = this.authService.userName() || 'User';
    return name.split(' ').map(n => n[0]).join('');
  }

  handleLogout(): void {
    this.authService.logout();
  }
}

