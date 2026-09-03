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
