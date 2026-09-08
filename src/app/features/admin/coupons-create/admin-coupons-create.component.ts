import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponService } from '../../../core/services/coupon.service';
import { DiscountType } from '../../../core/models/coupon.model';

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

        @if (error()) {
          <div class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs">
            {{ error() }}
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

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1">Discount Type</label>
              <select 
                [ngModel]="discountType()"
                (ngModelChange)="discountType.set($event)"
                name="discountType"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none">
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FLAT">Flat Amount (₹)</option>
              </select>
            </div>

            <div>
              <label class="block font-semibold mb-1">
                Discount Value ({{ discountType() === 'PERCENTAGE' ? '%' : '₹' }})
              </label>
              <input 
                type="number" 
                min="1" 
                [ngModel]="discountValue()"
                (ngModelChange)="discountValue.set($event)"
                name="discountValue"
                required
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-semibold mb-1">Min Order Amount (₹)</label>
              <input 
                type="number" 
                min="0"
                placeholder="Optional"
                [ngModel]="minOrderAmount()"
                (ngModelChange)="minOrderAmount.set($event)"
                name="minOrderAmount"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label class="block font-semibold mb-1">Total Usage Limit</label>
              <input 
                type="number" 
                min="1"
                placeholder="Unlimited"
                [ngModel]="usageLimit()"
                (ngModelChange)="usageLimit.set($event)"
                name="usageLimit"
                class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label class="block font-semibold mb-1">Description</label>
            <input 
              type="text" 
              placeholder="e.g. Special festive 20% discount"
              [ngModel]="description()"
              (ngModelChange)="description.set($event)"
              name="description"
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
          </div>

          <button 
            type="submit" 
            [disabled]="loading()"
            class="w-full py-3 bg-primary text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm cursor-pointer disabled:opacity-50">
            {{ loading() ? 'Creating...' : 'Create & Activate Coupon' }}
          </button>
        </form>
      </div>
    </main>
  `
})
export class AdminCouponsCreateComponent {
  private router = inject(Router);
  private couponService = inject(CouponService);

  code = signal<string>('');
  discountType = signal<DiscountType>('PERCENTAGE');
  discountValue = signal<number>(20);
  minOrderAmount = signal<number | undefined>(undefined);
  usageLimit = signal<number | undefined>(undefined);
  description = signal<string>('');
  
  loading = signal<boolean>(false);
  created = signal<boolean>(false);
  error = signal<string>('');

  handleCreate(): void {
    if (!this.code().trim()) return;

    this.loading.set(true);
    this.error.set('');

    this.couponService.createCoupon({
      code: this.code().trim().toUpperCase(),
      discountType: this.discountType(),
      discountValue: this.discountValue(),
      minOrderAmount: this.minOrderAmount() || undefined,
      usageLimit: this.usageLimit() || undefined,
      description: this.description().trim() || undefined,
      isActive: true
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.created.set(true);
        setTimeout(() => {
          this.router.navigate(['/admin/coupons']);
        }, 1200);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Failed to create coupon.');
      }
    });
  }
}
