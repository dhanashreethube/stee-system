import { useCallback } from 'react';
import { SecurityLog } from '../types';
import { useSecurityContext } from '../context/SecurityContext';

export const useLogService = (_attemptId: string) => {
    const { dispatch } = useSecurityContext();

    const addLog = useCallback((log: SecurityLog) => {
        dispatch({ type: 'ADD_LOG', payload: log });
    }, [dispatch]);

    // We can keep flushLogs as a no-op or implementation for server syncing if needed later
    // For now, we just want to update the context state
    const flushLogs = useCallback(async () => {
        // Placeholder for future API sync
    }, []);

    return { addLog, flushLogs };
};
