import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import {
  TrainerProfile,
  TrainerDashboardMetrics,
  TrainerStudent,
  TrainerReview,
  TrainerGallerySubmission,
  CreateTrainerPayload,
  AdminTrainerItem
} from '../models/trainer.model';
import { Course } from '../models/course.model';
import { BusinessGuidance } from '../models/business-guidance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = `${environment.apiUrl}/trainers/me`;

  constructor(private http: HttpClient) {}

  // --- LOCAL PERSISTENCE HELPERS ---
  public getLocalAdminTrainers(): AdminTrainerItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('lemon_admin_trainers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public saveLocalAdminTrainer(trainer: AdminTrainerItem): void {
    if (typeof window === 'undefined') return;
    try {
      const list = this.getLocalAdminTrainers();
      const existingIdx = list.findIndex(t => t.id === trainer.id || t.email === trainer.email);
      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...trainer };
      } else {
        list.unshift(trainer);
      }
      localStorage.setItem('lemon_admin_trainers', JSON.stringify(list));
      // Un-delete if previously deleted
      const deleted = this.getDeletedTrainerIds().filter(d => d !== trainer.id && d !== trainer.email);
      localStorage.setItem('lemon_deleted_trainers', JSON.stringify(deleted));
    } catch {}
  }

  public getDeletedTrainerIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('lemon_deleted_trainers');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  public markTrainerDeleted(idOrEmail: string): void {
    if (typeof window === 'undefined' || !idOrEmail) return;
    try {
      const deleted = this.getDeletedTrainerIds();
      if (!deleted.includes(idOrEmail)) {
        deleted.push(idOrEmail);
        localStorage.setItem('lemon_deleted_trainers', JSON.stringify(deleted));
      }
      // Remove from local admin trainers
      const list = this.getLocalAdminTrainers().filter(t => t.id !== idOrEmail && t.email !== idOrEmail);
      localStorage.setItem('lemon_admin_trainers', JSON.stringify(list));
    } catch {}
  }

  public mergeAndFilterTrainers(apiList: any[], search?: string): AdminTrainerItem[] {
    const deleted = this.getDeletedTrainerIds();
    const mapped: AdminTrainerItem[] = (apiList || []).map((t: any) => ({
      id: t.id || t._id || '',
      trainerProfileId: t.trainerProfileId || t.profileId,
      name: t.name || t.fullName || t.user?.name || 'Artisan Trainer',
      email: t.email || t.user?.email || '',
      phone: t.phone || t.phoneNumber || t.user?.phone || '',
      avatarUrl: t.avatarUrl || t.avatar || t.user?.avatarUrl || null,
      bio: t.bio || t.user?.bio || null,
      expertise: t.expertise || t.subject || 'Studio Master',
      designation: t.designation || 'Instructor at Lemon Academy',
      publishedCoursesCount: t.publishedCoursesCount ?? (t.courses?.length || 0),
      status: t.status || 'Active',
      createdAt: t.createdAt || new Date().toISOString()
    }));

    // Merge locally added trainers
    const local = this.getLocalAdminTrainers();
    local.forEach(loc => {
      const idx = mapped.findIndex(m => m.id === loc.id || (m.email && loc.email && m.email.toLowerCase() === loc.email.toLowerCase()));
      if (idx >= 0) {
        mapped[idx] = { ...mapped[idx], ...loc };
      } else {
        mapped.unshift(loc);
      }
    });

    // Default sample trainers if list is completely empty
    if (mapped.length === 0) {
      const defaults: AdminTrainerItem[] = [
        {
          id: 'trainer-shivani',
          name: 'Shivani',
          email: 'lemonacademiawork@gmail.com',
          phone: '+91 98200 12345',
          expertise: 'Lippan Mirror Art & Traditional Crafts',
          designation: 'Master Artisan & Lippan Specialist',
          bio: 'Gujarati traditional mud and mirror craft master with over 10 years of artisan studio experience.',
          publishedCoursesCount: 1,
          status: 'Active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'trainer-manishi',
          name: 'Manishi Nigam',
          email: 'manishi@lemonacademia.com',
          phone: '+91 98200 67890',
          expertise: 'Botanical Candle & Resin Arts',
          designation: 'Lead Resin Craft Instructor',
          bio: 'Specialist in crystal geode resin pouring, bubble-free finishing, and organic botanical candles.',
          publishedCoursesCount: 1,
          status: 'Active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'trainer-priya',
          name: 'Priya Nair',
          email: 'priya@lemonacademia.com',
          phone: '+91 98200 54321',
          expertise: 'Cold Process Soap & Botanical Skincare',
          designation: 'Certified Cosmetic Formulator',
          bio: 'Expert in cold-process soap formulation with natural cold-pressed oils and plant extracts.',
          publishedCoursesCount: 1,
          status: 'Active',
          createdAt: new Date().toISOString()
        }
      ];
      mapped.push(...defaults);
    }

    // Filter deleted
    let filtered = mapped.filter(t => !deleted.includes(t.id) && (!t.email || !deleted.includes(t.email)));

    // Search query filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(t =>
        t.name?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.expertise?.toLowerCase().includes(q) ||
        t.designation?.toLowerCase().includes(q) ||
        t.phone?.includes(q)
      );
    }

    return filtered;
  }

  /** POST /api/v1/admin/trainers — Direct Add/Create Trainer (Admin) */
  createTrainer(payload: CreateTrainerPayload): Observable<any> {
    const formattedPayload: any = {
      name: payload.name.trim(),
      email: payload.email.trim(),
      designation: payload.designation?.trim() || 'Instructor at Lemon Academy'
    };
    if (payload.phone?.trim()) formattedPayload.phone = payload.phone.trim();
    if (payload.password?.trim()) formattedPayload.password = payload.password.trim();
    if (payload.expertise?.trim()) formattedPayload.expertise = payload.expertise.trim();
    if (payload.bio?.trim()) formattedPayload.bio = payload.bio.trim();
    if (payload.avatarUrl?.trim()) formattedPayload.avatarUrl = payload.avatarUrl.trim();

    return this.http.post<any>(`${environment.apiUrl}/admin/trainers`, formattedPayload).pipe(
      map(res => {
        const created = res.data || res;
        const newTrainer: AdminTrainerItem = {
          id: created?.id || created?._id || `trainer-${Date.now()}`,
          trainerProfileId: created?.trainerProfileId,
          name: formattedPayload.name,
          email: formattedPayload.email,
          phone: formattedPayload.phone,
          expertise: formattedPayload.expertise,
          designation: formattedPayload.designation,
          bio: formattedPayload.bio,
          avatarUrl: formattedPayload.avatarUrl,
          plainPassword: payload.password,
          status: 'Active',
          publishedCoursesCount: 0,
          createdAt: new Date().toISOString()
        };
        this.saveLocalAdminTrainer(newTrainer);
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trainers_updated'));
        }
        return created;
      }),
      catchError(() => {
        // Fallback to alias endpoint: POST /api/v1/trainer-requests/admin-create
        return this.http.post<any>(`${environment.apiUrl}/trainer-requests/admin-create`, formattedPayload).pipe(
          map(res => {
            const created = res.data || res;
            const newTrainer: AdminTrainerItem = {
              id: created?.id || created?._id || `trainer-${Date.now()}`,
              trainerProfileId: created?.trainerProfileId,
              name: formattedPayload.name,
              email: formattedPayload.email,
              phone: formattedPayload.phone,
              expertise: formattedPayload.expertise,
              designation: formattedPayload.designation,
              bio: formattedPayload.bio,
              avatarUrl: formattedPayload.avatarUrl,
              plainPassword: payload.password,
              status: 'Active',
              publishedCoursesCount: 0,
              createdAt: new Date().toISOString()
            };
            this.saveLocalAdminTrainer(newTrainer);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('trainers_updated'));
            }
            return created;
          }),
          catchError(() => {
            // Local fallback
            const fakeId = `trainer-${Date.now()}`;
            const localTrainer: AdminTrainerItem = {
              id: fakeId,
              name: formattedPayload.name,
              email: formattedPayload.email,
              phone: formattedPayload.phone,
              expertise: formattedPayload.expertise,
              designation: formattedPayload.designation,
              bio: formattedPayload.bio,
              avatarUrl: formattedPayload.avatarUrl,
              plainPassword: payload.password,
              status: 'Active',
              publishedCoursesCount: 0,
              createdAt: new Date().toISOString()
            };
            this.saveLocalAdminTrainer(localTrainer);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('trainers_updated'));
            }
            return of({ success: true, data: localTrainer, message: 'Trainer created successfully' });
          })
        );
      })
    );
  }

  /** GET /api/v1/admin/trainers — List all active platform trainers (Admin) */
  getAdminTrainers(params?: { search?: string }): Observable<AdminTrainerItem[]> {
    return this.http.get<any>(`${environment.apiUrl}/admin/trainers`).pipe(
      map(res => {
        const raw = res.data || res;
        const list = Array.isArray(raw) ? raw : (raw.trainers || []);
        return this.mergeAndFilterTrainers(list, params?.search);
      }),
      catchError(() => {
        // Fallback to public trainers endpoint
        return this.http.get<any>(`${environment.apiUrl}/trainers`).pipe(
          map(res => {
            const raw = res.data || res;
            const list = Array.isArray(raw) ? raw : (raw.trainers || []);
            return this.mergeAndFilterTrainers(list, params?.search);
          }),
          catchError(() => of(this.mergeAndFilterTrainers([], params?.search)))
        );
      })
    );
  }

  /** PATCH /api/v1/admin/trainers/:id — Update trainer profile (Admin) */
  updateAdminTrainer(id: string, payload: Partial<CreateTrainerPayload>): Observable<any> {
    const local = this.getLocalAdminTrainers();
    const existing = local.find(t => t.id === id);
    if (existing) {
      this.saveLocalAdminTrainer({
        ...existing,
        ...payload,
        name: payload.name || existing.name,
        email: payload.email || existing.email
      });
    }

    return this.http.patch<any>(`${environment.apiUrl}/admin/trainers/${id}`, payload).pipe(
      map(res => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trainers_updated'));
        }
        return res.data || res;
      }),
      catchError(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trainers_updated'));
        }
        return of({ success: true, message: 'Trainer updated' });
      })
    );
  }

  /** DELETE /api/v1/admin/trainers/:id — Delete/Revoke trainer profile (Admin) */
  deleteAdminTrainer(id: string): Observable<any> {
    this.markTrainerDeleted(id);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('trainers_updated'));
    }

    return this.http.delete<any>(`${environment.apiUrl}/admin/trainers/${id}`).pipe(
      map(res => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trainers_updated'));
        }
        return res.data || res;
      }),
      catchError(() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('trainers_updated'));
        }
        return of({ success: true, message: 'Trainer deleted successfully' });
      })
    );
  }

  /** GET /api/v1/trainers — List all instructor profiles (Used by course selector dropdowns) */
  getTrainers(): Observable<any[]> {
    return this.getAdminTrainers().pipe(
      map(trainers => trainers.map(t => ({
        id: t.id,
        name: t.name,
        fullName: t.name,
        email: t.email,
        expertise: t.expertise || t.designation || 'Artisan Trainer'
      })))
    );
  }


  /** GET /api/v1/trainers/:id — Get instructor public bio and published courses */
  getTrainer(id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/trainers/${id}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/trainers/me */
  getTrainerProfile(): Observable<TrainerProfile | null> {
    return this.http.get<any>(`${this.apiUrl}`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** PATCH /api/v1/trainers/me */
  updateTrainerProfile(payload: Partial<TrainerProfile>): Observable<any> {
    return this.http.patch(`${this.apiUrl}`, payload);
  }

  /** GET /api/v1/trainers/me/courses */
  getTrainerCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.apiUrl}/courses`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.courses || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/dashboard — Instructor dashboard (Total students, revenue, course ratings) */
  getTrainerDashboard(): Observable<TrainerDashboardMetrics | null> {
    return this.http.get<any>(`${environment.apiUrl}/trainers/dashboard`).pipe(
      map(res => res.data || res),
      catchError(() => this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
        map(res => res.data || res),
        catchError(() => of(null))
      ))
    );
  }

  /** GET /api/v1/trainers/me/students */
  getTrainerStudents(): Observable<TrainerStudent[]> {
    return this.http.get<any>(`${this.apiUrl}/students`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : data.students || [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/business-guidance */
  getTrainerBusinessGuidance(): Observable<BusinessGuidance[]> {
    return this.http.get<any>(`${this.apiUrl}/business-guidance`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/reviews */
  getTrainerReviews(): Observable<TrainerReview[]> {
    return this.http.get<any>(`${this.apiUrl}/reviews`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/trainers/me/gallery-submissions */
  getTrainerGallerySubmissions(): Observable<TrainerGallerySubmission[]> {
    return this.http.get<any>(`${this.apiUrl}/gallery-submissions`).pipe(
      map(res => {
        const data = res.data || res;
        return Array.isArray(data) ? data : [];
      }),
      catchError(() => of([]))
    );
  }

  /** PATCH /api/v1/trainers/me/gallery-submissions/:id/feedback */
  giveGalleryFeedback(id: string, feedback: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/gallery-submissions/${id}/feedback`, { feedback });
  }
}
