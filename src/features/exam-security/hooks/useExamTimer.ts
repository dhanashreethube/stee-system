import { useEffect, useRef } from 'react';
import { useSecurityContext } from '../context/SecurityContext';

export const useExamTimer = () => {
    const { state, dispatch } = useSecurityContext();
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (state.status === 'ACTIVE' && state.remainingTime > 0) {
            intervalRef.current = window.setInterval(() => {
                dispatch({ type: 'TICK_TIMER' });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [state.status, dispatch]);
};
