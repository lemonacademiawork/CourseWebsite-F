import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../models/course.model';
import { CourseResource, CreateResourcePayload, UpdateResourcePayload, TrainerApplication } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses — Get all published courses */
  getCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.apiUrl}/courses`).pipe(
      map(json => {
        const courseList = json.data || json;
        if (Array.isArray(courseList)) {
          return courseList.map((c: any) => ({
            id: c.id || c._id || 'lippan-art',
            title: c.title || c.name || 'Untitled Course',
            slug: c.slug || '',
            category: c.category?.name || c.category || 'General Craft',
            categorySlug: c.category?.slug || '',
            categoryId: c.categoryId || '',
            instructor: c.trainer?.name || c.trainer || 'Guest Instructor',
            description: c.description || '',
            imageUrl: c.thumbnailUrl || c.imageUrl || c.image || c.coverImage || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
            thumbnailUrl: c.thumbnailUrl || '',
            price: c.price || 0,
            discountedPrice: c.discountedPrice || c.price || 0,
            isPublished: c.isPublished ?? true,
            studentsCount: c.studentsCount || c.enrolledStudents || 45
          }));
        }
        return this.getMockCourses();
      }),
      catchError(() => of(this.getMockCourses()))
    );
  }

  getMockCourses(): Course[] {
    return [
      {
        id: 'lippan-art',
        title: 'The Art of Lippan: Traditional Mud & Mirror Work',
        category: 'Lippan Art',
        categorySlug: 'lippan-art',
        instructor: 'Aisha Sharma',
        description: 'Master the ancient Gujarati art form of Lippan Kaam. Create stunning, intricate murals using modern materials while preserving traditional techniques.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaoX0RGxpW-j4nvC1oT1ER7ghQq3LTyffaeKwMP7NUMAKKHqHQmjktmUbyLPagZx6VG0o3H4U157TFiWJGVWKEFwAc3hVXQzqSdHoFy7hC98aHC2EyKFdILSTsnS-EXmaDGklBokg2X7ZOMMcfjaSFDKUhNg6zQecW1g1g1W-aIDWhErsUjb9KT097mpys8RjeuJAbVJ2rMZ7tS10zRVyyf0czkAW4IWUW6sgkOQOPwRiE2EbJHQdA',
        price: 149,
        studentsCount: 124,
        progress: 65,
        lessonsCompleted: 13,
        totalLessons: 20
      },
      {
        id: 'candle-making',
        title: 'Artisanal Candle Making: Botanical Soy & Aroma Blending',
        category: 'Candle Making',
        categorySlug: 'candle-making',
        instructor: 'Chloe Bennett',
        description: 'Learn wax melting, essential oil blending, wick positioning, and botanical embedding to craft luxury scented candles.',
        imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
        price: 179,
        studentsCount: 112
      },
      {
        id: 'resin-art',
        title: 'Ocean Resin Pour & Wave Fluid Art',
        category: 'Resin Art',
        categorySlug: 'resin-art',
        instructor: 'Elena Cruz',
        description: 'Create ultra-glossy ocean tables, trays, and coaster sets with multi-layer pigment swirls and cellular foam effects.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800',
        price: 249,
        studentsCount: 156
      },
      {
        id: 'mosaic-art',
        title: 'Mediterranean Mosaic Tiles & Patterns',
        category: 'Mosaic Art',
        categorySlug: 'mosaic-art',
        instructor: 'Marco Rossi',
        description: 'Learn ancient tile cutting, mortar blending, and geometric tessellation techniques for wall art and decor.',
        imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&q=80&w=800',
        price: 199,
        studentsCount: 88
      },
      {
        id: 'crochet-fiber-arts',
        title: 'Contemporary Crochet & Macramé Wall Hangings',
        category: 'Crochet & Fiber Arts',
        categorySlug: 'crochet-fiber-arts',
        instructor: 'Maya Lin',
        description: 'Explore stitches, yarn textures, tension mastery, and modern bohemian fiber art creations for your living space.',
        imageUrl: 'https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&q=80&w=800',
        price: 139,
        studentsCount: 94
      }
    ];
  }

  /** GET /api/v1/courses/:id — Get course by ID */
  getCourse(id: string): Observable<Course | null> {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}`).pipe(
      map(res => {
        const c = res.data || res;
        if (c && (c.id || c._id)) {
          return {
            id: c.id || c._id,
            title: c.title || 'Untitled Course',
            slug: c.slug || '',
            category: c.category?.name || c.category || 'General Craft',
            categorySlug: c.category?.slug || '',
            categoryId: c.categoryId || '',
            instructor: c.trainer?.name || c.trainer || 'Guest Instructor',
            description: c.description || '',
            imageUrl: c.thumbnailUrl || c.imageUrl || c.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
            thumbnailUrl: c.thumbnailUrl || '',
            price: c.price || 0,
            discountedPrice: c.discountedPrice || c.price || 0,
            isPublished: c.isPublished ?? true,
            studentsCount: c.studentsCount || c.enrolledStudents || 0
          } as Course;
        }
        // Fallback to mock
        const mockMatch = this.getMockCourses().find(mc => mc.id === id || mc.categorySlug === id);
        return mockMatch || this.getMockCourses()[0];
      }),
      catchError(() => {
        const mockMatch = this.getMockCourses().find(c => c.id === id || c.categorySlug === id);
        return of(mockMatch || this.getMockCourses()[0]);
      })
    );
  }

  /** POST /api/v1/courses — Create a new course */
  createCourse(payload: CreateCoursePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses`, payload);
  }

  /** PATCH /api/v1/courses/:id — Update a course */
  updateCourse(id: string, payload: UpdateCoursePayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${id}`, payload);
  }

  /** DELETE /api/v1/courses/:id — Delete a course */
  deleteCourse(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${id}`);
  }

  /** PATCH /api/v1/courses/:id/publish — Toggle publish status */
  togglePublishCourse(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${id}/publish`, {});
  }

  getPurchasedCourses(): Course[] {
    if (typeof window === 'undefined') return [];
    const purchased = localStorage.getItem('purchased_courses');
    if (purchased) {
      try {
        return JSON.parse(purchased);
      } catch {
        return [];
      }
    }
    return [];
  }

  enrollCourse(course: Course): void {
    if (typeof window === 'undefined') return;
    const list = this.getPurchasedCourses();
    if (!list.some(c => c.id === course.id)) {
      list.push(course);
      localStorage.setItem('purchased_courses', JSON.stringify(list));
      window.dispatchEvent(new Event('courses_updated'));
    }
  }

  /** GET /api/v1/courses/:courseId/resources */
  getResources(courseId: string): Observable<CourseResource[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/resources`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  /** POST /api/v1/courses/:courseId/resources */
  addResource(courseId: string, resource: CreateResourcePayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/resources`, resource);
  }

  /** PATCH /api/v1/courses/:courseId/resources/:resourceId */
  updateResource(courseId: string, resourceId: string, payload: UpdateResourcePayload): Observable<any> {
    return this.http.patch(`${this.apiUrl}/courses/${courseId}/resources/${resourceId}`, payload);
  }

  /** DELETE /api/v1/courses/:courseId/resources/:resourceId */
  deleteResource(courseId: string, resourceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/resources/${resourceId}`);
  }

  applyTrainer(data: TrainerApplication): Observable<any> {
    return this.http.post(`${this.apiUrl}/trainers/apply`, data);
  }
}
