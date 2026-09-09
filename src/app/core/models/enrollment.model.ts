export interface Enrollment {
  id: string;
  courseId: string;
  studentId?: string;
  orderId?: string;
  source?: 'ONLINE_PAYMENT' | 'ADMIN' | 'MANUAL';
  status?: string;
  course?: {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    thumbnailUrl?: string;
    price?: number;
    discountedPrice?: number;
    trainer?: { name: string } | string;
    category?: { name: string; slug?: string } | string;
    startDate?: string | null;
    endDate?: string | null;
    start_date?: string | null;
    end_date?: string | null;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateEnrollmentPayload {
  courseId: string;
  orderId?: string;
  source?: 'ONLINE_PAYMENT' | 'ADMIN' | 'MANUAL';
}
