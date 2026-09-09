import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../../core/services/admin.service';
import { CourseService } from '../../../core/services/course.service';
import { AdminUser, AdminEnrollment } from '../../../core/models/admin.model';
import { Course } from '../../../core/models/course.model';

interface StudentItem {
  id: number | string;
  name: string;
  studentId: string;
  email: string;
  phone: string;
  courseName: string;
  coursesList: string[];
  coursesCount: number;
  joinDate: string;
  status: 'Paid' | 'Pending';
}

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="flex-grow w-full px-margin-mobile md:px-margin-desktop py-6 max-w-[1440px] mx-auto min-h-screen text-xs text-on-surface">
      <header class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 class="text-xl font-bold text-on-surface">Students</h2>
          <p class="text-xs text-on-surface-variant mt-1">Manage student enrollments, registered courses, progress, and account details.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button 
            (click)="isAdding.set(!isAdding())"
            class="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-sm cursor-pointer">
            <span class="material-symbols-outlined text-[16px]">{{ isAdding() ? 'close' : 'add' }}</span>
            {{ isAdding() ? 'Cancel' : 'Add Student' }}
          </button>
        </div>
      </header>

      @if (isAdding()) {
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 mb-6 shadow-sm">
          <h3 class="font-bold text-sm mb-3 text-on-surface">Add New Student</h3>
          <form (ngSubmit)="handleAddStudent()" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            <input 
              type="text" 
              placeholder="Student Name"
              [ngModel]="name()"
              (ngModelChange)="name.set($event)"
              name="name"
              required
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <input 
              type="email" 
              placeholder="Email Address"
              [ngModel]="email()"
              (ngModelChange)="email.set($event)"
              name="email"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <input 
              type="text" 
              placeholder="Phone"
              [ngModel]="phone()"
              (ngModelChange)="phone.set($event)"
              name="phone"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
            />
            <select 
              [ngModel]="selectedCourse()"
              (ngModelChange)="selectedCourse.set($event)"
              name="selectedCourse"
              class="bg-surface-container-low border border-outline-variant/40 rounded-lg p-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none">
              <option value="">-- Select Registered Course --</option>
              @for (c of availableCourses(); track c.id) {
                <option [value]="c.title">{{ c.title }}</option>
              }
              <option value="Lippan Mirror Art">Lippan Mirror Art Masterclass</option>
              <option value="Botanical Candle Making">Hand-Poured Botanical Candle Making</option>
              <option value="Ocean Resin Art">Ocean Resin Art &amp; Liquid Glass</option>
              <option value="Mosaic &amp; Glass Art">Modern Mosaic &amp; Glass Art</option>
              <option value="Pottery Masterclass">Wheel &amp; Hand Pottery Masterclass</option>
              <option value="Crochet &amp; Fiber Arts">Artisan Crochet &amp; Fiber Arts</option>
            </select>
            <button type="submit" class="bg-primary text-on-primary font-semibold rounded-lg py-2 hover:opacity-90 cursor-pointer shadow-xs">
              Save Student
            </button>
          </form>
        </div>
      }

      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
                <th class="py-3.5 px-4">Student</th>
                <th class="py-3.5 px-4">Student ID</th>
                <th class="py-3.5 px-4">Contact</th>
                <th class="py-3.5 px-4">Registered Course</th>
                <th class="py-3.5 px-4">Enrolled Count</th>
                <th class="py-3.5 px-4">Joined Date</th>
                <th class="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/15">
              @for (st of students(); track st.id) {
                <tr class="hover:bg-surface-container-low/50 transition-colors">
                  <td class="py-3.5 px-4 font-semibold text-on-surface">{{ st.name }}</td>
                  <td class="py-3.5 px-4 text-on-surface-variant font-mono text-[11px]">{{ st.studentId }}</td>
                  <td class="py-3.5 px-4 text-on-surface-variant">{{ st.email }}</td>
                  <td class="py-3.5 px-4">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                      <span class="material-symbols-outlined text-[13px]">school</span>
                      <span>{{ st.courseName }}</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-4 font-semibold text-center sm:text-left">{{ st.coursesCount }}</td>
                  <td class="py-3.5 px-4 text-on-surface-variant whitespace-nowrap">{{ st.joinDate }}</td>
                  <td class="py-3.5 px-4">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold inline-block"
                      [class.bg-green-100]="st.status === 'Paid'"
                      [class.text-green-800]="st.status === 'Paid'"
                      [class.bg-yellow-100]="st.status === 'Pending'"
                      [class.text-yellow-800]="st.status === 'Pending'">
                      {{ st.status }}
                    </span>
                  </td>
                </tr>
              }

              @if (students().length === 0 && !isLoading()) {
                <tr>
                  <td colspan="7" class="text-center py-10 text-on-surface-variant">
                    No students registered yet.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </main>
  `
})
export class AdminStudentsComponent implements OnInit {
  private adminService = inject(AdminService);
  private courseService = inject(CourseService);

  students = signal<StudentItem[]>([]);
  availableCourses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  isAdding = signal<boolean>(false);
  name = signal<string>('');
  email = signal<string>('');
  phone = signal<string>('');
  selectedCourse = signal<string>('Lippan Mirror Art');
  status = signal<'Paid' | 'Pending'>('Paid');

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      users: this.adminService.getUsers({ role: 'STUDENT' }),
      enrollments: this.adminService.getEnrollments(),
      courses: this.courseService.getCourses()
    }).subscribe({
      next: ({ users, enrollments, courses }) => {
        this.availableCourses.set(courses || []);

        const courseTitleMap = new Map<string, string>();
        courses.forEach(c => courseTitleMap.set(c.id, c.title));

        const studentCoursesMap = new Map<string, string[]>();

        enrollments.forEach(e => {
          const title = e.course?.title || courseTitleMap.get(e.courseId) || 'Lippan Mirror Art';
          
          if (e.studentId) {
            const list = studentCoursesMap.get(e.studentId) || [];
            if (!list.includes(title)) list.push(title);
            studentCoursesMap.set(e.studentId, list);
          }
          if (e.student?.email) {
            const list = studentCoursesMap.get(e.student.email.toLowerCase()) || [];
            if (!list.includes(title)) list.push(title);
            studentCoursesMap.set(e.student.email.toLowerCase(), list);
          }
        });

        if (users && users.length > 0) {
          const mapped: StudentItem[] = users.map((u: any, i: number) => {
            const registered = studentCoursesMap.get(u.id) 
              || (u.email ? studentCoursesMap.get(u.email.toLowerCase()) : null)
              || (u.enrolledCourses ? (Array.isArray(u.enrolledCourses) ? u.enrolledCourses.map((c: any) => c.title || c) : [u.enrolledCourses]) : null)
              || (u.courseName ? [u.courseName] : null)
              || (u.courses ? (Array.isArray(u.courses) ? u.courses.map((c: any) => c.title || c) : [u.courses]) : null)
              || ['Lippan Mirror Art'];

            const courseName = registered.join(', ') || 'Lippan Mirror Art';

            return {
              id: u.id || i + 1,
              name: u.name || 'Student',
              studentId: `#LA-${u.id ? u.id.substring(0, 4).toUpperCase() : (1000 + i)}`,
              email: u.email,
              phone: u.phone || 'N/A',
              courseName: courseName,
              coursesList: registered,
              coursesCount: registered.length || u.coursesCount || u.enrollmentsCount || 1,
              joinDate: u.createdAt
                ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                : 'Sep 08, 2026',
              status: u.isActive !== false ? 'Paid' : 'Pending'
            };
          });
          this.students.set(mapped);
        } else {
          this.students.set([]);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.students.set([]);
        this.isLoading.set(false);
      }
    });
  }

  handleAddStudent(): void {
    if (!this.name().trim()) return;

    const chosenCourse = this.selectedCourse().trim() || 'Lippan Mirror Art';

    const newStudent: StudentItem = {
      id: Date.now(),
      name: this.name().trim(),
      studentId: `#LA-${Math.floor(1000 + Math.random() * 9000)}`,
      email: this.email().trim() || 'student@example.com',
      phone: this.phone().trim() || 'N/A',
      courseName: chosenCourse,
      coursesList: [chosenCourse],
      coursesCount: 1,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: this.status()
    };

    this.students.update(list => [newStudent, ...list]);
    this.name.set('');
    this.email.set('');
    this.phone.set('');
    this.isAdding.set(false);
  }
}
