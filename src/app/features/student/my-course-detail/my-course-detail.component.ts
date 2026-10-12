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
import { Certificate, CertificateUiState } from '../../../core/models/certificate.model';
import { ClassProgressService } from '../../../core/services/class-progress.service';

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
  private classProgressService = inject(ClassProgressService);
  authService = inject(AuthService);

  courseId = signal<string>('');
  course = signal<Course | null>(null);
  courseLoading = signal<boolean>(true);
  courseContent = signal<any>(null);
  certificate = signal<Certificate | null>(null);
  certificateClaiming = signal<boolean>(false);
  certificateUiState = signal<CertificateUiState>('IN_PROGRESS');
  certificateErrorMessage = signal<string>('');

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
    return list.length > 0 ? list.length : (this.course()?.totalLessons || 0);
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

    // Reactive sync: When an instructor or admin marks a class complete, reload student progress immediately
    if (typeof window !== 'undefined') {
      window.addEventListener('class_completion_updated', () => {
        const id = this.courseId();
        if (id) {
          this.loadStudentProgress();
          this.loadSessions();
          this.loadCertificate();
        }
      });
    }
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
        if (this.modules().length === 0 && c?.modules && c.modules.length > 0) {
          const initialMods: ModuleWithLessons[] = c.modules.map((m: any) => ({
            id: m.id,
            courseId: m.courseId || courseId,
            title: m.title,
            description: m.description,
            orderIndex: m.orderIndex,
            isPublished: m.isPublished,
            lessonsList: m.lessons || [],
            loadingLessons: false
          }));
          this.modules.set(initialMods);
        }
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
        const courseMods = this.course()?.modules || [];
        const enriched: ModuleWithLessons[] = (mods || []).map(m => {
          const match = courseMods.find((cm: any) => cm.id === m.id);
          const initialLessons = (match?.lessons && match.lessons.length > 0)
            ? match.lessons
            : ((m as any).lessons || []);
          return {
            ...m,
            lessonsList: initialLessons,
            loadingLessons: initialLessons.length === 0
          };
        });

        this.modules.set(enriched);
        this.modulesLoading.set(false);

        enriched.forEach((mod, idx) => {
          this.lessonService.getLessons(mod.id).subscribe({
            next: (lessons) => {
              this.modules.update(current => {
                const copy = [...current];
                if (copy[idx]) {
                  copy[idx] = {
                    ...copy[idx],
                    lessonsList: (lessons && lessons.length > 0) ? lessons : copy[idx].lessonsList || [],
                    loadingLessons: false
                  };
                }
                return copy;
              });
            },
            error: () => {
              this.modules.update(current => {
                const copy = [...current];
                if (copy[idx]) {
                  copy[idx] = { ...copy[idx], loadingLessons: false };
                }
                return copy;
              });
            }
          });
        });
      },
      error: () => {
        const courseMods = this.course()?.modules || [];
        if (courseMods.length > 0) {
          const fallback: ModuleWithLessons[] = courseMods.map((m: any) => ({
            id: m.id,
            courseId: m.courseId || courseId,
            title: m.title,
            description: m.description,
            orderIndex: m.orderIndex,
            isPublished: m.isPublished,
            lessonsList: m.lessons || [],
            loadingLessons: false
          }));
          this.modules.set(fallback);
        } else {
          this.modules.set([]);
        }
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
    const courseId = this.courseId();
    if (!courseId) return;

    this.studentService.getStudentProgress().subscribe({
      next: (progressList) => {
        const completed = new Set<string>();
        if (progressList && Array.isArray(progressList)) {
          progressList.forEach(p => {
            if (p.isCompleted) completed.add(p.lessonId);
          });
        }
        // Merge authorized completed classes from ClassProgressService
        const authCompleted = this.classProgressService.getCompletedClassIds(courseId);
        authCompleted.forEach(id => completed.add(id));

        this.completedLessonIds.set(completed);
        this.updateCertificateStatus();
      },
      error: () => {
        const completed = new Set<string>();
        const authCompleted = this.classProgressService.getCompletedClassIds(courseId);
        authCompleted.forEach(id => completed.add(id));
        this.completedLessonIds.set(completed);
        this.updateCertificateStatus();
      }
    });

    // Also check backend course progress endpoint
    this.courseService.getCourseProgress(courseId).subscribe({
      next: (res) => {
        if (res && typeof res.progress === 'number' && res.progress >= 100) {
          this.updateCertificateStatus();
        }
      }
    });
  }

  updateCertificateStatus(): void {
    if (this.certificate()) {
      this.certificateUiState.set('GENERATED');
    } else if (this.isCourseCompleted()) {
      this.certificateUiState.set('ELIGIBLE');
    } else {
      this.certificateUiState.set('IN_PROGRESS');
    }
  }

  loadCertificate(): void {
    const courseId = this.courseId();
    if (!courseId) return;

    this.certificateService.getCertificateByCourse(courseId).subscribe({
      next: (cert) => {
        if (cert && (cert.certificateNumber || cert.id)) {
          this.certificate.set(cert);
          this.certificateUiState.set('GENERATED');
        } else {
          // Check student certificate list
          this.studentService.getStudentCertificates().subscribe({
            next: (certs) => {
              if (certs && Array.isArray(certs)) {
                const match = certs.find(c => c.courseId === courseId);
                if (match) {
                  this.certificate.set(match);
                  this.certificateUiState.set('GENERATED');
                } else {
                  this.updateCertificateStatus();
                }
              } else {
                this.updateCertificateStatus();
              }
            },
            error: () => this.updateCertificateStatus()
          });
        }
      },
      error: () => this.updateCertificateStatus()
    });
  }

  claimCertificate(): void {
    const courseId = this.courseId();
    if (!courseId) return;

    // Strict validation: Only allow claiming when course is 100% completed
    if (!this.isCourseCompleted()) {
      alert('You must complete 100% of all required classes before you can claim your certificate.');
      return;
    }

    this.certificateClaiming.set(true);
    this.certificateErrorMessage.set('');

    this.certificateService.claimCertificate(courseId).subscribe({
      next: (cert) => {
        this.certificateClaiming.set(false);
        if (cert && (cert.certificateNumber || cert.id)) {
          this.certificate.set(cert);
          this.certificateUiState.set('GENERATED');
        } else {
          this.loadCertificate();
        }
      },
      error: (err) => {
        this.certificateClaiming.set(false);
        this.certificateUiState.set('GENERATION_FAILED');
        const msg = err?.error?.message || err?.message || 'We could not generate your certificate right now. Please try again later.';
        this.certificateErrorMessage.set(msg);
      }
    });
  }

  getCourseCategory(): string {
    const cat = this.course()?.category;
    if (!cat) return 'Art & Craft';
    if (cat.includes('-')) {
      return cat
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }
    return cat;
  }

  downloadCertificatePDF(): void {
    const cert = this.certificate();
    if (!cert) {
      alert('Your certificate is not yet issued. Please complete all required classes.');
      return;
    }

    if (cert.certificateUrl && cert.certificateUrl.startsWith('http')) {
      window.open(cert.certificateUrl, '_blank');
      return;
    }

    const studentName = cert.studentName || this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || 'Artisan Scholar';
    const courseTitle = cert.courseTitle || this.course()?.title || 'Masterclass Art & Craft Workshop';
    const courseCategory = this.getCourseCategory();
    const certNumber = cert.certificateNumber || cert.id || '';
    const certCode = cert.verificationCode || '';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/certificate-template.png';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 1024;
      canvas.height = img.naturalHeight || 724;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw certificate background template
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const centerX = canvas.width * 0.50;

      // 2. Student Name centered in blank space above gold horizontal divider
      const studentNameY = canvas.height * 0.455;
      const nameFontSize = Math.round(canvas.width * 0.034); // ~35px on 1024w

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1E170C';
      ctx.font = `bold ${nameFontSize}px "Cinzel", "Playfair Display", Georgia, serif`;
      ctx.fillText(studentName, centerX, studentNameY);

      // 3. Dynamic Narrative with Course Title and Category
      const narrativeFontSize = Math.round(canvas.width * 0.0165); // ~17px on 1024w
      ctx.font = `${narrativeFontSize}px Georgia, "Playfair Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, serif`;
      ctx.fillStyle = '#2B2317';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const fullNarrative = `Has successfully completed the ${courseTitle} Class. and has demonstrated exceptional skills in ${courseCategory}. We congratulate you on your outstanding achievement and look forward to seeing their continued growth and success.`;

      const maxWidth = canvas.width * 0.74; // ~758px
      const words = fullNarrative.split(' ');
      const lines: string[] = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        if (ctx.measureText(testLine).width < maxWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine);
          currentLine = words[i];
        }
      }
      lines.push(currentLine);

      const lineHeight = Math.round(narrativeFontSize * 1.55); // ~26px
      const totalBlockHeight = lines.length * lineHeight;
      const narrativeCenterY = canvas.height * 0.615;
      const startNarrativeY = narrativeCenterY - (totalBlockHeight / 2) + (lineHeight / 2);

      lines.forEach((line, index) => {
        ctx.fillText(line, centerX, startNarrativeY + (index * lineHeight));
      });

      // 4. Verification Credentials above signatures
      if (certNumber) {
        const idFontSize = Math.round(canvas.width * 0.011); // ~11px on 1024w
        ctx.font = `bold ${idFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.fillStyle = '#6E5410';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const idText = certCode
          ? `Certificate ID: ${certNumber}   |   Verification Code: ${certCode}`
          : `Certificate ID: ${certNumber}`;
        ctx.fillText(idText, centerX, canvas.height * 0.705);
      }

      // Trigger download
      const link = document.createElement('a');
      link.download = `Lemon-Academia-Certificate-${certNumber || studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.onerror = () => {
      // Fallback in case image asset cannot be loaded directly
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 724;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#EDE6D6';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#6E5410';
      ctx.lineWidth = 6;
      ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#2D2006';
      ctx.font = 'bold 36px Georgia, serif';
      ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 160);

      ctx.fillStyle = '#5B5650';
      ctx.font = '18px Georgia, serif';
      ctx.fillText('THIS IS TO CERTIFY THAT', canvas.width / 2, 240);

      ctx.fillStyle = '#6E5410';
      ctx.font = 'bold 38px Georgia, serif';
      ctx.fillText(studentName, canvas.width / 2, 330);

      ctx.fillStyle = '#2D2006';
      ctx.font = '16px Georgia, serif';
      ctx.fillText(`Has successfully completed the ${courseTitle} Class. and has demonstrated exceptional skills in ${courseCategory}.`, canvas.width / 2, 440);
      ctx.fillText('We congratulate you on your outstanding achievement and look forward to seeing their continued growth and success.', canvas.width / 2, 475);

      if (certNumber) {
        ctx.font = 'bold 12px monospace';
        ctx.fillStyle = '#6E5410';
        ctx.fillText(`Certificate ID: ${certNumber} | Code: ${certCode}`, canvas.width / 2, 530);
      }

      const link = document.createElement('a');
      link.download = `Lemon-Academia-Certificate-${certNumber || studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
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
}
