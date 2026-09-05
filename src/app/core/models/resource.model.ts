export interface Resource {
  id: string;
  courseId?: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number | string;
  downloadCount?: number;
  lessonId?: string;
  procedureId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateResourcePayload {
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  lessonId?: string;
  procedureId?: string;
}

export interface UpdateResourcePayload {
  title?: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  lessonId?: string;
  procedureId?: string;
}
