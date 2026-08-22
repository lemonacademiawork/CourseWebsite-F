import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-coupons-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <main class="p-6 max-w-2xl mx-auto text-xs text-on-surface">
      <div class="mb-6 flex items-center justify-between">
        <a routerLink="/admin/coupons" class="text-primary hover:underline font-semibold flex items-center gap-1">
          <span class="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Coupons
        </a>
      </div>

      <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <h1 class="text-xl font-bold">Create Discount Coupon</h1>

        @if (created()) {
          <div class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-xs">
            Coupon created successfully!
          </div>
        }

        <form (ngSubmit)="handleCreate()" class="space-y-4">
          <div>
            <label class="block font-semibold mb-1">Coupon Code (Uppercase)</label>
            <input 
              type="text" 
              placeholder="e.g. SUMMERFEST"
              [ngModel]="code()"
              (ngModelChange)="code.set($event.toUpperCase())"
              name="code"
              required
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs uppercase font-mono focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Discount Percentage (%)</label>
            <input 
              type="number" 
              min="1" 
              max="100"
              [ngModel]="discount()"
              (ngModelChange)="discount.set($event)"
              name="discount"
              required
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            class="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
            Create &amp; Activate Coupon
          </button>
        </form>
      </div>
    </main>
  `
})
export class AdminCouponsCreateComponent {
  private router = inject(Router);

  code = signal<string>('');
  discount = signal<number>(20);
  created = signal<boolean>(false);

  handleCreate(): void {
    if (!this.code().trim()) return;
    this.created.set(true);
    setTimeout(() => {
      this.router.navigate(['/admin/coupons']);
    }, 1200);
  }
}
