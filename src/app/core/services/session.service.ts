import { Injectable } from '@angular/core';
import { CourseSession, SessionStatus } from '../models/session.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  parseSessionDateTime(dateStr: string, timeStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return new Date(year, month - 1, day, hours, minutes, 0);
  }

  getSessionStatus(session: CourseSession): SessionStatus {
    const now = new Date();
    const start = this.parseSessionDateTime(session.sessionDate, session.startTime);
    const end = this.parseSessionDateTime(session.sessionDate, session.endTime);

    if (now >= start && now <= end) {
      return 'LIVE';
    } else if (now < start) {
      return 'UPCOMING';
    } else {
      if (session.recordingLink && session.recordingLink.trim() !== '') {
        return 'RECORDING_AVAILABLE';
      } else {
        return 'COMPLETED';
      }
    }
  }

  getStoredSessions(): Record<string, CourseSession[]> {
    if (typeof window === 'undefined') return {};

    const existing = localStorage.getItem('course_sessions');
    if (existing) {
      try {
        return JSON.parse(existing);
      } catch {
        return {};
      }
    }
    return {};
  }

  getSessions(courseId: string): CourseSession[] {
    const all = this.getStoredSessions();
    return all[courseId] || [];
  }

  saveSessions(courseId: string, sessions: CourseSession[]): void {
    const all = this.getStoredSessions();
    all[courseId] = sessions;
    if (typeof window !== 'undefined') {
      localStorage.setItem('course_sessions', JSON.stringify(all));
    }
  }
}
