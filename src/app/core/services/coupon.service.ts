import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  Coupon,
  ValidateCouponPayload,
  ValidateCouponResponse,
  CreateCouponPayload,
  UpdateCouponPayload
} from '../models/coupon.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;

  constructor(private http: HttpClient) {}

  /** POST /api/v1/coupons/validate — Validate promo code and calculate discount */
  validateCoupon(payload: ValidateCouponPayload): Observable<ValidateCouponResponse> {
    return this.http.post<any>(`${this.apiUrl}/validate`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/coupons/public — Get public active promotional coupons */
  getPublicCoupons(): Observable<Coupon[]> {
    return this.http.get<any>(`${this.apiUrl}/public`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.coupons || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/coupons — List all coupons (Admin) */
  getAllCoupons(params?: { search?: string; isActive?: boolean; page?: number; limit?: number }): Observable<Coupon[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.isActive !== undefined) httpParams = httpParams.set('isActive', String(params.isActive));
    if (params?.page) httpParams = httpParams.set('page', String(params.page));
    if (params?.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.coupons || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/coupons/:id — Get single coupon with details (Admin) */
  getCouponById(id: string): Observable<Coupon | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/coupons — Create new coupon (Admin) */
  createCoupon(payload: CreateCouponPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/coupons/:id — Update coupon (Admin) */
  updateCoupon(id: string, payload: UpdateCouponPayload): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/coupons/:id — Delete coupon (Admin) */
  deleteCoupon(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res)
    );
  }
}
