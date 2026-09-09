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
      catchError(() => {
        return this.getCourses().pipe(
          map(courses => courses.find(c => c.id === id || c.slug === id || c.categorySlug === id) || null)
        );
      })
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
      previewVideoUrl: payload.previewVideoUrl || null
    };

    if (payload.trainerId) formattedPayload.trainerId = payload.trainerId;
    if (payload.trainer) formattedPayload.trainer = payload.trainer;

    return this.http.post<any>(this.apiUrl, formattedPayload).pipe(
      map(res => res.data || res)
    );
  }

  /** PUT /api/v1/courses/:id — Update course details (Trainer / Admin) */
  updateCourse(id: string, payload: UpdateCoursePayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => res.data || res)
    );
  }

  /** DELETE /api/v1/courses/:id — Delete course (Trainer / Admin) */
  deleteCourse(id: string): Observable<any> {
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

  // --- HELPER MAPPER ---
  private mapCourse(c: any): Course {
    const trainerName = c.trainer?.user?.name || c.trainer?.name || c.instructor || (typeof c.trainer === 'string' ? c.trainer : 'Artisan Master');
    const priceVal = Number(c.price) || 0;
    const discountVal = c.discountPrice !== undefined ? Number(c.discountPrice) : (c.discountedPrice !== undefined ? Number(c.discountedPrice) : priceVal);
    const enrolled = c._count?.enrollments || c.studentsCount || c.enrolledStudents || 0;

    return {
      id: c.id || c._id || '',
      title: c.title || c.name || 'Untitled Course',
      slug: c.slug || '',
      category: c.category?.name || c.category || 'General Craft',
      categorySlug: c.category?.slug || '',
      categoryId: c.category?.id || c.categoryId || '',
      instructor: trainerName,
      trainer: c.trainer,
      description: c.description || c.shortDescription || '',
      shortDescription: c.shortDescription || '',
      imageUrl: c.thumbnailUrl || c.imageUrl || c.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
      thumbnailUrl: c.thumbnailUrl || c.imageUrl || '',
      previewVideoUrl: c.previewVideoUrl || '',
      price: priceVal,
      discountedPrice: discountVal,
      discountPrice: discountVal,
      level: c.level || 'BEGINNER',
      durationHours: c.durationHours || 10,
      language: c.language || 'Hindi / English',
      isPublished: c.isPublished ?? true,
      studentsCount: enrolled,
      _count: c._count,
      modules: c.modules || [],
      procedures: c.procedures || [],
      resources: c.resources || [],
      guidance: c.guidance || [],
      createdAt: c.createdAt,
      updatedAt: c.updatedAt
    };
  }
}
