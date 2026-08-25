export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoProvider?: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  orderIndex?: number;
  isPreview?: boolean;
  isPublished?: boolean;
  moduleId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonPayload {
  title: string;
  videoId: string;
  videoUrl: string;
  description?: string;
  videoProvider?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  orderIndex?: number;
  isPreview?: boolean;
  isPublished?: boolean;
}

export interface UpdateLessonPayload {
  title?: string;
  description?: string;
  videoProvider?: string;
  videoId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  orderIndex?: number;
  isPreview?: boolean;
  isPublished?: boolean;
}
