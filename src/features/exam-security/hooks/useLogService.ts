import { useRef, useCallback, useEffect } from 'react';
import { SecurityLog } from '../types';

const LOG_STORAGE_KEY = 'stee_unsent_logs';
const SESSION_HISTORY_KEY = 'stee_session_history';
const BATCH_INTERVAL = 10000; // 10 seconds

export const useLogService = (_attemptId: string) => {
    const logBuffer = useRef<SecurityLog[]>([]);
    const flightBuffer = useRef<SecurityLog[]>([]); // Logs currently sending

    // Core add function - No re-renders
    const addLog = useCallback((log: SecurityLog) => {
        logBuffer.current.push(log);

        // 1. Persist to unsent queue (for sync)
        saveToStorage();

        // 2. Persist to session history (for viewing)
        try {
            const history = JSON.parse(localStorage.getItem(SESSION_HISTORY_KEY) || '[]');
            history.push(log);
            localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.error("Failed to update session history", e);
        }
    }, []);

    const saveToStorage = () => {
        try {
            // Merge current buffer with stored logs (in case of multi-tab race, though highly discouraged)
            // For this implementation, we just overwrite with current buffer + flight buffer
            const allLogs = [...flightBuffer.current, ...logBuffer.current];
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(allLogs));
        } catch (e) {
            console.error("Local storage full check", e);
        }
    };

    const flushLogs = useCallback(async () => {
        if (logBuffer.current.length === 0) return;

        // Move logs to flight buffer
        flightBuffer.current = [...logBuffer.current];
        logBuffer.current = [];

        // Simulate API Call
        try {
            console.log(`[MockAPI] Flushed ${flightBuffer.current.length} logs`, flightBuffer.current);
            // In real world: await api.post('/logs', flightBuffer.current);

            // Clear flight buffer on success
            flightBuffer.current = [];
            saveToStorage(); // Update storage to reflect sent logs
        } catch (e) {
            console.error("Failed to send logs, returning to buffer", e);
            // Restore logs to buffer (prepend)
            logBuffer.current = [...flightBuffer.current, ...logBuffer.current];
            flightBuffer.current = [];
        }
    }, []);

    // Restore on mount
    useEffect(() => {
        const saved = localStorage.getItem(LOG_STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    console.log(`Restoring ${parsed.length} unsent logs`);
                    logBuffer.current = [...parsed, ...logBuffer.current];
                }
            } catch (e) {
                console.error("Corrupt log storage", e);
            }
        }

        const interval = setInterval(() => {
            // Only flush if online
            if (navigator.onLine) {
                flushLogs();
            }
        }, BATCH_INTERVAL);

        return () => clearInterval(interval);
    }, [flushLogs]);

    return { addLog, flushLogs };
};
