export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  orderIndex?: number;
  isPublished?: boolean;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateModulePayload {
  title: string;
  description?: string;
  orderIndex?: number;
  isPublished?: boolean;
}

export interface UpdateModulePayload {
  title?: string;
  description?: string;
  orderIndex?: number;
  isPublished?: boolean;
}
