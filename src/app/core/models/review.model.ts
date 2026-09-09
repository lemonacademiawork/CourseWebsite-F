export interface ReviewStudentProfile {
  name: string;
  avatarUrl?: string | null;
}

export interface ReviewStudent {
  id: string;
  name: string;
  email: string;
  studentProfile?: ReviewStudentProfile | null;
}

export interface CourseReview {
  id: string;
  rating: number;
  comment?: string | null;
  title?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt?: string;
  student?: ReviewStudent;
  studentId?: string;
  studentName?: string;
  studentAvatar?: string;
  courseId?: string;
  courseTitle?: string;
  course?: {
    id: string;
    title: string;
    slug?: string;
  };
}

// Backward-compatible alias
export type Review = CourseReview;

export interface RatingBreakdown {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  [key: number]: number;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  breakdown: RatingBreakdown;
}

// Backward-compatible alias
export type ReviewRatingStats = ReviewStats;

export interface CourseReviewsResponse {
  course?: {
    id: string;
    title: string;
    slug: string;
  };
  stats?: ReviewStats;
  reviews: CourseReview[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  total?: number;
}

export interface CreateReviewPayload {
  rating: number;
  comment: string;
  title?: string;
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
  title?: string;
}
