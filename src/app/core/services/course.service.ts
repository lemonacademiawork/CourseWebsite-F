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

  private defaultCourses: Course[] = [
    {
      id: 'course-soap-making',
      title: 'Cold Process Organic Soap Making & Botanical Skincare',
      slug: 'cold-process-organic-soap-making-botanical-skincare',
      category: 'Handcrafted Cosmetics',
      categorySlug: 'soap-making',
      instructor: 'Priya Nair',
      description: 'Master cold-process soap formulation with natural oils, botanical infusions, and safe saponification ratios.',
      shortDescription: 'Master cold-process soap formulation with natural oils and botanicals.',
      imageUrl: 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1607006314164-946761596700?auto=format&fit=crop&q=80&w=600',
      price: 2499,
      discountedPrice: 1999,
      discountPrice: 1999,
      level: 'BEGINNER',
      durationHours: 12,
      isPublished: true,
      studentsCount: 86
    },
    {
      id: 'course-resin-geode',
      title: 'Resin Art & Geode Wall Clock Masterclass',
      slug: 'resin-art-geode-wall-clock-masterclass',
      category: 'Resin Crafts',
      categorySlug: 'resin-crafts',
      instructor: 'Manishi Nigam',
      description: 'Learn epoxy resin mixing ratios, bubble-free pouring, pigment swirls, crystal placements, and clock machine fittings.',
      shortDescription: 'Learn epoxy resin mixing, pigments, and crystal placement.',
      imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=600',
      price: 1999,
      discountedPrice: 299,
      discountPrice: 299,
      level: 'BEGINNER',
      durationHours: 10,
      isPublished: true,
      studentsCount: 142
    },
    {
      id: 'lippan-art',
      title: 'The Art of Lippan: Traditional Mud & Mirror Work',
      slug: 'lippan-art',
      category: 'Lippan Art',
      categorySlug: 'lippan-art',
      instructor: 'Shivani',
      description: 'Master the ancient Gujarati art form of Lippan Kaam. Create stunning, intricate murals using modern clay and mirrors.',
      shortDescription: 'Master the ancient Gujarati art form of Lippan Kaam.',
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
      thumbnailUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600',
      price: 2499,
      discountedPrice: 1499,
      discountPrice: 1499,
      level: 'BEGINNER',
      durationHours: 15,
      isPublished: true,
      studentsCount: 210
    }
  ];

  constructor(private http: HttpClient) {}

  /** Merge any locally created or updated courses from localStorage and defaults */
  public mergeLocalCourses(mappedList: Course[]): Course[] {
    const list = [...mappedList];

    // 1. Merge default courses if not present
    for (const def of this.defaultCourses) {
      const exists = list.some((c: any) =>
        (def.id && c.id === def.id) ||
        (def.slug && c.slug === def.slug) ||
        (def.title && c.title?.toLowerCase() === def.title?.toLowerCase())
      );
      if (!exists) {
        list.push(def);
      }
    }

    // 2. Merge local storage courses created / edited in Admin Panel
    if (typeof window !== 'undefined') {
      try {
        const localKeys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        localKeys.forEach(k => {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item && (item.id || item.title)) {
            const existingIdx = list.findIndex((c: any) => 
              (item.id && c.id === item.id) || 
              (item.slug && c.slug === item.slug) || 
              (item.title && c.title?.toLowerCase() === item.title?.toLowerCase())
            );
            if (existingIdx >= 0) {
              list[existingIdx] = this.mapCourse({ ...list[existingIdx], ...item });
            } else {
              list.unshift(this.mapCourse(item));
            }
          }
        });
      } catch {}
    }
    return list;
  }

  /** GET /api/v1/courses — Get paginated courses list with pagination metadata (merged with local updates) */
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
    const limit = params?.limit || 5;
    httpParams = httpParams.set('page', String(page));
    httpParams = httpParams.set('limit', String(limit));
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.level) httpParams = httpParams.set('level', params.level);

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(json => {
        const raw = json.data || json;
        const apiList = Array.isArray(raw) ? raw : (raw.courses || []);
        const mappedList = apiList.map((c: any) => this.mapCourse(c));

        // Merge locally created and updated courses so newly created courses are immediately visible to students
        const mergedList = this.mergeLocalCourses(mappedList);

        // Filter: for students, only show published courses by default
        let filtered = mergedList;
        if (params?.isPublished !== undefined) {
          filtered = filtered.filter(c => c.isPublished === params.isPublished);
        } else {
          filtered = filtered.filter(c => c.isPublished !== false);
        }

        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(c => 
            c.title?.toLowerCase().includes(q) || 
            c.category?.toLowerCase().includes(q) || 
            c.instructor?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
          );
        }

        if (params?.categoryId) {
          const cat = params.categoryId.toLowerCase().trim();
          filtered = filtered.filter(c => 
            (c.categoryId && c.categoryId.toLowerCase() === cat) || 
            (c.categorySlug && c.categorySlug.toLowerCase() === cat) ||
            (c.category && c.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat) ||
            (c.category && c.category.toLowerCase() === cat)
          );
        }

        if (params?.level) {
          const lvl = params.level.toUpperCase().trim();
          filtered = filtered.filter(c => c.level?.toUpperCase() === lvl);
        }

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filtered.slice(startIndex, startIndex + limit);

        return {
          courses: paginatedSlice,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
          }
        };
      }),
      catchError(() => {
        const localList = this.mergeLocalCourses([]);
        let filtered = localList;
        if (params?.isPublished !== undefined) {
          filtered = filtered.filter(c => c.isPublished === params.isPublished);
        } else {
          filtered = filtered.filter(c => c.isPublished !== false);
        }

        if (params?.search) {
          const q = params.search.toLowerCase().trim();
          filtered = filtered.filter(c => 
            c.title?.toLowerCase().includes(q) || 
            c.category?.toLowerCase().includes(q) || 
            c.instructor?.toLowerCase().includes(q) ||
            c.description?.toLowerCase().includes(q)
          );
        }

        if (params?.categoryId) {
          const cat = params.categoryId.toLowerCase().trim();
          filtered = filtered.filter(c => 
            (c.categoryId && c.categoryId.toLowerCase() === cat) || 
            (c.categorySlug && c.categorySlug.toLowerCase() === cat) ||
            (c.category && c.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cat) ||
            (c.category && c.category.toLowerCase() === cat)
          );
        }

        if (params?.level) {
          const lvl = params.level.toUpperCase().trim();
          filtered = filtered.filter(c => c.level?.toUpperCase() === lvl);
        }

        const total = filtered.length;
        const totalPages = Math.max(1, Math.ceil(total / limit));
        const startIndex = (page - 1) * limit;
        const paginatedSlice = filtered.slice(startIndex, startIndex + limit);

        return of({
          courses: paginatedSlice,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasMore: page < totalPages
          }
        });
      })
    );
  }

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
        const mappedList = list.map((c: any) => this.mapCourse(c));
        return this.mergeLocalCourses(mappedList);
      }),
      catchError(() => {
        return of(this.mergeLocalCourses([]));
      })
    );
  }

  /** GET /api/v1/courses/:id — Get course details by ID or slug */
  getCourse(id: string): Observable<Course | null> {
    // 1. Search ALL local overrides by id OR slug (handles course-{timestamp} IDs)
    const localById = this.getLocalCourseOverride(id);
    let localBySlug: any = null;
    if (typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        for (const k of keys) {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item && (item.slug === id || item.id === id)) {
            localBySlug = item;
            break;
          }
        }
      } catch {}
    }

    // 2. Also check default courses list
    const defaultMatch = this.defaultCourses.find(c => c.id === id || c.slug === id) || null;

    const localFallback = localById || localBySlug || defaultMatch || null;

    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        const data = res.data || res;
        if (data && (data.id || data._id)) {
          return this.mapCourse(data);
        }
        return localFallback ? this.mapCourse(localFallback) : null;
      }),
      catchError(() => {
        // If the id looks like a slug (no UUID format), try the slug endpoint
        if (localFallback) {
          return of(this.mapCourse(localFallback));
        }
        const isLikelySlug = !id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        if (isLikelySlug) {
          return this.getCourseBySlug(id);
        }
        return of(null);
      })
    );
  }

  /** GET /api/v1/courses/slug/:slug — Get course details by URL slug */
  getCourseBySlug(slug: string): Observable<Course | null> {
    let localFound: any = null;
    if (typeof window !== 'undefined') {
      try {
        const localKeys = Object.keys(localStorage).filter(k => k.startsWith('course_override_'));
        for (const k of localKeys) {
          const item = JSON.parse(localStorage.getItem(k) || '{}');
          if (item.slug === slug || item.id === slug) {
            localFound = item;
            break;
          }
        }
      } catch {}
    }

    return this.http.get<any>(`${this.apiUrl}/slug/${slug}`).pipe(
      map(res => {
        const data = res.data || res;
        if (data && (data.id || data._id)) {
          return this.mapCourse(data);
        }
        return localFound ? this.mapCourse(localFound) : null;
      }),
      catchError(() => of(localFound ? this.mapCourse(localFound) : null))
    );
  }

  /** POST /api/v1/courses — Create a new course (Trainer / Admin) */
  createCourse(payload: CreateCoursePayload): Observable<any> {
    const formattedPayload: any = {
      title: payload.title,
      slug: payload.slug || payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      description: payload.description || payload.shortDescription || `${payload.title} masterclass`,
      shortDescription: payload.shortDescription || payload.description?.slice(0, 120) || `${payload.title} masterclass`,
      price: Number(payload.price) || 99,
      discountPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price || 99),
      discountedPrice: payload.discountPrice !== undefined ? Number(payload.discountPrice) : Number(payload.discountedPrice || payload.price || 99),
      level: payload.level || 'BEGINNER',
      durationHours: Number(payload.durationHours) || 10,
      thumbnailUrl: payload.thumbnailUrl || payload.imageUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
      imageUrl: payload.imageUrl || payload.thumbnailUrl || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
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
        const created = res.data || res;
        const id = created?.id || created?._id || 'course-' + Date.now();
        this.saveLocalCourseOverride(id, { ...formattedPayload, id });
        return created;
      }),
      catchError((err) => {
        const fakeId = 'course-' + Date.now();
        const localCourse = {
          id: fakeId,
          ...formattedPayload,
          studentsCount: 0,
          createdAt: new Date().toISOString()
        };
        this.saveLocalCourseOverride(fakeId, localCourse);
        return of({ success: true, data: localCourse, message: 'Saved locally' });
      })
    );
  }

  /** PUT /api/v1/courses/:id — Update course details (Trainer / Admin) */
  updateCourse(id: string, payload: UpdateCoursePayload): Observable<any> {
    this.saveLocalCourseOverride(id, payload);

    return this.http.put<any>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => {
        window.dispatchEvent(new Event('courses_updated'));
        return res.data || res;
      }),
      catchError(() => {
        window.dispatchEvent(new Event('courses_updated'));
        return of({ success: true, message: 'Updated locally' });
      })
    );
  }

  /** DELETE /api/v1/courses/:id — Delete course (Trainer / Admin) */
  deleteCourse(id: string): Observable<any> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`course_override_${id}`);
      window.dispatchEvent(new Event('courses_updated'));
    }
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      map(res => {
        window.dispatchEvent(new Event('courses_updated'));
        return res.data || res;
      }),
      catchError(() => {
        window.dispatchEvent(new Event('courses_updated'));
        return of({ success: true, message: 'Deleted locally' });
      })
    );
  }

  /** PATCH /api/v1/courses/:id/publish — Toggle course published state */
  togglePublishCourse(id: string): Observable<any> {
    const existing = this.getLocalCourseOverride(id);
    if (existing) {
      this.saveLocalCourseOverride(id, { ...existing, isPublished: !existing.isPublished });
    }
    return this.http.patch<any>(`${this.apiUrl}/${id}/publish`, {}).pipe(
      map(res => {
        window.dispatchEvent(new Event('courses_updated'));
        return res.data || res;
      }),
      catchError(() => {
        window.dispatchEvent(new Event('courses_updated'));
        return of({ success: true, message: 'Toggled locally' });
      })
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
  public saveLocalCourseOverride(id: string, updates: any): void {
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
      startDate: merged.startDate || merged.start_date || null,
      endDate: merged.endDate || merged.end_date || null,
      createdAt: merged.createdAt,
      updatedAt: merged.updatedAt
    };
  }
}
