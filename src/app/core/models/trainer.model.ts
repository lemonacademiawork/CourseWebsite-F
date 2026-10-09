export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  expertise?: string;
  designation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTrainerPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  expertise?: string;
  designation?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AdminTrainerItem {
  id: string;
  trainerProfileId?: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  expertise?: string | null;
  designation?: string | null;
  publishedCoursesCount?: number;
  status?: string;
  createdAt?: string;
  plainPassword?: string;
}


export interface TrainerDashboardMetrics {
  totalStudents: number;
  activeCourses: number;
  totalRevenue?: number;
  pendingReviews?: number;
  recentEnrollments?: any[];
  [key: string]: any;
}

export interface TrainerStudent {
  id: string;
  name: string;
  email: string;
  course?: string;
  courseTitle?: string;
  progress?: number;
  progressPercentage?: number;
  enrolledAt?: string;
  status?: string;
}

export interface TrainerReview {
  id: string;
  studentName: string;
  studentAvatar?: string;
  rating: number;
  reviewText: string;
  courseTitle?: string;
  createdAt: string;
}

export interface TrainerGallerySubmission {
  id: string;
  title: string;
  imageUrl: string;
  studentName?: string;
  courseTitle?: string;
  category?: string;
  description?: string;
  feedback?: string;
  adminFeedback?: string;
  isFeatured?: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}
