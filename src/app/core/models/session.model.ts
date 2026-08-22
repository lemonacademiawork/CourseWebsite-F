export interface CourseSession {
  id: string;
  title: string;
  description: string;
  sessionDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM AM/PM
  endTime: string; // HH:MM AM/PM
  zoomLink: string;
  recordingLink: string;
}

export type SessionStatus = 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'RECORDING_AVAILABLE';
