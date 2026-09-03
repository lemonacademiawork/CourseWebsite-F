export interface StudentDashboardMetrics {
  enrolledCoursesCount: number;
  completedLessonsCount: number;
  certificatesCount: number;
  totalHoursLearned?: number;
  recentActivity?: any[];
  [key: string]: any;
}

export interface LessonProgress {
  lessonId: string;
  watchedSeconds: number;
  isCompleted: boolean;
  lastWatchedAt?: string;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
