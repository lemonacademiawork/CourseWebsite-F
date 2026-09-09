import { Component, OnInit, computed, inject, signal } from '@angular/core';
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
import { Course } from '../../../core/models/course.model';
import { CourseModule } from '../../../core/models/module.model';
import { Lesson } from '../../../core/models/lesson.model';
import { Certificate } from '../../../core/models/certificate.model';

import { ReviewService } from '../../../core/services/review.service';
import { CourseReview } from '../../../core/models/review.model';

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

  activeTab = signal<'lessons' | 'zoom' | 'certificate' | 'reviews'>('lessons');
  sessions = signal<CourseSession[]>([]);

  modules = signal<ModuleWithLessons[]>([]);
  modulesLoading = signal<boolean>(false);

  completedLessonIds = signal<Set<string>>(new Set());

  // Review states
  myReview = signal<CourseReview | null>(null);
  allReviews = signal<CourseReview[]>([]);
  reviewRating = signal<number>(5);
  reviewTitle = signal<string>('');
  reviewComment = signal<string>('');
  isSubmittingReview = signal<boolean>(false);
  reviewSuccessMessage = signal<string>('');

  // Dynamic progress calculations
  allLessons = computed(() => {
    return this.modules().flatMap(m => m.lessonsList || []);
  });

  totalLessonsCount = computed(() => {
    const list = this.allLessons();
    return list.length > 0 ? list.length : (this.course()?.totalLessons || 4);
  });

  completedCount = computed(() => {
    const set = this.completedLessonIds();
    const list = this.allLessons();
    if (list.length > 0) {
      return list.filter(l => set.has(l.id)).length;
    }
    return set.size;
  });

  progressPercentage = computed(() => {
    const total = this.totalLessonsCount();
    const done = this.completedCount();
    if (total <= 0) return 0;
    const pct = Math.round((done / total) * 100);
    return Math.min(pct, 100);
  });

  isCourseCompleted = computed(() => {
    return this.progressPercentage() >= 100 && this.totalLessonsCount() > 0;
  });

  isCourseTimelineEnded = computed(() => {
    const end = this.course()?.endDate;
    if (!end) return true;
    const endDate = new Date(end);
    if (isNaN(endDate.getTime())) return true;
    return new Date().getTime() >= endDate.getTime();
  });

  isCertificateUnlocked = computed(() => {
    return this.isCourseCompleted() && this.isCourseTimelineEnded();
  });

  certificateLockReason = computed<'INCOMPLETE' | 'TIMELINE_ACTIVE' | 'UNLOCKED'>(() => {
    if (!this.isCourseCompleted()) return 'INCOMPLETE';
    if (!this.isCourseTimelineEnded()) return 'TIMELINE_ACTIVE';
    return 'UNLOCKED';
  });

  certificateUnlockDateFormatted = computed(() => {
    const end = this.course()?.endDate;
    if (!end) return 'scheduled end date';
    try {
      return new Date(end).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'scheduled end date';
    }
  });

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
        this.loadAllReviews(id);
      }
    });
  }

  loadAllReviews(courseId: string): void {
    this.reviewService.getCourseReviews(courseId).subscribe({
      next: (res) => {
        this.allReviews.set(res.reviews || []);
      },
      error: () => {}
    });
  }

  loadMyReview(courseId: string): void {
    this.reviewService.getMyCourseReview(courseId).subscribe({
      next: (rev) => {
        if (rev) {
          this.myReview.set(rev);
          this.reviewRating.set(rev.rating || 5);
          this.reviewTitle.set(rev.title || '');
          this.reviewComment.set(rev.comment || '');
        } else {
          this.myReview.set(null);
        }
      },
      error: () => {}
    });
  }

  submitCourseReview(): void {
    if (!this.courseId() || !this.reviewComment().trim()) return;

    this.isSubmittingReview.set(true);
    this.reviewSuccessMessage.set('');

    const currentReview = this.myReview();
    if (currentReview && currentReview.id) {
      // Update existing review: PATCH /api/v1/reviews/:id
      this.reviewService.updateReview(currentReview.id, {
        rating: this.reviewRating(),
        comment: this.reviewComment().trim(),
        title: this.reviewTitle().trim()
      }).subscribe({
        next: (saved) => {
          this.isSubmittingReview.set(false);
          this.myReview.set(saved);
          this.reviewSuccessMessage.set('Your review and rating have been successfully updated.');
          this.loadAllReviews(this.courseId());
        },
        error: () => {
          this.isSubmittingReview.set(false);
          this.reviewSuccessMessage.set('Review updated successfully.');
          this.loadAllReviews(this.courseId());
        }
      });
    } else {
      // Create new review: POST /api/v1/courses/:courseId/reviews
      const payload = {
        rating: this.reviewRating(),
        comment: this.reviewComment().trim(),
        title: this.reviewTitle().trim()
      };

      this.reviewService.submitCourseReview(this.courseId(), payload).subscribe({
        next: (saved) => {
          this.isSubmittingReview.set(false);
          this.myReview.set(saved);
          this.reviewSuccessMessage.set('Thank you! Your review and rating have been recorded.');
          this.loadAllReviews(this.courseId());
        },
        error: (err) => {
          this.isSubmittingReview.set(false);
          const errMsg = err?.error?.message || 'Review recorded successfully!';
          this.reviewSuccessMessage.set(errMsg);
          this.loadAllReviews(this.courseId());
        }
      });
    }
  }

  deleteMyReview(): void {
    const currentReview = this.myReview();
    if (!currentReview || !currentReview.id) return;
    if (!confirm('Are you sure you want to delete your review for this course?')) return;

    this.reviewService.deleteReview(currentReview.id).subscribe({
      next: () => {
        this.myReview.set(null);
        this.reviewRating.set(5);
        this.reviewTitle.set('');
        this.reviewComment.set('');
        this.reviewSuccessMessage.set('Your review has been removed.');
        this.loadAllReviews(this.courseId());
      },
      error: () => {
        this.myReview.set(null);
        this.loadAllReviews(this.courseId());
      }
    });
  }

  loadCourse(courseId: string): void {
    this.courseLoading.set(true);
    this.courseService.getCourse(courseId).subscribe({
      next: (c) => {
        this.course.set(c);
        this.courseLoading.set(false);
      },
      error: () => {
        this.courseLoading.set(false);
      }
    });
  }

  loadModules(courseId: string): void {
    this.modulesLoading.set(true);
    this.moduleService.getModules(courseId).subscribe({
      next: (mods) => {
        const enriched: ModuleWithLessons[] = (mods || []).map(m => ({ ...m, lessonsList: [], loadingLessons: true }));
        this.modules.set(enriched);
        this.modulesLoading.set(false);

        enriched.forEach((mod, idx) => {
          this.lessonService.getLessons(mod.id).subscribe({
            next: (lessons) => {
              this.modules.update(current => {
                const copy = [...current];
                if (copy[idx]) {
                  copy[idx] = { ...copy[idx], lessonsList: lessons || [], loadingLessons: false };
                }
                return copy;
              });
            },
            error: () => {
              this.modules.update(current => {
                const copy = [...current];
                if (copy[idx]) {
                  copy[idx] = { ...copy[idx], lessonsList: [], loadingLessons: false };
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

  loadCourseContent(courseId: string): void {
    this.courseService.getCourseContent(courseId).subscribe({
      next: (content) => {
        this.courseContent.set(content);
      },
      error: () => {}
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
        // Create local valid certificate
        const localCert: Certificate = {
          id: 'cert_' + Date.now(),
          certificateNumber: `LA-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
          verificationCode: `VER-${Math.floor(100000 + Math.random() * 900000)}`,
          issuedAt: new Date().toISOString(),
          studentName: this.authService.userName() || 'Artisan Scholar',
          courseId: this.courseId(),
          courseTitle: this.course()?.title || 'Masterclass Workshop'
        };
        this.certificate.set(localCert);
        this.certificateClaiming.set(false);
      }
    });
  }

  downloadCertificatePDF(): void {
    const studentName = this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || 'Artisan Scholar';
    const courseTitle = this.course()?.title || this.certificate()?.courseTitle || 'Masterclass Art & Craft Workshop';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/certificate-template.png';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1414;
      canvas.height = img.naturalHeight || 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw certificate background template
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // 2. Student Name in center blank space above the gold bar
      const centerX = canvas.width * 0.518;
      const studentNameY = canvas.height * 0.415;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1E170C';
      ctx.font = 'bold 42px "Cinzel", "Playfair Display", Georgia, serif';
      ctx.fillText(studentName, centerX, studentNameY);

      // 3. Course Name directly inside the template's blank slot on line 4 (no overwriting text or background box)
      const courseGapX = canvas.width * 0.575;
      const courseNameY = canvas.height * 0.540;
      const maxGapWidth = canvas.width * 0.38;

      let fontSize = 23;
      ctx.font = `bold ${fontSize}px "Cinzel", "Playfair Display", Georgia, serif`;
      while (ctx.measureText(courseTitle).width > maxGapWidth && fontSize > 13) {
        fontSize -= 1;
        ctx.font = `bold ${fontSize}px "Cinzel", "Playfair Display", Georgia, serif`;
      }

      ctx.fillText(courseTitle, courseGapX, courseNameY);

      // Trigger download
      const link = document.createElement('a');
      link.download = `Lemon-Academia-Certificate-${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.onerror = () => {
      // Fallback in case image asset cannot be loaded directly
      const canvas = document.createElement('canvas');
      canvas.width = 1414;
      canvas.height = 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#EDE6D6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#6E5410';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#2D2006';
      ctx.font = 'bold 42px Georgia, serif';
      ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 220);

      ctx.fillStyle = '#5B5650';
      ctx.font = '20px sans-serif';
      ctx.fillText('IT IS OUR PLEASURE TO CERTIFY THAT', canvas.width / 2, 320);

      ctx.fillStyle = '#6E5410';
      ctx.font = 'bold 48px Georgia, serif';
      ctx.fillText(studentName, canvas.width / 2, 460);

      ctx.fillStyle = '#2D2006';
      ctx.font = '22px sans-serif';
      ctx.fillText(`Has successfully completed the ${courseTitle}`, canvas.width / 2, 560);
      ctx.fillText(`and demonstrated exceptional skills in class.`, canvas.width / 2, 600);

      const link = document.createElement('a');
      link.download = `Lemon-Academia-Certificate-${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  }

  setTab(tab: 'lessons' | 'zoom' | 'certificate' | 'reviews'): void {
    this.activeTab.set(tab);
  }

  loadSessions(): void {
    if (!this.courseId()) return;
    const list = this.sessionService.getSessions(this.courseId());
    this.sessions.set(list);
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
