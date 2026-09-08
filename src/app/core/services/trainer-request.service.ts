import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  TrainerRequest,
  TrainerRequestStatus,
  SubmitTrainerRequestPayload,
  ReviewTrainerRequestPayload
} from '../models/trainer-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainerRequestService {
  private apiUrl = `${environment.apiUrl}/trainer-requests`;

  constructor(private http: HttpClient) {}

  /** POST /api/v1/trainer-requests — Submit "Become a Trainer" application */
  submitApplication(payload: SubmitTrainerRequestPayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/trainer-requests/me — Get user's own application status */
  getMyApplication(): Observable<TrainerRequest | null> {
    return this.http.get<any>(`${this.apiUrl}/me`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/trainer-requests — List all trainer applications (Admin) */
  getAllApplications(params?: { status?: TrainerRequestStatus; search?: string; page?: number; limit?: number }): Observable<TrainerRequest[]> {
    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.page) httpParams = httpParams.set('page', String(params.page));
    if (params?.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<any>(`${this.apiUrl}`, { params: httpParams }).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.requests || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainer-requests/:id — Get full application details (Admin) */
  getApplicationById(id: string): Observable<TrainerRequest | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** PATCH /api/v1/trainer-requests/:id/status — Review/Approve/Reject application (Admin) */
  reviewApplication(id: string, payload: ReviewTrainerRequestPayload): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/trainer-requests/:id — Delete application record (Admin) */
  deleteApplication(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res)
    );
  }
}
