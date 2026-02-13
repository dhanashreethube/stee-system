export type SecurityEventType =
    | 'TAB_SWITCH'
    | 'WINDOW_BLUR'
    | 'FOCUS_RETURN'
    | 'FULLSCREEN_EXIT'
    | 'COPY_ATTEMPT'
    | 'PASTE_ATTEMPT'
    | 'RIGHT_CLICK_BLOCKED'
    | 'DEV_TOOLS_OPEN'
    | 'TIMER_START'
    | 'TIMER_TICK'
    | 'TIMER_END'
    | 'EXAM_SUBMIT';

export interface SecurityLog {
    id: string;
    eventType: SecurityEventType;
    timestamp: number;
    attemptId: string;
    metadata: {
        browser: string;
        visibilityState: DocumentVisibilityState;
        focusState: boolean;
        violationCount: number;
        onlineStatus: boolean;
        screenResolution: string;
        userAgent?: string;
    };
}

export interface SecurityState {
    violationCount: number;
    isLocked: boolean;
    isSubmitted: boolean;
    startTime: number | null;
    remainingTime: number; // in seconds
    status: 'IDLE' | 'ACTIVE' | 'LOCKED' | 'SUBMITTED';
}

export type SecurityAction =
    | { type: 'START_EXAM'; payload: { duration: number } }
    | { type: 'RECORD_VIOLATION' }
    | { type: 'TICK_TIMER' }
    | { type: 'SUBMIT_EXAM' }
    | { type: 'LOCK_EXAM' }
    | { type: 'RESUME_EXAM' }; // Admin unlock
