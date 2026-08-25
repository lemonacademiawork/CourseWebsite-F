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
