export interface Course {
  id: string;
  title: string;
  slug?: string;
  category: string;
  categorySlug?: string;
  categoryId?: string;
  instructor: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  price: number;
  discountedPrice?: number;
  isPublished?: boolean;
  studentsCount?: number;
  progress?: number;
  lessonsCompleted?: number;
  totalLessons?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCoursePayload {
  title: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  categoryId?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  slug?: string;
  description?: string;
  price?: number;
  discountedPrice?: number;
  thumbnailUrl?: string;
  categoryId?: string;
}
