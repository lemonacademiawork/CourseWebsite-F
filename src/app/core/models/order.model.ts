export interface Order {
  id: string;
  courseId: string;
  orderNumber: string;
  amount: number;
  currency?: string;
  razorpayOrderId?: string;
  appliedReferralCode?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  courseId: string;
  orderNumber: string;
  amount: number;
  currency?: string;
  razorpayOrderId?: string;
  appliedReferralCode?: string;
}

export interface UpdateOrderPayload {
  status?: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  razorpayOrderId?: string;
  appliedReferralCode?: string;
}
