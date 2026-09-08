export interface CourseResource {
  id: string;
  title: string;
  type?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: string | number;
  lessonId?: string;
  procedureId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResourcePayload {
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  lessonId?: string;
  procedureId?: string;
}

export interface UpdateResourcePayload {
  title?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  lessonId?: string;
  procedureId?: string;
}

export interface TrainerApplication {
  id?: string | number;
  fullName?: string;
  name: string;
  email: string;
  phone?: string;
  course?: string;
  expertise?: string;
  runningDates?: string;
  yearsOfExperience?: number;
  experience: string | number;
  bio?: string;
  portfolioUrl?: string;
  sampleVideoUrl?: string;
  resumeUrl?: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'PENDING' | 'APPROVED' | 'REJECTED';
  feedbackNotes?: string;
  adminFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage?: number;
  discountValue?: number;
  discount?: number;
  discountType?: 'PERCENTAGE' | 'FLAT';
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  validUntil?: string;
  expiresAt?: string;
  isActive: boolean;
  usageCount?: number;
  usedCount?: number;
  usageLimit?: number | null;
  userLimit?: number | null;
}

export interface BlogPost {
  id: string | number;
  title: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  category: string;
  categoryColor?: string;
  author: string;
  date: string;
  imageUrl?: string;
  image?: string;
  readTime: string;
  slug?: string;
  tags?: string[];
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
