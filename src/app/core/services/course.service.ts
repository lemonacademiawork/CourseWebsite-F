import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../models/course.model';
import { CourseResource, CreateResourcePayload, UpdateResourcePayload } from '../models/common.model';
import { environment } from '../../../environments/environment';

export const CATEGORY_IMAGE_DEFAULTS: Record<string, string> = {
  'soap-making': 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
  'handcrafted-cosmetics': 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=1000',
  'resin-crafts': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
  'resin-art': 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=1000',
  'lippan-art': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000',
  'candle-making': 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1000',
  'pottery': 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&q=80&w=1000',
  'mosaic-art': 'https://images.unsplash.com/photo-1569172122301-bc5007ba0977?auto=format&fit=crop&q=80&w=1000',
  'crochet-fiber-arts': 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=1000'
};

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {
    // Purge any stale local mock/override keys from localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('lemon_deleted_courses');
        const keys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        keys.forEach(k => localStorage.removeItem(k));
      } catch {}
    }
  }

  public clearCatalogCache(): void {
    // Kept for backward compatibility
  }

  public restoreDefaultCourses(): void {
    // Stale/demo courses removed — data comes strictly from backend
  }

  public saveLocalCourseOverride(id: string, updates: any): void {
    // Kept as no-op for backward compatibility
  }

  /** GET /api/v1/courses — Get paginated courses list directly from backend */
  getCoursesPaginated(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    level?: string;
    isPublished?: boolean;
  }): Observable<{
    courses: Course[];
    pagination: { page: number; limit: number; total: number; totalPages: number; hasMore?: boolean };
  }> {
    let httpParams = new HttpParams();
    const page = params?.page || 1;
    const limit = params?.limit || 6;
    httpParams = httpParams.set('page', String(page));
    httpParams = httpParams.set('limit', String(limit));
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.level) httpParams = httpParams.set('level', params.level);
    if (params?.isPublished !== undefined) httpParams = httpParams.set('isPublished', String(params.isPublished));

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(json => {
        const rawData = json?.data || json;
        const apiList = Array.isArray(rawData)
          ? rawData
          : (rawData?.courses || json?.courses || []);
        const mappedList = apiList.map((c: any) => this.mapCourse(c));

        const rawPagination = rawData?.pagination || json?.pagination || {};
        const total = typeof rawPagination.total === 'number' ? rawPagination.total : mappedList.length;
        const totalPages = typeof rawPagination.totalPages === 'number'
          ? rawPagination.totalPages
          : (Math.ceil(total / limit) || 1);
        const hasMore = rawPagination.hasMore !== undefined ? rawPagination.hasMore : page < totalPages;

        return {
          courses: mappedList,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore
          }
        };
      }),
      catchError(err => {
        console.error('Failed to get courses from backend:', err);
        return of({
          courses: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
            hasMore: false
          }
        });
      })
    );
  }

  /** GET /api/v1/courses — Get courses directly from backend */
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
        const rawData = json?.data || json;
        const list = Array.isArray(rawData) ? rawData : (rawData?.courses || json?.courses || []);
        return list.map((c: any) => this.mapCourse(c));
      }),
      catchError(err => {
        console.error('Failed to get courses from backend:', err);
        return of([]);
      })
    );
  }

  /** GET /api/v1/courses/:id — Get course details by ID or slug directly from backend */
  getCourse(id: string): Observable<Course | null> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        const data = res?.data || res;
        if (data && (data.id || data._id)) {
          return this.mapCourse(data);
        }
        return null;
      }),
      catchError(() => {
        const isLikelySlug = !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        if (isLikelySlug) {
          return this.getCourseBySlug(id);
        }
        return of(null);
      })
    );
  }

  /** GET /api/v1/courses/slug/:slug — Get course details by URL slug directly from backend */
  getCourseBySlug(slug: string): Observable<Course | null> {
    return this.http.get<any>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(res => {
        const data = res?.data || res;
        if (data && (data.id || data._id)) {
          return this.mapCourse(data);
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  /** POST /api/v1/courses — Create a new course (Trainer / Admin) */
  createCourse(payload: CreateCoursePayload): Observable<any> {
    const formattedPayload: any = {
      title: payload.title,
      slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: payload.description || payload.shortDescription || `${payload.title} masterclass`,
      shortDescription: payload.shortDescription || payload.description?.slice(0, 120) || `${payload.title} masterclass`,
      price: Number(payload.price) || 0,
      discountPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price || 0),
      discountedPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price || 0),
      level: payload.level || 'BEGINNER',
      durationHours: Number(payload.durationHours) || 1,
      thumbnailUrl: payload.thumbnailUrl || payload.imageUrl || '',
      imageUrl: payload.imageUrl || payload.thumbnailUrl || '',
      previewVideoUrl: payload.previewVideoUrl || null,
      liveClassLink: payload.liveClassLink || null,
      liveScheduleText: payload.liveScheduleText || null,
      youtubePlaylistUrl: payload.youtubePlaylistUrl || null,
      startDate: payload.startDate || null,
      endDate: payload.endDate || null,
      isPublished: payload.isPublished ?? true
    };

    if (payload.categoryId) formattedPayload.categoryId = payload.categoryId;
    if (payload.category) formattedPayload.category = payload.category;
    if (payload.trainerId && payload.trainerId.length > 10) formattedPayload.trainerId = payload.trainerId;
    if (payload.trainer) formattedPayload.trainer = payload.trainer;
    if (payload.instructor) formattedPayload.instructor = payload.instructor;

    return this.http.post<any>(this.apiUrl, formattedPayload).pipe(
      map(res => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('courses_updated'));
        }
        return res?.data || res;
      })
    );
  }

  /** PUT /api/v1/courses/:id — Update existing course */
  updateCourse(id: string, payload: UpdateCoursePayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('courses_updated'));
        }
        return res?.data || res;
      })
    );
  }

  /** DELETE /api/v1/courses/:id — Delete course */
  deleteCourse(id: string, info?: { slug?: string; title?: string }): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('courses_updated'));
        }
        return res?.data || res;
      })
    );
  }

  /** PATCH /api/v1/courses/:id/publish — Toggle course published state */
  togglePublishCourse(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/publish`, {}).pipe(
      map(res => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('courses_updated'));
        }
        return res?.data || res;
      })
    );
  }

  /** GET /api/v1/courses/:courseId/enrollment-status */
  getCourseEnrollmentStatus(courseId: string): Observable<{ enrolled: boolean; enrollment?: any }> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/enrollment-status`).pipe(
      map(res => res?.data || res || { enrolled: false }),
      catchError(() => of({ enrolled: false }))
    );
  }

  /** GET /api/v1/courses/:courseId/progress */
  getCourseProgress(courseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/progress`).pipe(
      map(res => res?.data || res || null),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/:id/content */
  getCourseContent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/content`).pipe(
      map(res => res?.data || res),
      catchError(() => of(null))
    );
  }

  /** GET /api/v1/courses/:id/full */
  getCourseFull(id: string): Observable<any> {
    return this.getCourseContent(id);
  }

  // --- SUB-RESOURCES ---

  /** GET /api/v1/courses/:courseId/modules */
  getModules(courseId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${courseId}/modules`).pipe(
      map(res => res?.data || res || []),
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
      map(res => res?.data || res || []),
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
      map(res => res?.data || res || []),
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
      map(res => res?.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/guidance */
  addGuidance(courseId: string, payload: { title: string; content: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${courseId}/guidance`, payload);
  }

  /** POST /api/v1/trainer-requests */
  applyTrainer(data: any): Observable<any> {
    const craft = data.craftSubject || data.course || data.expertise || 'Artisan Craft';
    const expNum = parseInt(String(data.experienceYears || data.yearsOfExperience || data.experience || 1).replace(/\D/g, ''), 10) || 1;
    const sched = data.proposedSchedule || data.runningDates || 'Flexible Schedule';
    const payload = {
      name: data.name || data.fullName,
      email: data.email,
      phone: data.phone || '+910000000000',
      craftSubject: craft,
      course: craft,
      expertise: craft,
      experience: String(data.experience || expNum),
      experienceYears: expNum,
      yearsOfExperience: expNum,
      proposedSchedule: sched,
      runningDates: sched,
      bio: data.bio || `Trainer application for ${craft}`
    };
    return this.http.post(`${environment.apiUrl}/trainer-requests`, payload);
  }

  // --- HELPER MAPPER ---
  public mapCourse(c: any): Course {
    const id = c.id || c._id || '';
    const trainerName = c.trainer?.user?.name || c.trainer?.name || c.instructor || (typeof c.trainer === 'string' ? c.trainer : 'Artisan Master');
    const priceVal = Number(c.price) || 0;
    const discountVal = c.discountPrice !== undefined ? Number(c.discountPrice) : (c.discountedPrice !== undefined ? Number(c.discountedPrice) : priceVal);
    const enrolled = c._count?.enrollments || c.studentsCount || c.enrolledStudents || 0;

    const rawCat = c.category?.name || c.category || 'Artisan Craft';
    const catSlug = (c.categorySlug || c.category?.slug || rawCat).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    let categoryImg = CATEGORY_IMAGE_DEFAULTS[catSlug] || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=1000';
    const finalImageUrl = c.imageUrl || c.thumbnailUrl || c.previewImage || c.image || categoryImg;
    const finalVideoUrl = c.previewVideoUrl || '';

    return {
      id: id,
      title: c.title || c.name || 'Masterclass',
      slug: c.slug || id,
      category: rawCat,
      categorySlug: catSlug,
      categoryId: c.category?.id || c.categoryId || '',
      instructor: trainerName,
      trainer: c.trainer,
      description: c.description || c.shortDescription || '',
      shortDescription: c.shortDescription || c.description?.slice(0, 160) || '',
      imageUrl: finalImageUrl,
      thumbnailUrl: c.thumbnailUrl || finalImageUrl,
      previewImage: finalImageUrl,
      previewVideoUrl: finalVideoUrl,
      liveClassLink: c.liveClassLink || c.zoomLink || c.meetingLink || '',
      liveScheduleText: c.liveScheduleText || c.schedule || '',
      youtubePlaylistUrl: c.youtubePlaylistUrl || c.playlistUrl || c.youtubeUrl || '',
      price: priceVal,
      discountedPrice: discountVal,
      discountPrice: discountVal,
      level: c.level || 'BEGINNER',
      durationHours: c.durationHours || 1,
      language: c.language || 'Hindi / English',
      isPublished: c.isPublished !== false,
      studentsCount: enrolled,
      _count: c._count,
      startDate: c.startDate || c.start_date || null,
      endDate: c.endDate || c.end_date || null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      modules: c.modules || [],
      procedures: c.procedures || [],
      materialsKitTitle: c.materialsKitTitle,
      materialsKitDescription: c.materialsKitDescription,
      materialsPartnerName: c.materialsPartnerName || 'Lemon House Craft',
      materialsPartnerUrl: c.materialsPartnerUrl || 'https://lemonhousecraft.in',
      materialsList: c.materialsList || [],
      learningObjectives: c.learningObjectives || [],
      curriculumModules: c.curriculumModules || (c.modules ? c.modules.map((m: any) => ({
        title: m.title,
        lessonsCount: m.lessons?.length || 0,
        duration: m.description || '',
        lessons: (m.lessons || []).map((l: any) => ({
          title: l.title,
          duration: l.durationSeconds ? `${Math.round(l.durationSeconds / 60)} min` : (l.duration || '')
        }))
      })) : []),
      reviewsList: c.reviewsList || []
    };
  }
}
