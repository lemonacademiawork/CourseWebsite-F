export interface Procedure {
  id: string;
  title: string;
  contentText?: string;
  orderIndex?: number;
  lessonId?: string;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProcedurePayload {
  title: string;
  contentText: string;
  orderIndex?: number;
  lessonId?: string;
}

export interface UpdateProcedurePayload {
  title?: string;
  contentText?: string;
  orderIndex?: number;
  lessonId?: string;
}
