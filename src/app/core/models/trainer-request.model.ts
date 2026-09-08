export type TrainerRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'Pending Approval' | 'Approved' | 'Rejected';

export interface TrainerRequest {
  id: string;
  userId?: string | null;
  name: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  expertise: string;
  yearsOfExperience: number;
  experience: string | number;
  runningDates?: string | null;
  bio: string;
  portfolioUrl?: string | null;
  portfolio?: string | null;
  sampleVideoUrl?: string | null;
  videoUrl?: string | null;
  resumeUrl?: string | null;
  resume?: string | null;
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
  name: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  expertise: string;
  experience: string | number;
  yearsOfExperience: number;
  runningDates?: string;
  bio: string;
  portfolioUrl?: string;
  portfolio?: string;
  sampleVideoUrl?: string;
  videoUrl?: string;
  resumeUrl?: string;
  resume?: string;
}

export interface ReviewTrainerRequestPayload {
  status: 'APPROVED' | 'REJECTED';
  feedbackNotes?: string;
}
