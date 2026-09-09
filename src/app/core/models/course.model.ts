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
}

export interface CreateCoursePayload {
  title: string;
  slug?: string;
  categoryId?: string;
  category?: string;
  shortDescription?: string;
  description?: string;
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
