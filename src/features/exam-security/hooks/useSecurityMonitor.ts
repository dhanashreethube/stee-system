import { useEffect, useRef } from 'react';
import { useLogService } from './useLogService';
import { useSecurityContext } from '../context/SecurityContext';

export const useSecurityMonitor = () => {
    const { state, dispatch } = useSecurityContext();
    const { addLog } = useLogService('attempt-123'); // TODO: Dynamic Attempt ID
    const isLockedRef = useRef(state.isLocked);

    // Sync ref with state to use in event listeners without re-binding
    useEffect(() => {
        isLockedRef.current = state.isLocked;
    }, [state.isLocked]);

    useEffect(() => {
        if (state.status !== 'ACTIVE') return;

        // 1. Visibility Change (Tab Switch)
        const handleVisibilityChange = () => {
            if (document.hidden && !isLockedRef.current) {
                addLog({
                    id: crypto.randomUUID(),
                    eventType: 'TAB_SWITCH',
                    timestamp: Date.now(),
                    attemptId: 'attempt-123',
                    metadata: {
                        browser: navigator.userAgent,
                        visibilityState: document.visibilityState,
                        focusState: document.hasFocus(),
                        violationCount: state.violationCount + 1,
                        onlineStatus: navigator.onLine,
                        screenResolution: `${window.screen.width}x${window.screen.height}`
                    }
                });
                dispatch({ type: 'RECORD_VIOLATION' });
            }
        };

        // 2. Blur/Focus (Window Switch)
        const handleBlur = () => {
            if (!isLockedRef.current) {
                addLog({
                    id: crypto.randomUUID(),
                    eventType: 'WINDOW_BLUR',
                    timestamp: Date.now(),
                    attemptId: 'attempt-123',
                    metadata: {
                        browser: navigator.userAgent,
                        visibilityState: document.visibilityState,
                        focusState: false,
                        violationCount: state.violationCount + 1,
                        onlineStatus: navigator.onLine,
                        screenResolution: `${window.screen.width}x${window.screen.height}`
                    }
                });
                dispatch({ type: 'RECORD_VIOLATION' });
            }
        };

        const handleFocus = () => {
            addLog({
                id: crypto.randomUUID(),
                eventType: 'FOCUS_RETURN',
                timestamp: Date.now(),
                attemptId: 'attempt-123',
                metadata: {
                    browser: navigator.userAgent,
                    visibilityState: document.visibilityState,
                    focusState: true,
                    violationCount: state.violationCount,
                    onlineStatus: navigator.onLine,
                    screenResolution: `${window.screen.width}x${window.screen.height}`
                }
            });
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
        };
    }, [state.status, dispatch, addLog, state.violationCount]); // Dependencies
};
