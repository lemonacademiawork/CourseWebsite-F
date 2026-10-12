import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TrainerService } from '../../../core/services/trainer.service';
import { CourseService } from '../../../core/services/course.service';
import { AdminService } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { TrainerStudent } from '../../../core/models/trainer.model';
import { Course } from '../../../core/models/course.model';
import { AdminEnrollment, AdminUser } from '../../../core/models/admin.model';

import { ClassProgressService } from '../../../core/services/class-progress.service';

export interface EnrolledStudentView {
  id: string;
  name: string;
  email: string;
  phone?: string;
  courseId: string;
  courseTitle: string;
  courseCategory?: string;
  progress: number;
  completedClassesCount: number;
  totalClassesCount: number;
  certificateStatus: 'IN_PROGRESS' | 'ELIGIBLE' | 'ISSUED';
  status: 'Active' | 'Completed' | 'Pending';
  enrolledAt: string;
}

@Component({
  selector: 'app-trainer-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold text-on-surface flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-2xl">groups</span>
            Course Enrolled Students
          </h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Track and monitor students actively enrolled in your workshops and masterclasses.
          </p>
        </div>
        <button 
          (click)="loadData()"
          class="bg-surface-container-high hover:bg-surface-variant text-on-surface font-semibold px-3.5 py-2 rounded-lg border border-outline-variant/30 flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all">
          <span class="material-symbols-outlined text-sm">refresh</span>
          Refresh
        </button>
      </div>

      <!-- Overview Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-2xs flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">group</span>
          </div>
          <div>
            <span class="text-[11px] text-on-surface-variant font-medium block">Total Enrolled</span>
            <span class="text-lg font-bold text-on-surface">{{ students().length }}</span>
          </div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-2xs flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-green-100 text-green-800 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">school</span>
          </div>
          <div>
            <span class="text-[11px] text-on-surface-variant font-medium block">Active Learners</span>
            <span class="text-lg font-bold text-green-700">{{ activeLearnersCount() }}</span>
          </div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-2xs flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">workspace_premium</span>
          </div>
          <div>
            <span class="text-[11px] text-on-surface-variant font-medium block">Certificate Eligible (100%)</span>
            <span class="text-lg font-bold text-emerald-700">{{ eligibleStudentsCount() }}</span>
          </div>
        </div>

        <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-xl p-4 shadow-2xs flex items-center gap-3.5">
          <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <span class="material-symbols-outlined text-xl">trending_up</span>
          </div>
          <div>
            <span class="text-[11px] text-on-surface-variant font-medium block">Avg Workshop Progress</span>
            <span class="text-lg font-bold text-amber-700">{{ avgProgress() }}%</span>
          </div>
        </div>
      </div>

      <!-- Search & Filter Controls -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
        <div class="relative w-full sm:w-80">
          <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            placeholder="Search student, email, or course..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <!-- Eligibility Filter Buttons -->
          <div class="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/30 text-xs">
            <button 
              (click)="completionFilter.set('ALL')"
              [class.bg-primary]="completionFilter() === 'ALL'"
              [class.text-on-primary]="completionFilter() === 'ALL'"
              [class.text-on-surface-variant]="completionFilter() !== 'ALL'"
              class="px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer transition">
              All ({{ students().length }})
            </button>
            <button 
              (click)="completionFilter.set('ELIGIBLE')"
              [class.bg-emerald-700]="completionFilter() === 'ELIGIBLE'"
              [class.text-white]="completionFilter() === 'ELIGIBLE'"
              [class.text-on-surface-variant]="completionFilter() !== 'ELIGIBLE'"
              class="px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer transition">
              100% Eligible ({{ eligibleStudentsCount() }})
            </button>
            <button 
              (click)="completionFilter.set('IN_PROGRESS')"
              [class.bg-amber-700]="completionFilter() === 'IN_PROGRESS'"
              [class.text-white]="completionFilter() === 'IN_PROGRESS'"
              [class.text-on-surface-variant]="completionFilter() !== 'IN_PROGRESS'"
              class="px-2.5 py-1 rounded-md font-semibold text-[11px] cursor-pointer transition">
              In Progress
            </button>
          </div>

          <select 
            [ngModel]="selectedCourseFilter()" 
            (ngModelChange)="selectedCourseFilter.set($event)"
            class="bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary">
            <option value="">All Assigned Workshops</option>
            @for (course of assignedCourses(); track course.id) {
              <option [value]="course.title">{{ course.title }}</option>
            }
          </select>
        </div>
      </div>

      <!-- Enrolled Students Table -->
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/35 shadow-sm overflow-hidden">
        <div class="w-full overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold text-[11px]">
                <th class="py-3 px-4">Student</th>
                <th class="py-3 px-4">Email</th>
                <th class="py-3 px-4">Enrolled Course</th>
                <th class="py-3 px-4">Required Classes Progress</th>
                <th class="py-3 px-4">Certificate Status</th>
                <th class="py-3 px-4">Enrolled At</th>
                <th class="py-3 px-4">Enrollment</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-outline-variant/15 text-xs">
              @for (st of filteredStudents(); track st.id + '-' + st.courseId) {
                <tr class="hover:bg-surface-container-low/50 transition-colors">
                  <!-- Student Avatar & Name -->
                  <td class="py-3.5 px-4">
                    <div class="flex items-center gap-2.5">
                      <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center justify-center text-xs shrink-0">
                        {{ (st.name || 'Student')[0].toUpperCase() }}
                      </div>
                      <div>
                        <span class="font-bold text-xs text-on-surface block">{{ st.name }}</span>
                        @if (st.phone) {
                          <span class="text-[10px] text-on-surface-variant font-mono">{{ st.phone }}</span>
                        }
                      </div>
                    </div>
                  </td>

                  <!-- Student Email -->
                  <td class="py-3.5 px-4 text-on-surface-variant font-medium">
                    {{ st.email }}
                  </td>

                  <!-- Enrolled Course with Badge -->
                  <td class="py-3.5 px-4">
                    <div class="space-y-0.5">
                      <span class="font-bold text-xs text-primary block line-clamp-1">{{ st.courseTitle }}</span>
                      @if (st.courseCategory) {
                        <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-surface-container-high text-on-surface-variant uppercase tracking-wider">
                          {{ st.courseCategory }}
                        </span>
                      }
                    </div>
                  </td>

                  <!-- Required Classes Progress Bar & Count -->
                  <td class="py-3.5 px-4">
                    <div class="w-40 space-y-1">
                      <div class="flex justify-between items-center text-[10px]">
                        <span class="font-bold text-on-surface">{{ st.completedClassesCount || 0 }}/{{ st.totalClassesCount || 0 }} Classes</span>
                        <span class="font-bold" [class.text-emerald-700]="st.progress >= 100" [class.text-primary]="st.progress < 100">
                          {{ st.progress }}%
                        </span>
                      </div>
                      <div class="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all"
                          [class.bg-emerald-600]="st.progress >= 100"
                          [class.bg-primary]="st.progress < 100"
                          [style.width.%]="st.progress">
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Certificate Status Badge -->
                  <td class="py-3.5 px-4">
                    @if (st.progress >= 100) {
                      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span class="material-symbols-outlined text-xs">workspace_premium</span>
                        Eligible for Certificate
                      </span>
                    } @else {
                      <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                        <span class="material-symbols-outlined text-xs">pending</span>
                        In Progress ({{ (st.totalClassesCount || 4) - (st.completedClassesCount || 0) }} Left)
                      </span>
                    }
                  </td>

                  <!-- Enrolled Date -->
                  <td class="py-3.5 px-4 text-[11px] text-on-surface-variant">
                    {{ st.enrolledAt ? (st.enrolledAt | date:'mediumDate') : 'Recently Enrolled' }}
                  </td>

                  <!-- Status Badge -->
                  <td class="py-3.5 px-4">
                    <span 
                      class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                      [class.bg-green-100]="st.status === 'Active' || st.status === 'Completed'"
                      [class.text-green-800]="st.status === 'Active' || st.status === 'Completed'"
                      [class.bg-yellow-100]="st.status === 'Pending'"
                      [class.text-yellow-800]="st.status === 'Pending'">
                      {{ st.status }}
                    </span>
                  </td>
                </tr>
              }

              @if (isLoading()) {
                <tr>
                  <td colspan="7" class="py-10 text-center text-on-surface-variant">
                    <span class="material-symbols-outlined animate-spin text-xl inline-block mr-2 align-middle">progress_activity</span>
                    Loading enrolled students and class progress...
                  </td>
                </tr>
              } @else if (filteredStudents().length === 0) {
                <tr>
                  <td colspan="7" class="p-12 text-center text-on-surface-variant bg-surface-container-low/40">
                    <span class="material-symbols-outlined text-primary text-4xl mb-2">school</span>
                    <h3 class="font-bold text-sm text-on-surface">No enrolled course students found</h3>
                    <p class="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
                      {{ searchQuery() || selectedCourseFilter() ? 'Try changing your search query or course filter.' : 'When students enroll in your workshops, their profiles and learning progress will appear here.' }}
                    </p>
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
export class TrainerStudentsComponent implements OnInit, OnDestroy {
  private trainerService = inject(TrainerService);
  private courseService = inject(CourseService);
  private adminService = inject(AdminService);
  public authService = inject(AuthService);
  private classProgressService = inject(ClassProgressService);

  students = signal<EnrolledStudentView[]>([]);
  assignedCourses = signal<Course[]>([]);
  isLoading = signal<boolean>(true);

  searchQuery = signal<string>('');
  selectedCourseFilter = signal<string>('');
  completionFilter = signal<'ALL' | 'ELIGIBLE' | 'IN_PROGRESS'>('ALL');

  activeLearnersCount = computed(() => this.students().filter(s => s.status === 'Active' || s.progress > 0).length);
  eligibleStudentsCount = computed(() => this.students().filter(s => s.progress >= 100).length);
  avgProgress = computed(() => {
    const list = this.students();
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, s) => acc + (s.progress || 0), 0);
    return Math.round(sum / list.length);
  });

  filteredStudents = computed(() => {
    let list = this.students();
    const q = this.searchQuery().trim().toLowerCase();
    const courseFilter = this.selectedCourseFilter().trim().toLowerCase();
    const compFilter = this.completionFilter();

    if (compFilter === 'ELIGIBLE') {
      list = list.filter(s => s.progress >= 100);
    } else if (compFilter === 'IN_PROGRESS') {
      list = list.filter(s => s.progress < 100);
    }

    if (courseFilter) {
      list = list.filter(s => s.courseTitle.toLowerCase().includes(courseFilter));
    }

    if (q) {
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.email.toLowerCase().includes(q) || 
        s.courseTitle.toLowerCase().includes(q)
      );
    }

    return list;
  });

  private syncListener = () => this.loadData();

  ngOnInit(): void {
    this.loadData();
    if (typeof window !== 'undefined') {
      window.addEventListener('class_completion_updated', this.syncListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('class_completion_updated', this.syncListener);
    }
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      trainerStudents: this.trainerService.getTrainerStudents(),
      courses: this.courseService.getCourses(),
      enrollments: this.adminService.getEnrollments(),
      users: this.adminService.getUsers({ role: 'STUDENT' })
    }).subscribe({
      next: ({ trainerStudents, courses, enrollments, users }) => {
        const currentName = (this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || '').trim().toLowerCase();
        const currentEmail = (this.authService.userEmail() || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : '') || '').trim().toLowerCase();

        // 1. Identify courses assigned to this trainer
        const matchedCourses = courses.filter(c => {
          const trAny = c.trainer as any;
          const inst = (c.instructor || '').toLowerCase();
          const trObjName = (typeof trAny === 'string' ? trAny : trAny?.name || trAny?.user?.name || '').toLowerCase();
          const trEmail = (trAny?.email || trAny?.user?.email || '').toLowerCase();

          if (!currentName || currentName === 'user') return true;

          return (
            inst.includes(currentName) || 
            currentName.includes(inst) ||
            trObjName.includes(currentName) ||
            currentName.includes(trObjName) ||
            (currentEmail && trEmail && trEmail === currentEmail)
          );
        });

        const activeTrainerCourses = matchedCourses.length > 0 ? matchedCourses : courses;
        this.assignedCourses.set(activeTrainerCourses);

        const courseIds = new Set(activeTrainerCourses.map(c => c.id));
        const courseMap = new Map<string, Course>();
        courses.forEach(c => courseMap.set(c.id, c));

        const userMap = new Map<string, AdminUser>();
        users.forEach(u => userMap.set(u.id, u));

        // 2. Build mapped list of enrolled students
        const results: EnrolledStudentView[] = [];

        // Add from enrollments API
        if (enrollments && enrollments.length > 0) {
          enrollments.forEach(en => {
            const enAny = en as any;
            const cId = en.courseId || en.course?.id || '';
            // If course is among trainer's courses
            if (!courseIds.has(cId) && activeTrainerCourses.length > 0 && courseIds.size > 0) {
              return;
            }

            const courseObj = (courseMap.get(cId) || en.course) as any;
            const studentObj = (userMap.get(en.studentId) || en.student) as any;

            const totalClasses = courseObj?.totalLessons || (courseObj?.modules ? courseObj.modules.length : 4);
            const completedClassIds = this.classProgressService.getCompletedClassIds(cId);
            const authCompletedCount = completedClassIds.length;
            const backendCompleted = enAny.lessonsCompleted || enAny.completedLessons || 0;
            const finalCompleted = Math.min(Math.max(authCompletedCount, backendCompleted), totalClasses);
            const progress = this.classProgressService.calculateProgress(totalClasses, finalCompleted);
            const certificateStatus = progress >= 100 ? 'ELIGIBLE' : 'IN_PROGRESS';

            results.push({
              id: en.id || en.studentId || `en_${Math.random()}`,
              name: studentObj?.name || studentObj?.fullName || 'Artisan Student',
              email: studentObj?.email || 'student@lemonacademia.com',
              phone: studentObj?.phone || studentObj?.phoneNumber || '',
              courseId: cId,
              courseTitle: courseObj?.title || enAny.courseTitle || 'Masterclass Workshop',
              courseCategory: courseObj?.category || 'Craft Workshop',
              progress,
              completedClassesCount: finalCompleted,
              totalClassesCount: totalClasses,
              certificateStatus,
              status: en.status === 'ACTIVE' ? 'Active' : 'Active',
              enrolledAt: en.createdAt || enAny.enrolledAt || new Date().toISOString()
            });
          });
        }

        // Add from trainer students API if not duplicated
        if (trainerStudents && trainerStudents.length > 0) {
          trainerStudents.forEach(st => {
            const stAny = st as any;
            const alreadyIn = results.some(r => r.email === st.email || r.id === st.id);
            if (!alreadyIn) {
              const cId = stAny.courseId || 'lippan-art';
              const totalClasses = 4;
              const completedClassIds = this.classProgressService.getCompletedClassIds(cId);
              const authCompleted = completedClassIds.length;
              const backendCompleted = stAny.completedLessons || (st.progress ? Math.round((st.progress / 100) * totalClasses) : 0);
              const finalCompleted = Math.min(Math.max(authCompleted, backendCompleted), totalClasses);
              const progress = this.classProgressService.calculateProgress(totalClasses, finalCompleted);
              const certificateStatus = progress >= 100 ? 'ELIGIBLE' : 'IN_PROGRESS';

              results.push({
                id: st.id || `st_${Math.random()}`,
                name: st.name || 'Artisan Student',
                email: st.email || '',
                phone: stAny.phone || '',
                courseId: cId,
                courseTitle: st.course || st.courseTitle || 'The Art of Lippan Kaam',
                courseCategory: stAny.category || 'Lippan Art',
                progress,
                completedClassesCount: finalCompleted,
                totalClassesCount: totalClasses,
                certificateStatus,
                status: 'Active',
                enrolledAt: st.enrolledAt || stAny.createdAt || new Date().toISOString()
              });
            }
          });
        }

        this.students.set(results);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}

