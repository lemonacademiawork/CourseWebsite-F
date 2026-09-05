import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReferralSummary, ReferralCommission, ReferralValidationResult } from '../models/referral.model';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/referrals/validate/:code — Validate referral code */
  validateReferralCode(code: string): Observable<ReferralValidationResult> {
    return this.http.get<any>(`${this.apiUrl}/referrals/validate/${encodeURIComponent(code)}`).pipe(
      map(res => {
        const data = res.data || res;
        return {
          valid: data.valid ?? true,
          code: data.code || code,
          discountPercentage: data.discountPercentage || data.discount || 10,
          referrerName: data.referrerName || data.name || '',
          message: data.message || 'Valid referral code'
        };
      }),
      catchError(err => of({
        valid: false,
        code,
        message: err?.error?.message || 'Invalid or expired referral code'
      }))
    );
  }

  /** GET /api/v1/referrals/me — Get logged-in student's referral stats & link */
  getMyReferrals(): Observable<ReferralSummary> {
    return this.http.get<any>(`${this.apiUrl}/referrals/me`).pipe(
      map(res => {
        const data = res.data || res;
        return {
          referralCode: data.referralCode || data.code || 'LEMON10',
          referralLink: data.referralLink || data.link || '',
          totalReferrals: data.totalReferrals || data.totalReferred || 0,
          activeReferrals: data.activeReferrals || 0,
          totalEarned: data.totalEarned || data.totalEarnings || 0,
          pendingPayout: data.pendingPayout || data.pendingEarnings || 0,
          paidPayout: data.paidPayout || data.paidEarnings || 0,
          commissionRate: data.commissionRate || 10,
          recentReferrals: data.recentReferrals || data.referralsList || []
        };
      }),
      catchError(() => of({
        referralCode: 'LEMON10',
        totalReferrals: 0,
        totalEarned: 0,
        pendingPayout: 0,
        paidPayout: 0
      }))
    );
  }

  /** GET /api/v1/referrals/me/commissions — Get student's referral commission records */
  getMyCommissions(): Observable<ReferralCommission[]> {
    return this.http.get<any>(`${this.apiUrl}/referrals/me/commissions`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : (data.commissions || []);
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/referrals/:id — Get referral details by ID */
  getReferralById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/referrals/${id}`).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/admin/commissions — List referral commissions for admin */
  getAdminCommissions(filters?: { status?: string; page?: number; limit?: number }): Observable<{ commissions: ReferralCommission[]; total: number }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.status) params = params.set('status', filters.status);
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/admin/commissions`, { params }).pipe(
      map(res => {
        const data = res.data || res;
        const commissions = Array.isArray(data.commissions) ? data.commissions : (Array.isArray(data) ? data : []);
        return {
          commissions,
          total: data.total || commissions.length
        };
      }),
      catchError(() => of({ commissions: [], total: 0 }))
    );
  }

  /** PATCH /api/v1/admin/commissions/:id — Update commission status & transaction reference */
  updateAdminCommission(id: string, payload: { status: string; transactionReference?: string; notes?: string }): Observable<ReferralCommission> {
    return this.http.patch<any>(`${this.apiUrl}/admin/commissions/${id}`, payload).pipe(
      map(res => res.data || res)
    );
  }
}
