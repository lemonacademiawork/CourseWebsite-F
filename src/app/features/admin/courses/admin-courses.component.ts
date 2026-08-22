import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../core/services/course.service';
import { SessionService } from '../../../core/services/session.service';
import { CourseSession, SessionStatus } from '../../../core/models/session.model';

interface AdminCourseItem {
  id: string;
  title: string;
  category: string;
  trainer: string;
  price: number;
  studentsCount: number;
  status: 'Published' | 'Draft';
  createdDate: string;
}

@Component({
  selector: 'app-admin-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-courses.component.html'
})
export class AdminCoursesComponent implements OnInit {
  private courseService = inject(CourseService);
  private sessionService = inject(SessionService);

  courses = signal<AdminCourseItem[]>([]);
  isCreating = signal<boolean>(false);

  // Form states
  title = signal<string>('');
  category = signal<string>('Lippan Art');
  trainer = signal<string>('');
  price = signal<number>(149);
  status = signal<'Published' | 'Draft'>('Published');

  // Session states
  selectedCourseId = signal<string | null>(null);
  sessions = signal<CourseSession[]>([]);
  editingSessionId = signal<string | null>(null);
  tempZoomLink = signal<string>('');
  tempRecordingLink = signal<string>('');
  saveSuccess = signal<string>('');

  ngOnInit(): void {
    this.fetchCourses();
  }

  fetchCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (list) => {
        const mapped: AdminCourseItem[] = list.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category,
          trainer: c.instructor,
          price: c.price,
          studentsCount: c.studentsCount || 0,
          status: 'Published',
          createdDate: 'Aug 20, 2026'
        }));
        this.courses.set(mapped);
      },
      error: () => {
        this.courses.set([
          {
            id: 'lippan-art',
            title: 'The Art of Lippan: Traditional Mud & Mirror Work',
            category: 'Lippan Art',
            trainer: 'Aisha Sharma',
            price: 149,
            studentsCount: 124,
            status: 'Published',
            createdDate: 'Aug 10, 2026'
          }
        ]);
      }
    });
  }

  handleCreateCourse(): void {
    if (!this.title().trim()) return;
    const newCourse: AdminCourseItem = {
      id: this.title().toLowerCase().replace(/\s+/g, '-'),
      title: this.title(),
      category: this.category(),
      trainer: this.trainer() || 'Aisha Sharma',
      price: this.price(),
      studentsCount: 0,
      status: this.status(),
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    this.courses.update(list => [newCourse, ...list]);
    this.isCreating.set(false);
    this.title.set('');
  }

  openSessionManager(courseId: string): void {
    this.selectedCourseId.set(courseId);
    const list = this.sessionService.getSessions(courseId);
    this.sessions.set(list);
  }

  closeSessionManager(): void {
    this.selectedCourseId.set(null);
    this.editingSessionId.set(null);
  }

  startEditingSession(session: CourseSession): void {
    this.editingSessionId.set(session.id);
    this.tempZoomLink.set(session.zoomLink || '');
    this.tempRecordingLink.set(session.recordingLink || '');
  }

  saveSessionEdit(session: CourseSession): void {
    session.zoomLink = this.tempZoomLink();
    session.recordingLink = this.tempRecordingLink();

    if (this.selectedCourseId()) {
      this.sessionService.saveSessions(this.selectedCourseId()!, this.sessions());
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('session_database_updated'));
      }
    }

    this.editingSessionId.set(null);
    this.saveSuccess.set('Session links saved successfully!');
    setTimeout(() => this.saveSuccess.set(''), 3000);
  }

  getStatus(session: CourseSession): SessionStatus {
    return this.sessionService.getSessionStatus(session);
  }
}
