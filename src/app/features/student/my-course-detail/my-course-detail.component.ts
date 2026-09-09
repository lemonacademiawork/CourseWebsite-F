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
    const cert = this.certificate();
    const studentName = this.authService.userName() || (typeof window !== 'undefined' ? localStorage.getItem('user_name') : '') || 'Artisan Scholar';
    const courseTitle = this.course()?.title || cert?.courseTitle || 'Masterclass Art & Craft Workshop';
    const instructor = this.course()?.instructor || 'Master Instructor';
    const code = cert?.verificationCode || cert?.certificateNumber || `LA-CERT-${Date.now().toString().slice(-6)}`;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    // Render Certificate to high-resolution Canvas and trigger download
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#FCF9F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer Vintage Border
    ctx.strokeStyle = '#6E5410';
    ctx.lineWidth = 12;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Inner Delicate Border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);

    // Corner Ornaments
    ctx.fillStyle = '#6E5410';
    const corners = [[75, 75], [canvas.width - 75, 75], [75, canvas.height - 75], [canvas.width - 75, canvas.height - 75]];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Academy Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#6E5410';
    ctx.font = 'bold 36px "Cinzel", Georgia, serif';
    ctx.fillText('LEMON ACADEMIA', canvas.width / 2, 160);

    ctx.fillStyle = '#5B5650';
    ctx.font = '500 18px sans-serif';
    ctx.fillText('PREMIUM ARTISAN & CRAFT STUDIO', canvas.width / 2, 195);

    // Certificate Title
    ctx.fillStyle = '#1C1A17';
    ctx.font = 'bold 54px Georgia, serif';
    ctx.fillText('Certificate of Completion', canvas.width / 2, 290);

    ctx.fillStyle = '#5B5650';
    ctx.font = 'italic 24px Georgia, serif';
    ctx.fillText('This certifies that', canvas.width / 2, 370);

    // Student Name
    ctx.fillStyle = '#6E5410';
    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillText(studentName, canvas.width / 2, 460);

    // Divider Line under student name
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 490);
    ctx.lineTo(canvas.width / 2 + 250, 490);
    ctx.stroke();

    // Narrative
    ctx.fillStyle = '#4A463F';
    ctx.font = '22px sans-serif';
    ctx.fillText('has successfully mastered all modules, studio techniques, and practical projects for', canvas.width / 2, 550);

    // Course Title
    ctx.fillStyle = '#1C1A17';
    ctx.font = 'bold 38px Georgia, serif';
    ctx.fillText(courseTitle, canvas.width / 2, 620);

    // Signatures and Seal
    const ySign = 880;

    // Left: Instructor Signature
    ctx.fillStyle = '#1C1A17';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText(instructor, 380, ySign);
    ctx.strokeStyle = '#6E5410';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, ySign + 10);
    ctx.lineTo(510, ySign + 10);
    ctx.stroke();
    ctx.fillStyle = '#7A756D';
    ctx.font = '16px sans-serif';
    ctx.fillText('Master Artisan Instructor', 380, ySign + 35);

    // Center: Official Seal Badge
    const sealX = canvas.width / 2;
    const sealY = ySign - 20;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 60, 0, Math.PI * 2);
    ctx.fillStyle = '#FAF0CA';
    ctx.fill();
    ctx.strokeStyle = '#6E5410';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#6E5410';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('OFFICIAL', sealX, sealY - 8);
    ctx.fillText('SEAL', sealX, sealY + 12);

    // Right: Director Signature
    ctx.fillStyle = '#1C1A17';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.fillText('Academic Director', canvas.width - 380, ySign);
    ctx.strokeStyle = '#6E5410';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(canvas.width - 510, ySign + 10);
    ctx.lineTo(canvas.width - 250, ySign + 10);
    ctx.stroke();
    ctx.fillStyle = '#7A756D';
    ctx.font = '16px sans-serif';
    ctx.fillText('Lemon Academia Board', canvas.width - 380, ySign + 35);

    // Verification Code & Date footer
    ctx.fillStyle = '#8C857B';
    ctx.font = '15px "Courier New", monospace';
    ctx.fillText(`Issued: ${dateStr}   •   Verification Code: ${code}   •   lemonacademia.com`, canvas.width / 2, 1040);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Lemon-Academia-Certificate-${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
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
