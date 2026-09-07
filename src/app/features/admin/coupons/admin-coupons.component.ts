import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface CouponItem {
  id: number;
  code: string;
  discount: number;
  usageCount: number;
  status: 'Active' | 'Expired';
}

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface">Coupon Codes</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">Manage promotional discounts and special offers.</p>
        </div>
        <a routerLink="/admin/coupons/create" class="bg-primary text-on-primary font-semibold px-4 py-2.5 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm">
          <span class="material-symbols-outlined text-sm">add</span>
          Create New Coupon
        </a>
      </div>

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
              <th class="py-3 px-4">Coupon Code</th>
              <th class="py-3 px-4">Discount %</th>
              <th class="py-3 px-4">Usage Count</th>
              <th class="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-outline-variant/15">
            @for (coupon of coupons(); track coupon.id) {
              <tr class="hover:bg-surface-container-low/50">
                <td class="py-3 px-4 font-mono font-bold text-primary">{{ coupon.code }}</td>
                <td class="py-3 px-4 font-semibold">{{ coupon.discount }}% OFF</td>
                <td class="py-3 px-4">{{ coupon.usageCount }} times</td>
                <td class="py-3 px-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-800">
                    {{ coupon.status }}
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>

        @if (coupons().length === 0) {
          <div class="p-8 text-center bg-surface-container-low text-on-surface-variant">
            <span class="material-symbols-outlined text-primary text-3xl mb-1">local_offer</span>
            <p class="font-semibold text-xs text-on-surface">No Discount Coupons Created</p>
            <p class="text-[11px] text-on-surface-variant mt-0.5 mb-3">Create promotional discount codes for special marketing campaigns.</p>
            <a routerLink="/admin/coupons/create" class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-semibold hover:opacity-90">
              <span class="material-symbols-outlined text-xs">add</span> Create First Coupon
            </a>
          </div>
        }
      </div>
    </main>
  `
})
export class AdminCouponsComponent {
  coupons = signal<CouponItem[]>([]);
}
