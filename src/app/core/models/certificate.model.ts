export interface Certificate {
  id: string;
  certificateNumber: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  studentEmail?: string;
  issuedAt: string;
  verificationCode: string;
  certificateUrl?: string;
  status?: string;
}

export interface CertificateVerification {
  valid: boolean;
  certificate?: Certificate;
  message?: string;
}

export type CertificateUiState = 'IN_PROGRESS' | 'ELIGIBLE' | 'GENERATED' | 'GENERATION_FAILED';

export interface CertificateStatusInfo {
  state: CertificateUiState;
  completionPercentage: number;
  completedClasses: number;
  totalRequiredClasses: number;
  certificate?: Certificate | null;
  errorMessage?: string;
  isUnlocked: boolean;
}
