export interface Payment {
  id: string;
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string;
  amount: number;
  paymentMethod?: string;
  status?: string;
  rawPayload?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePaymentPayload {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  amount: number;
  paymentMethod?: string;
  rawPayload?: any;
}
