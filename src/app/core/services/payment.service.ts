import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Payment, CreatePaymentPayload } from '../models/payment.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/payments — Get student's payments */
  getPayments(): Observable<Payment[]> {
    return this.http.get<any>(`${this.apiUrl}/payments`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/payments/:paymentId — Get a payment by ID */
  getPayment(paymentId: string): Observable<Payment | null> {
    return this.http.get<any>(`${this.apiUrl}/payments/${paymentId}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/payments — Create a payment */
  createPayment(payload: CreatePaymentPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments`, payload);
  }

  /** POST /api/v1/payments/razorpay-order — Create Razorpay order for checkout */
  createRazorpayOrder(payload: { courseId: string; amount: number; currency?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/payments/razorpay-order`, payload);
  }
}

