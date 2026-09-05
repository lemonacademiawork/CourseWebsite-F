import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Certificate, CertificateVerification } from '../models/certificate.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = `${environment.apiUrl}/certificates`;

  constructor(private http: HttpClient) {}

  /** POST /api/v1/certificates — Claim / generate certificate for course */
  claimCertificate(courseId: string): Observable<Certificate | null> {
    return this.http.post<any>(`${this.apiUrl}`, { courseId }).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/certificates/course/:courseId — Get certificate by course ID for authenticated student */
  getCertificateByCourse(courseId: string): Observable<Certificate | null> {
    return this.http.get<any>(`${this.apiUrl}/course/${courseId}`).pipe(
      map(res => res.data || res || null),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/certificates/verify/:verificationCode — Verify certificate */
  verifyCertificate(verificationCode: string): Observable<CertificateVerification> {
    return this.http.get<any>(`${this.apiUrl}/verify/${verificationCode}`).pipe(
      map(res => ({
        valid: res.valid ?? (!!res.data || !!res.certificate),
        certificate: res.data || res.certificate || res,
        message: res.message
      })),
      catchError(err => of({
        valid: false,
        message: err.error?.message || 'Certificate verification failed'
      }))
    );
  }
}

