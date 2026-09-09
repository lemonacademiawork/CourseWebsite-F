export interface AppNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type?: 'INFO' | 'COURSE' | 'REVIEW' | 'ENROLLMENT' | 'SYSTEM' | string;
  isRead: boolean;
  link?: string;
  createdAt: string;
  updatedAt?: string;
}

export type StudentNotification = AppNotification;
