export interface CourseReviewItem {
  id?: string;
  name: string;
  studentName?: string;
  rating: number;
  comment: string;
  title?: string;
  date?: string;
  createdAt?: string;
  avatarUrl?: string;
}

export interface CourseMaterialItem {
  name: string;
  description?: string;
  included?: boolean;
}

export interface CourseCurriculumModule {
  title: string;
  lessonsCount?: number;
  duration?: string;
  lessons?: { title: string; duration: string }[];
}

export interface Course {
  id: string;
  title: string;
  slug?: string;
  category: string;
  categorySlug?: string;
  categoryId?: string;
  instructor: string;
  description: string;
  shortDescription?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  previewImage?: string;
  previewVideoUrl?: string;
  liveClassLink?: string;
  liveScheduleText?: string;
  youtubePlaylistUrl?: string;
  price: number;
  discountedPrice?: number;
  discountPrice?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS' | string;
  durationHours?: number;
  language?: string;
  isPublished?: boolean;
  studentsCount?: number;
  progress?: number;
  lessonsCompleted?: number;
  totalLessons?: number;
  startDate?: string | null;
  endDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
  trainer?: {
    id?: string;
    bio?: string;
    user?: {
      name?: string;
      avatarUrl?: string;
    };
  } | string;
  _count?: {
    enrollments?: number;
    reviews?: number;
  };
  modules?: any[];
  procedures?: any[];
  resources?: any[];
  guidance?: any[];

  // Pure data-driven per-course properties
  materialsKitTitle?: string;
  materialsKitDescription?: string;
  materialsPartnerUrl?: string;
  materialsPartnerName?: string;
  materialsList?: CourseMaterialItem[];
  learningObjectives?: string[];
  curriculumModules?: CourseCurriculumModule[];
  reviewsList?: CourseReviewItem[];
}

export interface CreateCoursePayload {
  title: string;
  slug?: string;
  categoryId?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  price: number;
  discountPrice?: number;
  discountedPrice?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS' | string;
  durationHours?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  previewVideoUrl?: string;
  liveClassLink?: string;
  liveScheduleText?: string;
  youtubePlaylistUrl?: string;
  isPublished?: boolean;
  trainerId?: string;
  trainer?: string;
  instructor?: string;
}

export interface UpdateCoursePayload {
  title?: string;
  slug?: string;
  categoryId?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  price?: number;
  discountPrice?: number;
  discountedPrice?: number;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS' | string;
  durationHours?: number;
  thumbnailUrl?: string;
  imageUrl?: string;
  previewVideoUrl?: string;
  liveClassLink?: string;
  liveScheduleText?: string;
  youtubePlaylistUrl?: string;
  trainerId?: string;
  trainer?: string;
  instructor?: string;
  isPublished?: boolean;
}
