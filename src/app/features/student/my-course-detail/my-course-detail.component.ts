import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../core/services/session.service';
import { CourseService } from '../../../core/services/course.service';
import { AuthService } from '../../../core/services/auth.service';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';
import { CourseResource } from '../../../core/models/common.model';

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
  authService = inject(AuthService);

  courseId = signal<string>('lippan-art');
  activeTab = signal<'lessons' | 'zoom' | 'resources' | 'certificate'>('lessons');
  sessions = signal<CourseSession[]>([]);
  resources = signal<CourseResource[]>([]);
  resourcesLoading = signal<boolean>(false);

  modules = [
    {
      title: "Module 1: Introduction & Materials",
      lessons: [
        { id: 1, title: "1.1 Welcome to the Craft", duration: "10 mins", completed: true },
        { id: 2, title: "1.2 Sourcing Clay & Substrates", duration: "15 mins", completed: true },
        { id: 3, title: "1.3 Mirror Shapes and Selection", duration: "12 mins", completed: true },
      ]
    },
    {
      title: "Module 2: Layouts and Border Grids",
      lessons: [
        { id: 4, title: "2.1 Drawing Your Grid Guidelines", duration: "20 mins", completed: true },
        { id: 5, title: "2.2 Preparing Mud Clay Blend", duration: "18 mins", completed: true },
        { id: 6, title: "2.3 Applying Clay Border Threads", duration: "25 mins", completed: false },
      ]
    },
    {
      title: "Module 3: Intricate Mirror Positioning",
      lessons: [
        { id: 7, title: "3.1 Central Medallion Layout", duration: "30 mins", completed: false },
        { id: 8, title: "3.2 Corner Accent Motifs", duration: "22 mins", completed: false },
      ]
    }
  ];

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('courseId') || 'lippan-art';
      this.courseId.set(id);
      this.loadSessions();
    });
  }

  setTab(tab: 'lessons' | 'zoom' | 'resources' | 'certificate'): void {
    this.activeTab.set(tab);
    if (tab === 'resources') {
      this.loadResources();
    }
  }

  loadSessions(): void {
    const list = this.sessionService.getSessions(this.courseId());
    this.sessions.set(list);
  }

  loadResources(): void {
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

  toggleLesson(lesson: any): void {
    lesson.completed = !lesson.completed;
  }
}
