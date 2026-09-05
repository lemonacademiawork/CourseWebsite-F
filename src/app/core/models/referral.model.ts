export interface ReferralCommission {
  id: string;
  referrerId?: string;
  referrerName?: string;
  referrerEmail?: string;
  referredStudentId?: string;
  studentName?: string;
  studentEmail?: string;
  courseId?: string;
  courseTitle?: string;
  courseName?: string;
  orderId?: string;
  coursePrice?: number;
  commissionPercentage?: number;
  commissionAmount: number;
  amount?: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected' | 'PENDING' | 'APPROVED' | 'PAID' | 'CANCELLED' | string;
  payoutDate?: string;
  transactionRef?: string;
  transactionReference?: string;
  notes?: string;
  referrer?: { name: string; email: string };
  referee?: { name: string; email: string };
  course?: { title: string };
  createdAt: string;
  updatedAt?: string;
}

export interface ReferralSummary {
  referralCode: string;
  referralLink?: string;
  totalReferrals: number;
  activeReferrals?: number;
  totalEarned: number;
  pendingPayout: number;
  paidPayout: number;
  commissionRate?: number;
  recentReferrals?: Array<{
    id: string;
    studentName: string;
    courseName?: string;
    date: string;
    commission: number;
    status: string;
  }>;
}

export interface ReferralValidationResult {
  valid: boolean;
  code: string;
  discountPercentage?: number;
  referrerName?: string;
  message?: string;
}
