import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Procedure, CreateProcedurePayload, UpdateProcedurePayload } from '../models/procedure.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcedureService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses/:courseId/procedures */
  getProcedures(courseId: string): Observable<Procedure[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/procedures`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/procedures */
  createProcedure(courseId: string, payload: CreateProcedurePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/procedures`, payload);
  }

  /** PATCH /api/v1/courses/:courseId/procedures/:procedureId */
  updateProcedure(courseId: string, procedureId: string, payload: UpdateProcedurePayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/procedures/${procedureId}`, payload);
  }

  /** DELETE /api/v1/courses/:courseId/procedures/:procedureId */
  deleteProcedure(courseId: string, procedureId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/procedures/${procedureId}`);
  }
}
