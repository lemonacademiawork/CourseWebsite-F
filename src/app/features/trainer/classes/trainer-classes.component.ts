import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../core/services/session.service';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { ClassProgressService } from '../../../core/services/class-progress.service';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-trainer-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative min-h-screen pb-10 text-xs text-on-surface">
      <div class="max-w-container-max mx-auto px-margin-mobile md:px-6 py-6">
        
        <!-- Header -->
        <header class="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-variant/30 pb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">verified_user</span>
                Trainer Class Management
              </span>
              <span class="text-on-surface-variant text-xs">Trainer: <strong>{{ authService.userName() || 'Trainer' }}</strong></span>
            </div>
            <h1 class="text-xl font-bold text-on-surface">Assigned Classes &amp; Session Completion</h1>
            <p class="text-[11px] text-on-surface-variant mt-0.5">
              Host live sessions and authoritatively mark completed classes. Marking a class complete advances enrolled students toward certificate eligibility.
            </p>
          </div>
        </header>

        <!-- Success & Error Banners -->
        @if (successMessage()) {
          <div class="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs animate-fadeIn">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-emerald-600 text-lg">check_circle</span>
              <span class="font-medium text-xs">{{ successMessage() }}</span>
            </div>
            <button (click)="successMessage.set('')" class="text-emerald-700 hover:text-emerald-900 cursor-pointer p-1">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        }

        @if (errorMessage()) {
          <div class="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center justify-between shadow-xs animate-fadeIn">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-rose-600 text-lg">error</span>
              <span class="font-medium text-xs">{{ errorMessage() }}</span>
            </div>
            <button (click)="errorMessage.set('')" class="text-rose-700 hover:text-rose-900 cursor-pointer p-1">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        }

        <!-- Course & Batch Selection Bar -->
        <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-4.5 mb-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl">school</span>
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Select Assigned Course</span>
              <h3 class="font-bold text-sm text-on-surface">{{ selectedCourse()?.title || 'Workshop Curriculum' }}</h3>
            </div>
          </div>

          <div class="w-full sm:w-80">
            <select 
              [ngModel]="selectedCourseId()" 
              (ngModelChange)="onCourseChange($event)"
              class="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2 text-xs font-semibold text-on-surface focus:outline-none focus:border-primary">
              @for (c of assignedCourses(); track c.id) {
                <option [value]="c.id">{{ c.title }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Class Completion Stats Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Total Scheduled Classes</span>
              <span class="text-lg font-bold text-on-surface">{{ sessions().length }} Sessions</span>
            </div>
            <div class="w-9 h-9 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">calendar_month</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Completed Classes</span>
              <span class="text-lg font-bold text-emerald-700">{{ completedCount() }} of {{ sessions().length }}</span>
            </div>
            <div class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">task_alt</span>
            </div>
          </div>

          <div class="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
            <div>
              <span class="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider block">Remaining Incomplete</span>
              <span class="text-lg font-bold text-amber-700">{{ sessions().length - completedCount() }} Classes</span>
            </div>
            <div class="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-lg">pending_actions</span>
            </div>
          </div>
        </div>

        <!-- Sessions Grid -->
        <div class="mt-4">
          @if (sessions().length === 0) {
            <div class="text-center py-12 text-on-surface-variant bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-2">
              <span class="material-symbols-outlined text-3xl text-on-surface-variant/60">event_busy</span>
              <p class="font-bold text-xs text-on-surface">No sessions found for this course.</p>
              <p class="text-[11px] text-on-surface-variant">Sessions will appear here once scheduled for this batch.</p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              @for (sess of sessions(); track sess.id) {
                <div 
                  class="bg-surface-container-lowest border rounded-2xl p-5 shadow-xs flex flex-col justify-between h-full relative overflow-hidden text-[11px] transition-all hover:shadow-sm"
                  [ngClass]="sess.isCompleted ? 'border-emerald-200/80 bg-emerald-50/15' : 'border-outline-variant/30'">
                  
                  <div>
                    <div class="flex justify-between items-start mb-2.5">
                      <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        [ngClass]="sess.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-primary/10 text-primary'">
                        {{ sess.batchName || 'Interactive Session' }}
                      </span>

                      <!-- Status Badge -->
                      @if (sess.isCompleted) {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span class="material-symbols-outlined text-[11px]">check_circle</span>
                          COMPLETED
                        </span>
                      } @else if (getStatus(sess) === 'LIVE') {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse">
                          <span class="material-symbols-outlined text-[11px]">sensors</span>
                          LIVE NOW
                        </span>
                      } @else {
                        <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <span class="material-symbols-outlined text-[11px]">schedule</span>
                          IN PROGRESS
                        </span>
                      }
                    </div>

                    <h3 class="font-bold text-sm text-on-surface mt-1 leading-snug">{{ sess.title }}</h3>
                    <p class="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{{ sess.description }}</p>

                    <div class="mt-3.5 pt-3 border-t border-outline-variant/20 text-on-surface-variant space-y-1">
                      <p class="font-medium flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-xs text-primary">calendar_today</span>
                        <span>Date: {{ sess.sessionDate }}</span>
                      </p>
                      <p class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-xs text-primary">schedule</span>
                        <span>Time: {{ sess.startTime }} - {{ sess.endTime }}</span>
                      </p>
                      @if (sess.isCompleted && sess.completedAt) {
                        <p class="text-[10px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                          <span class="material-symbols-outlined text-xs">verified</span>
                          <span>Verified: {{ sess.completedAt | date:'short' }}</span>
                        </p>
                      }
                    </div>
                  </div>

                  <!-- Actions Area -->
                  <div class="mt-4 pt-3.5 border-t border-outline-variant/20 space-y-2">
                    <div class="flex gap-2">
                      @if (sess.zoomLink) {
                        <a 
                          [href]="sess.zoomLink" 
                          target="_blank" 
                          class="flex-1 text-center py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition shadow-2xs flex items-center justify-center gap-1">
                          <span class="material-symbols-outlined text-xs">videocam</span>
                          <span>Launch Zoom</span>
                        </a>
                      }
                      @if (sess.recordingLink) {
                        <a 
                          [href]="sess.recordingLink" 
                          target="_blank" 
                          class="flex-1 text-center py-2 border border-outline rounded-xl font-semibold hover:bg-surface-variant transition text-on-surface flex items-center justify-center gap-1">
                          <span class="material-symbols-outlined text-xs">play_circle</span>
                          <span>Recording</span>
                        </a>
                      }
                    </div>

                    <!-- Mark Class as Completed Action -->
                    <div>
                      @if (sess.isCompleted) {
                        <div class="w-full py-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl font-bold text-center text-xs flex items-center justify-center gap-1.5">
                          <span class="material-symbols-outlined text-sm text-emerald-600">verified</span>
                          <span>✓ Class Completed</span>
                        </div>
                      } @else {
                        <button 
                          (click)="promptCompletion(sess)"
                          [disabled]="isCompletingSession(sess.id)"
                          class="w-full py-2 bg-primary hover:bg-primary/95 text-on-primary rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-opacity cursor-pointer disabled:opacity-50">
                          @if (isCompletingSession(sess.id)) {
                            <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            <span>Processing...</span>
                          } @else {
                            <span class="material-symbols-outlined text-sm">task_alt</span>
                            <span>Mark Class as Completed</span>
                          }
                        </button>
                      }
                    </div>
                  </div>

                </div>
              }
            </div>
          }
        </div>

      </div>

      <!-- CONFIRMATION DIALOG MODAL -->
      @if (pendingSession()) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div class="bg-surface-container-lowest rounded-2xl max-w-md w-full border border-outline-variant/30 shadow-2xl p-6 space-y-4">
            
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-xl">help</span>
              </div>
              <div>
                <h3 class="font-bold text-sm text-on-surface">Confirm Class Completion</h3>
                <p class="text-xs text-on-surface-variant mt-0.5">Authoritative status update for enrolled learners</p>
              </div>
            </div>

            <!-- Detailed Explanation Callout -->
            <div class="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20 space-y-2 text-xs">
              <p class="text-on-surface leading-relaxed">
                Marking this class complete will authoritatively update the course progress of all enrolled students in 
                <strong>{{ selectedCourse()?.title }}</strong>.
              </p>
              <div class="p-2.5 bg-primary/5 rounded-lg border border-primary/15 text-[11px] text-on-surface-variant space-y-1">
                <p><strong>Class:</strong> {{ pendingSession()?.title }}</p>
                <p><strong>Batch:</strong> {{ pendingSession()?.batchName || 'General Batch' }}</p>
                <p><strong>Authorizing Trainer:</strong> {{ authService.userName() || 'Trainer' }}</p>
              </div>
              <p class="text-[11px] text-on-surface-variant leading-tight">
                Once all required classes in this course are marked completed, students will unlock 100% course completion and become eligible for certificate issuance.
              </p>
            </div>

            <!-- Modal Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-2">
              <button 
                (click)="cancelCompletion()"
                [disabled]="isSubmittingModal()"
                class="px-4 py-2 border border-outline-variant/40 rounded-xl font-bold text-xs text-on-surface hover:bg-surface-container-high transition cursor-pointer disabled:opacity-50">
                Cancel
              </button>

              <button 
                (click)="confirmCompletion()"
                [disabled]="isSubmittingModal()"
                class="px-5 py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-xl font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50">
                @if (isSubmittingModal()) {
                  <span class="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>Updating Progress...</span>
                } @else {
                  <span class="material-symbols-outlined text-sm">check</span>
                  <span>Confirm &amp; Mark Complete</span>
                }
              </button>
            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class TrainerClassesComponent implements OnInit, OnDestroy {
  private sessionService = inject(SessionService);
  private courseService = inject(CourseService);
  public authService = inject(AuthService);
  private classProgressService = inject(ClassProgressService);

  assignedCourses = signal<Course[]>([]);
  selectedCourseId = signal<string>('lippan-art');
  selectedCourse = signal<Course | null>(null);

  sessions = signal<CourseSession[]>([]);
  completedCount = signal<number>(0);

  // Modal & Async states
  pendingSession = signal<CourseSession | null>(null);
  isSubmittingModal = signal<boolean>(false);
  activeCompletingId = signal<string | null>(null);

  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  private syncListener = () => {
    this.refreshSessions();
  };

  ngOnInit(): void {
    this.loadCourses();

    if (typeof window !== 'undefined') {
      window.addEventListener('class_completion_updated', this.syncListener);
    }
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('class_completion_updated', this.syncListener);
    }
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        if (courses && courses.length > 0) {
          this.assignedCourses.set(courses);
          const currentId = this.selectedCourseId();
          const match = courses.find(c => c.id === currentId || c.slug === currentId) || courses[0];
          this.selectedCourseId.set(match.id);
          this.selectedCourse.set(match);
          this.refreshSessions();
        } else {
          // Fallback with Lippan Art
          this.refreshSessions();
        }
      },
      error: () => {
        this.refreshSessions();
      }
    });
  }

  onCourseChange(courseId: string): void {
    this.selectedCourseId.set(courseId);
    const course = this.assignedCourses().find(c => c.id === courseId) || null;
    this.selectedCourse.set(course);
    this.refreshSessions();
  }

  refreshSessions(): void {
    const courseId = this.selectedCourseId();
    let list = this.sessionService.getSessions(courseId);

    // If no sessions registered under this specific ID, fallback to general masterclass sessions
    if (!list || list.length === 0) {
      list = this.sessionService.getSessions('lippan-art');
    }

    // Synchronize with ClassProgressService completed IDs
    const completedIds = this.classProgressService.getCompletedClassIds(courseId);
    const updated = list.map(s => {
      const isCompleted = s.isCompleted || completedIds.includes(s.id);
      return {
        ...s,
        isCompleted
      };
    });

    this.sessions.set(updated);
    this.completedCount.set(updated.filter(s => s.isCompleted).length);
  }

  getStatus(sess: CourseSession): SessionStatus {
    return this.sessionService.getSessionStatus(sess);
  }

  isCompletingSession(sessionId: string): boolean {
    return this.activeCompletingId() === sessionId;
  }

  promptCompletion(sess: CourseSession): void {
    if (sess.isCompleted) return; // Prevent duplicate
    this.pendingSession.set(sess);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  cancelCompletion(): void {
    this.pendingSession.set(null);
  }

  confirmCompletion(): void {
    const sess = this.pendingSession();
    if (!sess) return;

    this.isSubmittingModal.set(true);
    this.activeCompletingId.set(sess.id);
    const courseId = this.selectedCourseId();

    this.classProgressService.markClassComplete(courseId, sess.id, {
      classTitle: sess.title,
      batchName: sess.batchName || 'General Batch',
      isLiveSession: true
    }).subscribe({
      next: (res) => {
        this.isSubmittingModal.set(false);
        this.activeCompletingId.set(null);
        this.pendingSession.set(null);
        this.successMessage.set(res.message || `Class "${sess.title}" successfully marked as completed.`);
        this.refreshSessions();
      },
      error: (err) => {
        this.isSubmittingModal.set(false);
        this.activeCompletingId.set(null);
        this.pendingSession.set(null);
        this.errorMessage.set(err?.message || 'Failed to update class completion status. Please try again.');
      }
    });
  }
}

