export interface AdminDashboardMetrics {
  totalRevenue?: number;
  totalStudents?: number;
  totalCourses?: number;
  totalTrainers?: number;
  recentOrders?: any[];
  pendingApplications?: number;
  activeEnrollments?: number;
  [key: string]: any;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'STUDENT' | 'TRAINER' | 'ADMIN' | 'student' | 'trainer' | 'admin';
  isActive: boolean;
  avatarUrl?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  coursesCount?: number;
  enrollmentsCount?: number;
}

export interface AdminEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  source?: string;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  course?: {
    id: string;
    title: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminGalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  studentName?: string;
  studentId?: string;
  courseId?: string;
  courseTitle?: string;
  category?: string;
  description?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  isFeatured?: boolean;
  adminFeedback?: string;
  submittedByRole?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCommission {
  id: string;
  referrerId?: string;
  refereeId?: string;
  courseId?: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED';
  transactionReference?: string;
  referrer?: { name: string; email: string };
  referee?: { name: string; email: string };
  course?: { title: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSetting {
  settingKey: string;
  settingValue: string;
  description?: string;
  updatedAt?: string;
}
