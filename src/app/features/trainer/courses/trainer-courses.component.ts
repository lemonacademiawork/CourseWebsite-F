import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TrainerService } from '../../../core/services/trainer.service';
import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { LessonService } from '../../../core/services/lesson.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';
import { CourseModule } from '../../../core/models/module.model';
import { Lesson } from '../../../core/models/lesson.model';

@Component({
  selector: 'app-trainer-courses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <main class="p-6 max-w-container-max mx-auto text-xs text-on-surface min-h-screen">
      
      <!-- Header with Trainer Welcome -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-surface-variant/30 pb-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">verified</span>
              Trainer Studio
            </span>
            <span class="text-on-surface-variant font-medium text-xs">Instructor: {{ authService.userName() || 'Trainer' }}</span>
          </div>
          <h1 class="text-xl font-bold text-on-surface">Assigned Masterclasses &amp; Curricula</h1>
          <p class="text-xs text-on-surface-variant mt-0.5">
            Manage your teaching workshops, host live Zoom sessions, and review student progress.
          </p>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 shrink-0">
          <button 
            (click)="activeTab.set('assigned')"
            [class.bg-primary]="activeTab() === 'assigned'"
            [class.text-on-primary]="activeTab() === 'assigned'"
            [class.text-on-surface-variant]="activeTab() !== 'assigned'"
            class="px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-sm">assignment_ind</span>
            <span>Assigned to Me ({{ assignedCourses().length }})</span>
          </button>
          
          <button 
            (click)="activeTab.set('all')"
            [class.bg-primary]="activeTab() === 'all'"
            [class.text-on-primary]="activeTab() === 'all'"
            [class.text-on-surface-variant]="activeTab() !== 'all'"
            class="px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs">
            <span class="material-symbols-outlined text-sm">school</span>
            <span>All Studio Courses ({{ allCourses().length }})</span>
          </button>
        </div>
      </div>

      <!-- Quick Stats Banner -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div class="p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Assigned Courses</span>
            <span class="text-lg font-bold text-on-surface">{{ assignedCourses().length }}</span>
          </div>
          <div class="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">school</span>
          </div>
        </div>

        <div class="p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Total Students</span>
            <span class="text-lg font-bold text-on-surface">{{ totalStudentsCount() }} Enrolled</span>
          </div>
          <div class="w-9 h-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">groups</span>
          </div>
        </div>

        <div class="p-3.5 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xs flex items-center justify-between">
          <div>
            <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Live Zoom Classes</span>
            <span class="text-lg font-bold text-blue-600">{{ liveClassesCount() }} Scheduled</span>
          </div>
          <div class="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <span class="material-symbols-outlined text-lg">videocam</span>
          </div>
        </div>
      </div>

      <!-- Courses Grid -->
      @if (displayedCourses().length === 0) {
        <div class="text-center py-16 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 space-y-3">
          <span class="material-symbols-outlined text-primary text-4xl">school</span>
          <div class="max-w-sm mx-auto space-y-1">
            <h3 class="font-bold text-sm text-on-surface">No Courses Found in this View</h3>
            <p class="text-xs text-on-surface-variant">
              {{ activeTab() === 'assigned' ? 'You currently do not have courses assigned under your exact name. Click "All Studio Courses" above to view and teach any craft masterclass.' : 'No masterclasses found.' }}
            </p>
          </div>
          @if (activeTab() === 'assigned') {
            <button 
              (click)="activeTab.set('all')"
              class="px-4 py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 inline-flex items-center gap-1.5 shadow-sm text-xs cursor-pointer">
              <span class="material-symbols-outlined text-sm">visibility</span>
              <span>View All Studio Courses</span>
            </button>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (course of displayedCourses(); track course.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/35 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-outline-variant/60 transition-all duration-200 flex flex-col justify-between group">
              
              <!-- Banner Image & Badges -->
              <div class="h-44 bg-surface-container-low relative overflow-hidden">
                <img [src]="course.imageUrl || course.thumbnailUrl" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <!-- Category Tag -->
                <span class="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  {{ course.category }}
                </span>

                <!-- Assigned To You Tag -->
                @if (isAssignedToMe(course)) {
                  <span class="absolute top-3 right-3 bg-green-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span class="material-symbols-outlined text-xs">star</span>
                    Assigned to You
                  </span>
                }
              </div>

              <!-- Card Details -->
              <div class="p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div class="space-y-2">
                  <h3 class="font-bold text-sm text-on-surface leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {{ course.title }}
                  </h3>
                  @if (course.startDate || course.endDate) {
                    <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                      <span class="material-symbols-outlined text-[12px]">calendar_month</span>
                      Batch: {{ formatDateRange(course.startDate, course.endDate) }}
                    </div>
                  }
                  <p class="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {{ course.description || 'Hands-on masterclass curriculum with live guidance and structured video tutorials.' }}
                  </p>
                </div>

                <div class="space-y-2 pt-2 border-t border-outline-variant/20">
                  <!-- Instructor & Enrolled Students -->
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-on-surface-variant flex items-center gap-1">
                      <span class="material-symbols-outlined text-xs">person</span>
                      <strong>Instructor:</strong> {{ course.instructor }}
                    </span>
                    <span class="text-primary font-bold">
                      Rs. {{ course.price }}
                    </span>
                  </div>

                  <!-- Live Zoom / YouTube Links Info -->
                  <div class="flex flex-wrap items-center gap-1.5 text-[10px]">
                    @if (course.liveClassLink) {
                      <span class="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-0.5" title="Live Zoom link configured">
                        <span class="material-symbols-outlined text-[11px]">videocam</span>
                        Live Class
                      </span>
                    }
                    @if (course.youtubePlaylistUrl) {
                      <span class="bg-red-50 text-red-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-0.5" title="YouTube Playlist connected">
                        <span class="material-symbols-outlined text-[11px]">smart_display</span>
                        YouTube
                      </span>
                    }
                    <span class="bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md font-medium flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[11px]">groups</span>
                      {{ course.studentsCount || 0 }} Students
                    </span>
                  </div>
                </div>
              </div>

              <!-- Action Bar -->
              <div class="p-3 bg-surface-container-low/70 border-t border-outline-variant/20 flex flex-wrap gap-2">
                @if (course.liveClassLink) {
                  <a 
                    [href]="course.liveClassLink" 
                    target="_blank"
                    class="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs">
                    <span class="material-symbols-outlined text-sm">videocam</span>
                    <span>Host Live Class</span>
                  </a>
                } @else {
                  <a 
                    routerLink="/trainer/classes" 
                    class="flex-1 text-center py-2 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 text-xs flex items-center justify-center gap-1 transition-opacity shadow-2xs">
                    <span class="material-symbols-outlined text-sm">calendar_month</span>
                    <span>Schedule Class</span>
                  </a>
                }

                <button 
                  (click)="openCurriculumDrawer(course)"
                  class="flex-1 text-center py-2 bg-surface-container-highest text-on-surface hover:bg-surface-dim font-bold rounded-lg text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer border border-outline-variant/30">
                  <span class="material-symbols-outlined text-sm text-primary">play_lesson</span>
                  <span>Curriculum</span>
                </button>
              </div>

            </div>
          }
        </div>
      }

      <!-- CURRICULUM & DETAILS DRAWER FOR TRAINER -->
      @if (selectedCourseForCurriculum()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl max-w-2xl w-full border border-outline-variant/30 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto p-6">
            
            <div class="flex justify-between items-start border-b border-outline-variant/20 pb-3">
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <span class="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {{ selectedCourseForCurriculum()?.category }}
                  </span>
                  @if (isAssignedToMe(selectedCourseForCurriculum()!)) {
                    <span class="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Taught by You
                    </span>
                  }
                </div>
                <h2 class="font-bold text-base text-on-surface">{{ selectedCourseForCurriculum()?.title }}</h2>
                <p class="text-[11px] text-on-surface-variant">Instructor: {{ selectedCourseForCurriculum()?.instructor }}</p>
              </div>
              <button (click)="closeCurriculumDrawer()" class="text-on-surface-variant hover:text-on-surface p-1 cursor-pointer">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Live Zoom Link Launch Banner -->
            @if (selectedCourseForCurriculum()?.liveClassLink) {
              <div class="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl space-y-2">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-blue-800 font-bold text-xs">
                    <span class="material-symbols-outlined text-sm">videocam</span>
                    <span>Live Interactive Meeting Link</span>
                  </div>
                  <a 
                    [href]="selectedCourseForCurriculum()?.liveClassLink" 
                    target="_blank" 
                    class="px-3 py-1 bg-blue-600 text-white rounded-md font-bold text-xs hover:bg-blue-700 flex items-center gap-1 shadow-2xs">
                    <span>Launch Room</span>
                    <span class="material-symbols-outlined text-xs">open_in_new</span>
                  </a>
                </div>
                <p class="text-[11px] text-blue-700 font-mono truncate">{{ selectedCourseForCurriculum()?.liveClassLink }}</p>
                @if (selectedCourseForCurriculum()?.liveScheduleText) {
                  <p class="text-[11px] text-blue-900 font-semibold italic">Timing: {{ selectedCourseForCurriculum()?.liveScheduleText }}</p>
                }
              </div>
            }

            <!-- Curriculum Modules & Lessons -->
            <div class="space-y-3">
              <h4 class="font-bold text-xs text-on-surface flex items-center gap-1.5">
                <span class="material-symbols-outlined text-primary text-sm">video_library</span>
                Curriculum Modules &amp; Video Lessons ({{ courseModules().length }} Modules)
              </h4>

              @if (isLoadingCurriculum()) {
                <div class="py-8 flex flex-col items-center justify-center space-y-1">
                  <span class="material-symbols-outlined text-primary text-2xl animate-spin">progress_activity</span>
                  <span class="text-xs text-on-surface-variant">Loading lesson structure...</span>
                </div>
              } @else if (courseModules().length === 0) {
                <div class="py-6 text-center bg-surface-container-low rounded-xl border border-outline-variant/30 text-xs text-on-surface-variant">
                  No modules defined yet for this curriculum.
                </div>
              } @else {
                <div class="space-y-3">
                  @for (mod of courseModules(); track mod.id) {
                    <div class="bg-surface-container-low/70 rounded-xl border border-outline-variant/25 p-3.5 space-y-2">
                      <div class="flex justify-between items-center">
                        <span class="font-bold text-xs text-on-surface flex items-center gap-1.5">
                          <span class="material-symbols-outlined text-primary text-xs">folder</span>
                          {{ mod.title }}
                        </span>
                        <span class="text-[10px] text-on-surface-variant bg-surface-container-high px-2 py-0.2 rounded-full font-medium">
                          {{ (moduleLessonsMap()[mod.id] || []).length }} Lessons
                        </span>
                      </div>

                      <div class="space-y-1.5 pl-2 border-l-2 border-primary/30">
                        @for (les of (moduleLessonsMap()[mod.id] || []); track les.id) {
                          <div class="flex items-center justify-between text-[11px] py-1 text-on-surface-variant">
                            <span class="font-medium text-on-surface flex items-center gap-1">
                              <span class="material-symbols-outlined text-xs text-primary">play_circle</span>
                              {{ les.orderIndex || 1 }}. {{ les.title }}
                            </span>
                            <span class="text-[10px] font-mono">{{ formatDuration(les.durationSeconds) }}</span>
                          </div>
                        }
                        @if ((moduleLessonsMap()[mod.id] || []).length === 0) {
                          <p class="text-[10px] text-on-surface-variant italic py-1">No lessons in this module yet.</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="flex justify-end pt-3 border-t border-outline-variant/20">
              <button 
                (click)="closeCurriculumDrawer()" 
                class="px-4 py-2 bg-surface-container-highest text-on-surface font-semibold rounded-lg hover:bg-surface-dim text-xs cursor-pointer">
                Close
              </button>
            </div>

          </div>
        </div>
      }

    </main>
  `
})
export class TrainerCoursesComponent implements OnInit, OnDestroy {
  private trainerService = inject(TrainerService);
  private courseService = inject(CourseService);
  private moduleService = inject(ModuleService);
  private lessonService = inject(LessonService);
  authService = inject(AuthService);

  allCourses = signal<Course[]>([]);
  assignedCourses = signal<Course[]>([]);
  activeTab = signal<'assigned' | 'all'>('assigned');

  // Curriculum Drawer states
  selectedCourseForCurriculum = signal<Course | null>(null);
  courseModules = signal<CourseModule[]>([]);
  moduleLessonsMap = signal<Record<string, Lesson[]>>({});
  isLoadingCurriculum = signal<boolean>(false);

  private refreshHandler = () => this.loadCourses();

  ngOnInit(): void {
    this.loadCourses();
    if (typeof window !== 'undefined') {
      window.addEventListener('courses_updated', this.refreshHandler);
      window.addEventListener('storage', this.refreshHandler);
      window.addEventListener('focus', this.refreshHandler);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('courses_updated', this.refreshHandler);
      window.removeEventListener('storage', this.refreshHandler);
      window.removeEventListener('focus', this.refreshHandler);
    }
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (all) => {
        this.allCourses.set(all || []);
        
        const currentName = (this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || '').trim().toLowerCase();
        const currentEmail = (this.authService.userEmail() || (typeof window !== 'undefined' ? localStorage.getItem('user_email') : '') || '').trim().toLowerCase();

        // Match courses where instructor/trainer name or email matches
        const matched = all.filter(c => {
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

        // If specific matches found, set them. If none matched and trainer is viewing, fall back to all courses so nothing is hidden.
        this.assignedCourses.set(matched.length > 0 ? matched : all);

        // Also check if backend provides specific trainer courses
        this.trainerService.getTrainerCourses().subscribe({
          next: (backendCourses) => {
            if (backendCourses && backendCourses.length > 0) {
              this.assignedCourses.set(backendCourses);
            }
          }
        });
      },
      error: () => {
        this.allCourses.set([]);
        this.assignedCourses.set([]);
      }
    });
  }

  displayedCourses(): Course[] {
    return this.activeTab() === 'assigned' ? this.assignedCourses() : this.allCourses();
  }

  isAssignedToMe(course: Course): boolean {
    const currentName = (this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || '').trim().toLowerCase();
    if (!currentName || currentName === 'user') return true;
    const trAny = course.trainer as any;
    const inst = (course.instructor || '').toLowerCase();
    const trObjName = (typeof trAny === 'string' ? trAny : trAny?.name || trAny?.user?.name || '').toLowerCase();
    return inst.includes(currentName) || currentName.includes(inst) || trObjName.includes(currentName);
  }

  totalStudentsCount(): number {
    return this.assignedCourses().reduce((acc, c) => acc + (c.studentsCount || 0), 0);
  }

  liveClassesCount(): number {
    return this.assignedCourses().filter(c => !!c.liveClassLink).length;
  }

  openCurriculumDrawer(course: Course): void {
    this.selectedCourseForCurriculum.set(course);
    this.isLoadingCurriculum.set(true);
    this.courseModules.set([]);
    this.moduleLessonsMap.set({});

    this.moduleService.getModules(course.id).subscribe({
      next: (mods) => {
        this.courseModules.set(mods || []);
        this.isLoadingCurriculum.set(false);

        mods.forEach(m => {
          this.lessonService.getLessons(m.id).subscribe(lessons => {
            this.moduleLessonsMap.update(prev => ({
              ...prev,
              [m.id]: lessons || []
            }));
          });
        });
      },
      error: () => {
        this.isLoadingCurriculum.set(false);
      }
    });
  }

  closeCurriculumDrawer(): void {
    this.selectedCourseForCurriculum.set(null);
  }

  formatDuration(seconds?: number): string {
    if (!seconds || seconds <= 0) return '0 min';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) return `${mins} min`;
    return `${mins}m ${secs}s`;
  }

  formatDateRange(start?: string | null, end?: string | null): string {
    if (!start && !end) return '';
    if (start && end) {
      const s = new Date(start);
      const e = new Date(end);
      const sStr = s.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const eStr = e.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1);
      return `${sStr} – ${eStr} (${diffDays} Days)`;
    }
    if (end) {
      return `Ends ${new Date(end).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
    }
    return `Starts ${new Date(start!).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`;
  }
}


