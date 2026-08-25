export interface BusinessGuidance {
  id: string;
  title: string;
  contentType?: string;
  description?: string;
  resourceUrl?: string;
  meetingTime?: string;
  orderIndex?: number;
  isPublished?: boolean;
  moduleId?: string;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBusinessGuidancePayload {
  title: string;
  contentType?: string;
  description?: string;
  resourceUrl?: string;
  meetingTime?: string;
  orderIndex?: number;
  isPublished?: boolean;
  moduleId?: string;
}

export interface UpdateBusinessGuidancePayload {
  title?: string;
  contentType?: string;
  description?: string;
  resourceUrl?: string;
  meetingTime?: string;
  orderIndex?: number;
  isPublished?: boolean;
  moduleId?: string;
}
