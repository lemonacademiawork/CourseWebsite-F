export type DiscountType = 'PERCENTAGE' | 'FLAT';

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  usageLimit?: number | null;
  userLimit?: number | null;
  usedCount?: number;
  courseId?: string | null;
  course?: {
    id: string;
    title: string;
  } | null;
  description?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ValidateCouponPayload {
  code: string;
  courseId?: string;
  amount: number;
}

export interface ValidateCouponResponse {
  couponId: string;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  discountAmount: number;
  finalAmount: number;
  description?: string;
}

export interface CreateCouponPayload {
  code: string;
  discountType: DiscountType;
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  userLimit?: number;
  courseId?: string | null;
  expiresAt?: string;
  isActive?: boolean;
  description?: string;
}

export interface UpdateCouponPayload extends Partial<CreateCouponPayload> {}
