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

export function parseSessionDateTime(dateStr: string, timeStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    let [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) {
        hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }
    
    return new Date(year, month - 1, day, hours, minutes, 0);
}

export function getSessionStatus(session: CourseSession): 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'RECORDING_AVAILABLE' {
    const now = new Date();
    const start = parseSessionDateTime(session.sessionDate, session.startTime);
    const end = parseSessionDateTime(session.sessionDate, session.endTime);
    
    if (now >= start && now <= end) {
        return 'LIVE';
    } else if (now < start) {
        return 'UPCOMING';
    } else {
        if (session.recordingLink && session.recordingLink.trim() !== '') {
            return 'RECORDING_AVAILABLE';
        } else {
            return 'COMPLETED';
        }
    }
}

export function initializeMockSessions(): Record<string, CourseSession[]> {
    if (typeof window === 'undefined') return {};
    
    const existing = localStorage.getItem('course_sessions');
    if (existing) {
        try {
            return JSON.parse(existing);
        } catch {
            // fallback to init
        }
    }

    const today = new Date();
    const formatDate = (d: Date) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dayStr}`;
    };

    // Calculate dates
    const d1 = new Date(today); d1.setDate(today.getDate() - 2);
    const d2 = new Date(today); d2.setDate(today.getDate() - 1);
    const d3 = new Date(today); // Today
    const d4 = new Date(today); d4.setDate(today.getDate() + 1);
    const d5 = new Date(today); d5.setDate(today.getDate() + 2);
    
    // Format times for Live Session (covers current hour)
    const currentHour = today.getHours();
    const liveStartHour = currentHour === 0 ? 12 : currentHour - 1;
    const liveEndHour = currentHour === 23 ? 12 : currentHour + 1;
    const formatTime = (h: number) => {
        const pm = h >= 12;
        const displayH = h % 12 === 0 ? 12 : h % 12;
        return `${String(displayH).padStart(2, '0')}:00 ${pm ? 'PM' : 'AM'}`;
    };

    const mockSessions: Record<string, CourseSession[]> = {
        "lippan-art": []
    };

    localStorage.setItem('course_sessions', JSON.stringify(mockSessions));
    return mockSessions;
}
