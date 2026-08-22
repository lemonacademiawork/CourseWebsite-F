import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Course } from '../models/course.model';
import { CourseResource, TrainerApplication } from '../models/common.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  getCourses(): Observable<Course[]> {
    return this.http.get<any>(`${this.apiUrl}/courses`).pipe(
      map(json => {
        const courseList = json.data || json;
        if (Array.isArray(courseList)) {
          return courseList.map((c: any) => ({
            id: c.id || c._id || 'lippan-art',
            title: c.title || c.name || 'Untitled Course',
            category: c.category?.name || c.category || 'General Craft',
            categorySlug: c.category?.slug || '',
            instructor: c.trainer?.name || c.trainer || 'Guest Instructor',
            description: c.description || '',
            imageUrl: c.thumbnailUrl || c.imageUrl || c.image || c.coverImage || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
            price: c.discountedPrice || c.price || 0,
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
        id: 'mosaic-art',
        title: 'Mediterranean Mosaic Tiles & Patterns',
        category: 'Mosaic Art',
        categorySlug: 'mosaic-art',
        instructor: 'Marco Rossi',
        description: 'Learn ancient tile cutting, mortar blending, and geometric tessellation techniques for wall art and decor.',
        imageUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff',
        price: 199,
        studentsCount: 88
      },
      {
        id: 'resin-art',
        title: 'Ocean Resin Pour & Wave Effects',
        category: 'Resin Art',
        categorySlug: 'resin-art',
        instructor: 'Elena Cruz',
        description: 'Create ultra-glossy ocean tables, trays, and coaster sets with multi-layer pigment swirls and cellular foam effects.',
        imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675',
        price: 249,
        studentsCount: 156
      }
    ];
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

  getResources(courseId: string): Observable<CourseResource[]> {
    return this.http.get<any>(`${this.apiUrl}/courses/${courseId}/resources`).pipe(
      map(res => res.data || res || []),
      catchError(() => of([]))
    );
  }

  addResource(courseId: string, resource: { title: string; type: string; fileUrl: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/courses/${courseId}/resources`, resource);
  }

  deleteResource(courseId: string, resourceId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/courses/${courseId}/resources/${resourceId}`);
  }

  applyTrainer(data: TrainerApplication): Observable<any> {
    return this.http.post(`${this.apiUrl}/trainers/apply`, data);
  }
}
