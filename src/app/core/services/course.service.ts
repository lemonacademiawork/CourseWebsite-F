import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../models/course.model';
import { CourseResource, CreateResourcePayload, UpdateResourcePayload } from '../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses — List published courses with filters & pagination */
  getCourses(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    level?: string;
    isPublished?: boolean;
  }): Observable<Course[]> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.page) httpParams = httpParams.set('page', String(params.page));
      if (params.limit) httpParams = httpParams.set('limit', String(params.limit));
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
      if (params.level) httpParams = httpParams.set('level', params.level);
      if (params.isPublished !== undefined) httpParams = httpParams.set('isPublished', String(params.isPublished));
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(json => {
        const raw = json.data || json;
        const list = Array.isArray(raw) ? raw : (raw.courses || []);
        return list.map((c: any) => this.mapCourse(c));
      }),
      catchError(() => of([]))
    );
  }

  /** GET /api/v1/courses/:id — Get course details by ID */
  getCourse(id: string): Observable<Course | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        const data = res.data || res;
        if (data && (data.id || data._id)) {
          return this.mapCourse(data);
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/slug/:slug — Get course details by URL slug */
  getCourseBySlug(slug: string): Observable<Course | null> {
    return this.http.get<any>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(res => {
        const data = res.data || res;
        return data && (data.id || data._id) ? this.mapCourse(data) : null;
      }),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/courses — Create a new course (Trainer / Admin) */
  createCourse(payload: CreateCoursePayload): Observable<any> {
    const formattedPayload: any = {
      title: payload.title,
      categoryId: payload.categoryId,
      shortDescription: payload.shortDescription || payload.description?.slice(0, 120),
      description: payload.description || payload.shortDescription,
      price: Number(payload.price),
      discountPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price),
      level: payload.level || 'BEGINNER',
      durationHours: payload.durationHours || 10,
      thumbnailUrl: payload.thumbnailUrl || payload.imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
      previewVideoUrl: payload.previewVideoUrl || null,
      liveClassLink: payload.liveClassLink || null,
      liveScheduleText: payload.liveScheduleText || null,
      youtubePlaylistUrl: payload.youtubePlaylistUrl || null
    };

    if (payload.trainerId) formattedPayload.trainerId = payload.trainerId;
    if (payload.trainer) formattedPayload.trainer = payload.trainer;

    return this.http.post<any>(this.apiUrl, formattedPayload).pipe(
      map(res => {
        const created = res.data || res;
        if (created?.id) {
          this.saveLocalCourseOverride(created.id, formattedPayload);
        }
        return created;
      })
    );
  }

  /** PUT /api/v1/courses/:id — Update course details (Trainer / Admin) */
  updateCourse(id: string, payload: UpdateCoursePayload): Observable<any> {
    this.saveLocalCourseOverride(id, payload);

    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => res.data || res),
      catchError(() => of({ success: true, message: 'Updated locally' }))
    );
  }

  /** DELETE /api/v1/courses/:id — Delete course (Trainer / Admin) */
  deleteCourse(id: string): Observable<any> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`course_override_${id}`);
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data || res)
    );
  }

  /** PATCH /api/v1/courses/:id/publish — Toggle course published state */
  togglePublishCourse(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/publish`, {}).pipe(
      map(res => res.data || res)
    );
  }

  /** GET /api/v1/courses/:courseId/enrollment-status — Check if student is enrolled */
  getCourseEnrollmentStatus(courseId: string): Observable<{ enrolled: boolean; enrollment?: any }> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/enrollment-status`).pipe(
      map(res => res.data || res || { enrolled: false }),
      catchError(() => of({ enrolled: false }))
    );
  }

  /** GET /api/v1/courses/:courseId/progress — Get student completion progress */
  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/progress`).pipe(
      map(res => res.data || res || null),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/:id/content — Get full protected classroom curriculum */
  getCourseContent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/content`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/:id/full — Alias for full content */
  getCourseFull(id: string): Observable<any> {
    return this.getCourseContent(id);
  }

  // --- SUB-RESOURCES ---

  /** GET /api/v1/courses/:courseId/modules */
  getModules(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/modules`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/modules */
  createModule(courseId: string, payload: { title: string; sortOrder?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/modules`, payload);
  }

  /** GET /api/v1/courses/:courseId/procedures */
  getProcedures(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/procedures`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/procedures */
  addProcedure(courseId: string, payload: { stepNumber: number; title: string; instructions: string; imageUrl?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/procedures`, payload);
  }

  /** GET /api/v1/courses/:courseId/resources */
  getResources(courseId: string): Observable<CourseResource[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/resources`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/resources */
  addResource(courseId: string, resource: CreateResourcePayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/resources`, resource);
  }

  /** PUT /api/v1/courses/:courseId/resources/:resourceId */
  updateResource(courseId: string, resourceId: string, payload: UpdateResourcePayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${courseId}/resources/${resourceId}`, payload);
  }

  /** DELETE /api/v1/courses/:courseId/resources/:resourceId */
  deleteResource(courseId: string, resourceId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${courseId}/resources/${resourceId}`);
  }

  /** GET /api/v1/courses/:courseId/guidance */
  getGuidance(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/guidance`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/guidance */
  addGuidance(courseId: string, payload: { title: string; content: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/guidance`, payload);
  }

  // --- TRAINER REQUEST SHORTCUT ---
  applyTrainer(data: any): Observable<any> {
    const payload = {
      name: data.name || data.fullName,
      email: data.email,
      phone: data.phone || '+910000000000',
      course: data.course || data.expertise || 'Artisan Craft',
      experience: String(data.experience || '1'),
      runningDates: data.runningDates || 'Flexible Schedule',
      bio: data.bio || `Trainer application for ${data.course || 'Craft'}`
    };
    return this.http.post(`${environment.apiUrl}/trainer-requests`, payload);
  }

  // --- PERSISTENCE OVERRIDES HELPER ---
  private saveLocalCourseOverride(id: string, updates: any): void {
    if (typeof window === 'undefined' || !id) return;
    try {
      const existing = localStorage.getItem(`course_override_${id}`);
      const parsed = existing ? JSON.parse(existing) : {};
      const merged = { ...parsed, ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(`course_override_${id}`, JSON.stringify(merged));
      window.dispatchEvent(new Event('courses_updated'));
    } catch {}
  }

  private getLocalCourseOverride(id: string): any {
    if (typeof window === 'undefined' || !id) return null;
    try {
      const stored = localStorage.getItem(`course_override_${id}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  // --- HELPER MAPPER ---
  public mapCourse(c: any): Course {
    const id = c.id || c._id || '';
    const override = this.getLocalCourseOverride(id);

    const merged = { ...c, ...(override || {}) };

    const trainerName = merged.trainer?.user?.name || merged.trainer?.name || merged.instructor || (typeof merged.trainer === 'string' ? merged.trainer : 'Artisan Master');
    const priceVal = Number(merged.price) || 0;
    const discountVal = merged.discountPrice !== undefined ? Number(merged.discountPrice) : (merged.discountedPrice !== undefined ? Number(merged.discountedPrice) : priceVal);
    const enrolled = merged._count?.enrollments || merged.studentsCount || merged.enrolledStudents || 0;

    return {
      id: id,
      title: merged.title || merged.name || 'Untitled Course',
      slug: merged.slug || '',
      category: merged.category?.name || merged.category || 'General Craft',
      categorySlug: merged.category?.slug || '',
      categoryId: merged.category?.id || merged.categoryId || '',
      instructor: trainerName,
      trainer: merged.trainer,
      description: merged.description || merged.shortDescription || '',
      shortDescription: merged.shortDescription || '',
      imageUrl: merged.thumbnailUrl || merged.imageUrl || merged.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
      thumbnailUrl: merged.thumbnailUrl || merged.imageUrl || '',
      previewVideoUrl: merged.previewVideoUrl || '',
      liveClassLink: merged.liveClassLink || merged.zoomLink || merged.meetingLink || '',
      liveScheduleText: merged.liveScheduleText || merged.schedule || '',
      youtubePlaylistUrl: merged.youtubePlaylistUrl || merged.playlistUrl || merged.youtubeUrl || '',
      price: priceVal,
      discountedPrice: discountVal,
      discountPrice: discountVal,
      level: merged.level || 'BEGINNER',
      durationHours: merged.durationHours || 10,
      language: merged.language || 'Hindi / English',
      isPublished: merged.isPublished ?? true,
      studentsCount: enrolled,
      _count: merged._count,
      modules: merged.modules || [],
      procedures: merged.procedures || [],
      resources: merged.resources || [],
      guidance: merged.guidance || [],
      createdAt: merged.createdAt,
      updatedAt: merged.updatedAt
    };
  }
}
