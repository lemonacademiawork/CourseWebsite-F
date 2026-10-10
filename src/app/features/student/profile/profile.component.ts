import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { EnrollmentService } from '../../../core/services/enrollment.service';
import { PaymentService } from '../../../core/services/payment.service';
import { Payment } from '../../../core/models/payment.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="min-h-screen bg-[#FBF8F1] py-12 px-margin-mobile md:px-margin-desktop max-w-xl mx-auto text-xs">
      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-10 shadow-sm space-y-6">
        
        <!-- Header & Avatar -->
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xl mx-auto mb-4 border shadow-sm uppercase tracking-wider">
            {{ getInitials() }}
          </div>
          <h2 class="playfair text-xl font-bold text-on-surface">{{ authService.userName() }}</h2>
          <p class="text-on-surface-variant capitalize mt-0.5">{{ authService.userRole() }} Account</p>

          <!-- Quick Action Buttons: Edit Profile & Change Password -->
          <div class="flex items-center justify-center gap-2.5 mt-4">
            <button 
              (click)="openEditProfile()"
              class="px-3.5 py-1.5 bg-surface-container hover:bg-surface-variant text-on-surface rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs transition-colors">
              <span class="material-symbols-outlined text-sm">edit</span>
              <span>Edit Profile</span>
            </button>

            <button 
              (click)="openChangePassword()"
              class="px-3.5 py-1.5 bg-surface-container hover:bg-surface-variant text-on-surface rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer text-xs transition-colors">
              <span class="material-symbols-outlined text-sm">lock_reset</span>
              <span>Change Password</span>
            </button>
          </div>

          @if (profileMessage()) {
            <div class="mt-3 p-2.5 rounded-lg text-[11px] font-medium" [class.bg-green-50]="profileSuccess()" [class.text-green-800]="profileSuccess()" [class.bg-red-50]="!profileSuccess()" [class.text-red-700]="!profileSuccess()">
              {{ profileMessage() }}
            </div>
          }
        </div>

        <div class="border-t border-outline-variant/20 pt-4 space-y-3">
          <div class="flex justify-between py-2 border-b border-outline-variant/10">
            <span class="font-semibold text-on-surface-variant">Full Name</span>
            <span class="text-on-surface font-medium">{{ authService.userName() }}</span>
          </div>
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
            <span class="text-on-surface font-bold text-primary">{{ courseCount() }}</span>
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

      <!-- Edit Profile Modal -->
      @if (showEditModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 class="font-bold text-sm text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-base">edit</span>
                Edit Profile
              </h3>
              <button (click)="closeEditProfile()" class="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-[11px] font-semibold text-on-surface mb-1">Full Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="editName" 
                  placeholder="Enter your name" 
                  class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              @if (modalError()) {
                <p class="text-[11px] text-red-600 font-medium">{{ modalError() }}</p>
              }

              <div class="pt-2 flex gap-2">
                <button 
                  (click)="saveProfile()"
                  [disabled]="modalLoading()"
                  class="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer">
                  {{ modalLoading() ? 'Saving...' : 'Save Changes' }}
                </button>
                <button 
                  (click)="closeEditProfile()"
                  class="px-4 py-2.5 bg-surface-container text-on-surface font-semibold rounded-lg text-xs hover:bg-surface-variant transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Change Password Modal -->
      @if (showPassModal()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between border-b border-outline-variant/20 pb-3">
              <h3 class="font-bold text-sm text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-base">lock_reset</span>
                Change Password
              </h3>
              <button (click)="closeChangePassword()" class="text-on-surface-variant hover:text-on-surface cursor-pointer">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div class="space-y-3">
              <div>
                <label class="block text-[11px] font-semibold text-on-surface mb-1">Current Password</label>
                <input 
                  type="password" 
                  [(ngModel)]="currentPass" 
                  placeholder="Enter current password" 
                  class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-on-surface mb-1">New Password</label>
                <input 
                  type="password" 
                  [(ngModel)]="newPass" 
                  placeholder="At least 6 characters" 
                  class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label class="block text-[11px] font-semibold text-on-surface mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  [(ngModel)]="confirmPass" 
                  placeholder="Confirm new password" 
                  class="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              @if (modalError()) {
                <p class="text-[11px] text-red-600 font-medium">{{ modalError() }}</p>
              }

              <div class="pt-2 flex gap-2">
                <button 
                  (click)="savePassword()"
                  [disabled]="modalLoading()"
                  class="flex-1 py-2.5 bg-primary text-on-primary font-bold rounded-lg text-xs hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer">
                  {{ modalLoading() ? 'Updating...' : 'Update Password' }}
                </button>
                <button 
                  (click)="closeChangePassword()"
                  class="px-4 py-2.5 bg-surface-container text-on-surface font-semibold rounded-lg text-xs hover:bg-surface-variant transition-colors cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </main>
  `
})
export class ProfileComponent implements OnInit {
  authService = inject(AuthService);
  private studentService = inject(StudentService);
  private enrollmentService = inject(EnrollmentService);
  private paymentService = inject(PaymentService);

  courseCount = signal<number>(0);
  payments = signal<Payment[]>([]);

  // Modals state
  showEditModal = signal<boolean>(false);
  showPassModal = signal<boolean>(false);
  modalLoading = signal<boolean>(false);
  modalError = signal<string>('');

  profileMessage = signal<string>('');
  profileSuccess = signal<boolean>(false);

  // Edit profile form
  editName = '';

  // Change password form
  currentPass = '';
  newPass = '';
  confirmPass = '';

  ngOnInit(): void {
    this.authService.fetchUserProfile().subscribe();
    this.authService.getAuthMe().subscribe();

    this.studentService.getStudentProfile().subscribe({
      next: (student) => {
        if (student && (student.name || student.studentProfile?.name)) {
          const rawName = student.name || student.studentProfile?.name;
          const formatted = this.authService.resolveDisplayName({ name: rawName }, this.authService.userEmail());
          this.authService.userName.set(formatted);
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_name', formatted);
            this.authService.setCookie('user_name', formatted);
          }
        }
      },
      error: () => {}
    });

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
    const name = this.authService.userName() || '';
    if (!name || name.toLowerCase() === 'user') {
      const email = this.authService.userEmail();
      if (email) return email.charAt(0).toUpperCase();
      return 'M';
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0][0] || 'M').toUpperCase();
  }

  openEditProfile(): void {
    this.editName = this.authService.userName();
    this.modalError.set('');
    this.showEditModal.set(true);
  }

  closeEditProfile(): void {
    this.showEditModal.set(false);
    this.modalError.set('');
  }

  saveProfile(): void {
    const name = this.editName.trim();
    if (!name) {
      this.modalError.set('Please enter your full name.');
      return;
    }

    this.modalLoading.set(true);
    this.modalError.set('');

    this.authService.updateProfile({ name }).subscribe({
      next: () => {
        this.modalLoading.set(false);
        this.authService.userName.set(name);
        this.profileMessage.set('Profile name updated successfully.');
        this.profileSuccess.set(true);
        this.closeEditProfile();
      },
      error: (err) => {
        this.modalLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to update profile name.';
        this.modalError.set(msg);
      }
    });
  }

  openChangePassword(): void {
    this.currentPass = '';
    this.newPass = '';
    this.confirmPass = '';
    this.modalError.set('');
    this.showPassModal.set(true);
  }

  closeChangePassword(): void {
    this.showPassModal.set(false);
    this.modalError.set('');
  }

  savePassword(): void {
    if (!this.currentPass) {
      this.modalError.set('Please enter your current password.');
      return;
    }
    if (!this.newPass || this.newPass.length < 6) {
      this.modalError.set('New password must be at least 6 characters long.');
      return;
    }
    if (this.newPass !== this.confirmPass) {
      this.modalError.set('New passwords do not match.');
      return;
    }

    this.modalLoading.set(true);
    this.modalError.set('');

    this.authService.changePassword(this.currentPass, this.newPass).subscribe({
      next: () => {
        this.modalLoading.set(false);
        this.profileMessage.set('Password updated successfully.');
        this.profileSuccess.set(true);
        this.closeChangePassword();
      },
      error: (err) => {
        this.modalLoading.set(false);
        const msg = err?.error?.message || err?.message || 'Failed to update password. Please check your current password.';
        this.modalError.set(msg);
      }
    });
  }

  handleLogout(): void {
    this.authService.logout();
  }
}
