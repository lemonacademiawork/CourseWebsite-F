export interface Review {
  id: string;
  courseId: string;
  courseTitle?: string;
  studentId: string;
  studentName?: string;
  studentAvatar?: string;
  rating: number;
  title?: string;
  comment: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewRatingStats {
  averageRating: number;
  totalReviews: number;
  distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface CourseReviewsResponse {
  reviews: Review[];
  stats?: ReviewRatingStats;
  total?: number;
}

export interface CreateReviewPayload {
  courseId?: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  title?: string;
  comment?: string;
}
