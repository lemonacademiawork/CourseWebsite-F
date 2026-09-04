import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Course, CreateCoursePayload, UpdateCoursePayload } from '../models/course.model';
import { CourseResource, CreateResourcePayload, UpdateResourcePayload, TrainerApplication } from '../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /** GET /api/v1/courses — Get all published courses */
  getCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.apiUrl}/courses`).pipe(
      map(json => {
        const courseList = json.data || json;
        if (Array.isArray(courseList)) {
          return courseList.map((c: any) => ({
            id: c.id || c._id || '',
            title: c.title || c.name || 'Untitled Course',
            slug: c.slug || '',
            category: c.category?.name || c.category || 'General Craft',
            categorySlug: c.category?.slug || '',
            categoryId: c.categoryId || '',
            instructor: c.trainer?.name || c.trainer || 'Instructor',
            description: c.description || '',
            imageUrl: c.thumbnailUrl || c.imageUrl || c.image || c.coverImage || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
            thumbnailUrl: c.thumbnailUrl || '',
            price: c.price || 0,
            discountedPrice: c.discountedPrice || c.price || 0,
            isPublished: c.isPublished ?? true,
            studentsCount: c.studentsCount || c.enrolledStudents || 0
          }));
        }
        return [];
      }),
      catchError(() => of([]))
    );
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
            instructor: c.trainer?.name || c.trainer || 'Instructor',
            description: c.description || '',
            imageUrl: c.thumbnailUrl || c.imageUrl || c.image || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
            thumbnailUrl: c.thumbnailUrl || '',
            price: Number(c.price) || 0,
            discountedPrice: Number(c.discountedPrice) || Number(c.price) || 0,
            isPublished: c.isPublished ?? true,
            studentsCount: c.studentsCount || c.enrolledStudents || 0
          } as Course;
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

  /** GET /api/v1/courses/:id/content — Get full protected course content for enrolled students */
  getCourseContent(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/courses/${id}/content`).pipe(
      map(res => res.data || res),
      catchError(() => of(null))
    );
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
