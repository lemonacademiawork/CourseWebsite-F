import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Order, CreateOrderPayload } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/orders */
  getMyOrders(): Observable<Order[]> {
    return this.http.get<any>(`${this.apiUrl}/orders`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/orders/:orderId */
  getOrder(orderId: string): Observable<Order | null> {
    return this.http.get<any>(`${this.apiUrl}/orders/${orderId}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/orders */
  createOrder(payload: CreateOrderPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders`, payload);
  }
}
