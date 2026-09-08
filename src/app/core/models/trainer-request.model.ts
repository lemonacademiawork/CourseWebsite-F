export type TrainerRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'Pending Approval' | 'Approved' | 'Rejected';

export interface TrainerRequest {
  id: string;
  userId?: string | null;
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  expertise: string;
  course?: string;
  yearsOfExperience: number;
  experience?: string | number;
  bio: string;
  portfolioUrl?: string | null;
  sampleVideoUrl?: string | null;
  resumeUrl?: string | null;
  status: TrainerRequestStatus;
  feedbackNotes?: string | null;
  adminFeedback?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  submittedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  } | null;
}

export interface SubmitTrainerRequestPayload {
  fullName: string;
  name?: string;
  email: string;
  phone: string;
  expertise: string;
  course?: string;
  yearsOfExperience: number;
  experience?: string | number;
  bio: string;
  portfolioUrl?: string;
  sampleVideoUrl?: string;
  resumeUrl?: string;
}

export interface ReviewTrainerRequestPayload {
  status: 'APPROVED' | 'REJECTED';
  feedbackNotes?: string;
}
