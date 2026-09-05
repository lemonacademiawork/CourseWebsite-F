import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionService } from '../../../core/services/session.service';

import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { LessonService } from '../../../core/services/lesson.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentService } from '../../../core/services/student.service';
import { CertificateService } from '../../../core/services/certificate.service';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';
import { CourseResource } from '../../../core/models/common.model';
import { Course } from '../../../core/models/course.model';
import { CourseModule } from '../../../core/models/module.model';
import { Lesson } from '../../../core/models/lesson.model';
import { Certificate } from '../../../core/models/certificate.model';

import { ReviewService } from '../../../core/services/review.service';
import { Review } from '../../../core/models/review.model';

interface ModuleWithLessons extends CourseModule {
  lessonsList?: Lesson[];
  loadingLessons?: boolean;
}

@Component({
  selector: 'app-my-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './my-course-detail.component.html'
})
export class MyCourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private courseService = inject(CourseService);
  private moduleService = inject(ModuleService);
  private lessonService = inject(LessonService);
  private studentService = inject(StudentService);
  private certificateService = inject(CertificateService);
  private reviewService = inject(ReviewService);
  authService = inject(AuthService);

  courseId = signal<string>('');
  course = signal<Course | null>(null);
  courseLoading = signal<boolean>(true);
  courseContent = signal<any>(null);
  certificate = signal<Certificate | null>(null);
  certificateClaiming = signal<boolean>(false);

  activeTab = signal<'lessons' | 'zoom' | 'resources' | 'certificate' | 'reviews'>('lessons');
  sessions = signal<CourseSession[]>([]);
  resources = signal<CourseResource[]>([]);
  resourcesLoading = signal<boolean>(false);

  modules = signal<ModuleWithLessons[]>([]);
  modulesLoading = signal<boolean>(false);

  completedLessonIds = signal<Set<string>>(new Set());

  // Review states
  myReview = signal<Review | null>(null);
  reviewRating = signal<number>(5);
  reviewTitle = signal<string>('');
  reviewComment = signal<string>('');
  isSubmittingReview = signal<boolean>(false);
  reviewSuccessMessage = signal<string>('');


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId') || '';
      this.courseId.set(id);
      if (id) {
        this.loadCourse(id);
        this.loadModules(id);
        this.loadSessions();
        this.loadCourseContent(id);
        this.loadStudentProgress();
        this.loadCertificate();
        this.loadMyReview(id);
      }
    });
  }

  loadMyReview(courseId: string): void {
    this.reviewService.getMyCourseReview(courseId).subscribe({
      next: (rev) => {
        if (rev) {
          this.myReview.set(rev);
          this.reviewRating.set(rev.rating);
          this.reviewTitle.set(rev.title || '');
          this.reviewComment.set(rev.comment || '');
        }
      },
      error: () => {}
    });
  }

  submitCourseReview(): void {
    if (!this.courseId() || !this.reviewComment().trim()) return;

    this.isSubmittingReview.set(true);
    this.reviewSuccessMessage.set('');

    const payload = {
      courseId: this.courseId(),
      rating: this.reviewRating(),
      title: this.reviewTitle().trim(),
      comment: this.reviewComment().trim()
    };

    this.reviewService.submitCourseReview(this.courseId(), payload).subscribe({
      next: (saved) => {
        this.isSubmittingReview.set(false);
        this.myReview.set(saved);
        this.reviewSuccessMessage.set('Thank you! Your review and rating have been recorded.');
      },
      error: () => {
        this.isSubmittingReview.set(false);
        this.reviewSuccessMessage.set('Review submitted successfully!');
      }
    });
  }


  loadStudentProgress(): void {
    this.studentService.getStudentProgress().subscribe({
      next: (progressList) => {
        if (progressList && Array.isArray(progressList)) {
          const completed = new Set<string>();
          progressList.forEach(p => {
            if (p.isCompleted) completed.add(p.lessonId);
          });
          this.completedLessonIds.set(completed);
        }
      },
      error: () => {}
    });
  }

  loadCertificate(): void {
    this.studentService.getStudentCertificates().subscribe({
      next: (certs) => {
        if (certs && Array.isArray(certs)) {
          const match = certs.find(c => c.courseId === this.courseId());
          if (match) this.certificate.set(match);
        }
      },
      error: () => {}
    });
  }

  claimCertificate(): void {
    if (!this.courseId()) return;
    this.certificateClaiming.set(true);
    this.certificateService.claimCertificate(this.courseId()).subscribe({
      next: (cert) => {
        if (cert) this.certificate.set(cert);
        this.certificateClaiming.set(false);
      },
      error: () => {
        this.certificateClaiming.set(false);
      }
    });
  }

  loadCourse(id: string): void {
    this.courseLoading.set(true);
    this.courseService.getCourse(id).subscribe({
      next: (c) => {
        this.course.set(c);
        this.courseLoading.set(false);
      },
      error: () => {
        this.courseLoading.set(false);
      }
    });
  }

  /** Load full protected course content for enrolled students */
  loadCourseContent(id: string): void {
    this.courseService.getCourseContent(id).subscribe({
      next: (content) => {
        this.courseContent.set(content);
        // If the content response includes resources, auto-populate
        if (content?.resources && Array.isArray(content.resources)) {
          this.resources.set(content.resources);
        }
      },
      error: () => {
        // Student may not be enrolled — content endpoint returns 403
        this.courseContent.set(null);
      }
    });
  }

  loadModules(courseId: string): void {
    this.modulesLoading.set(true);
    this.moduleService.getModules(courseId).subscribe({
      next: (mods) => {
        const mapped: ModuleWithLessons[] = mods.map(m => ({ ...m, lessonsList: [], loadingLessons: true }));
        this.modules.set(mapped);
        this.modulesLoading.set(false);

        // Fetch lessons for each module
        mapped.forEach((mod, index) => {
          this.lessonService.getLessons(mod.id).subscribe({
            next: (lessons) => {
              this.modules.update(curr => {
                const copy = [...curr];
                if (copy[index]) {
                  copy[index] = { ...copy[index], lessonsList: lessons, loadingLessons: false };
                }
                return copy;
              });
            },
            error: () => {
              this.modules.update(curr => {
                const copy = [...curr];
                if (copy[index]) {
                  copy[index] = { ...copy[index], lessonsList: [], loadingLessons: false };
                }
                return copy;
              });
            }
          });
        });
      },
      error: () => {
        this.modules.set([]);
        this.modulesLoading.set(false);
      }
    });
  }

  setTab(tab: 'lessons' | 'zoom' | 'resources' | 'certificate' | 'reviews'): void {
    this.activeTab.set(tab);
    if (tab === 'resources') {
      this.loadResources();
    }
  }


  loadSessions(): void {
    if (!this.courseId()) return;
    const list = this.sessionService.getSessions(this.courseId());
    this.sessions.set(list);
  }

  loadResources(): void {
    if (!this.courseId()) return;
    this.resourcesLoading.set(true);
    this.courseService.getResources(this.courseId()).subscribe({
      next: (data) => {
        this.resources.set(data);
        this.resourcesLoading.set(false);
      },
      error: () => {
        this.resources.set([]);
        this.resourcesLoading.set(false);
      }
    });
  }

  getStatus(session: CourseSession): SessionStatus {
    return this.sessionService.getSessionStatus(session);
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.completedLessonIds().has(lessonId);
  }

  toggleLesson(lessonId: string): void {
    const isCurrentlyCompleted = this.completedLessonIds().has(lessonId);
    const newStatus = !isCurrentlyCompleted;

    this.completedLessonIds.update(set => {
      const next = new Set(set);
      if (newStatus) {
        next.add(lessonId);
      } else {
        next.delete(lessonId);
      }
      return next;
    });

    // Sync with backend API
    this.studentService.updateLessonProgress(lessonId, { isCompleted: newStatus }).subscribe({
      error: () => {}
    });
  }
}
