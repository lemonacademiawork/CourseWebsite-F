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
  name: string;
  email: string;
  course: string;
  runningDates?: string;
  experience: string;
  portfolioUrl?: string;
  status: 'Pending Approval' | 'Approved' | 'Rejected';
  createdAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
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
}
