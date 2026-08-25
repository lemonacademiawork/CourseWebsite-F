import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../core/services/session.service';
import { CourseService } from '../../../core/services/course.service';
import { ModuleService } from '../../../core/services/module.service';
import { LessonService } from '../../../core/services/lesson.service';
import { AuthService } from '../../../core/services/auth.service';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';
import { CourseResource } from '../../../core/models/common.model';
import { Course } from '../../../core/models/course.model';
import { CourseModule } from '../../../core/models/module.model';
import { Lesson } from '../../../core/models/lesson.model';

interface ModuleWithLessons extends CourseModule {
  lessonsList?: Lesson[];
  loadingLessons?: boolean;
}

@Component({
  selector: 'app-my-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-course-detail.component.html'
})
export class MyCourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private courseService = inject(CourseService);
  private moduleService = inject(ModuleService);
  private lessonService = inject(LessonService);
  authService = inject(AuthService);

  courseId = signal<string>('');
  course = signal<Course | null>(null);
  courseLoading = signal<boolean>(true);

  activeTab = signal<'lessons' | 'zoom' | 'resources' | 'certificate'>('lessons');
  sessions = signal<CourseSession[]>([]);
  resources = signal<CourseResource[]>([]);
  resourcesLoading = signal<boolean>(false);

  modules = signal<ModuleWithLessons[]>([]);
  modulesLoading = signal<boolean>(false);

  completedLessonIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId') || '';
      this.courseId.set(id);
      if (id) {
        this.loadCourse(id);
        this.loadModules(id);
        this.loadSessions();
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

  setTab(tab: 'lessons' | 'zoom' | 'resources' | 'certificate'): void {
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
    this.completedLessonIds.update(set => {
      const next = new Set(set);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  }
}
