import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { SecurityState, SecurityAction } from '../types';

const initialState: SecurityState = {
    violationCount: 0,
    isLocked: false,
    isSubmitted: false,
    startTime: null,
    remainingTime: 3600, // Default 1 hour
    status: 'IDLE'
};

const MAX_VIOLATIONS = 7;

function securityReducer(state: SecurityState, action: SecurityAction): SecurityState {
    switch (action.type) {
        case 'START_EXAM':
            return {
                ...state,
                status: 'ACTIVE',
                startTime: Date.now(),
                remainingTime: action.payload.duration
            };
        case 'RECORD_VIOLATION':
            const newCount = state.violationCount + 1;
            const shouldLock = newCount >= MAX_VIOLATIONS;
            return {
                ...state,
                violationCount: newCount,
                isLocked: shouldLock,
                status: shouldLock ? 'LOCKED' : state.status
            };
        case 'TICK_TIMER':
            if (state.status !== 'ACTIVE') return state;
            const newTime = Math.max(0, state.remainingTime - 1);
            return {
                ...state,
                remainingTime: newTime,
                status: newTime === 0 ? 'SUBMITTED' : state.status
            };
        case 'SUBMIT_EXAM':
            return { ...state, status: 'SUBMITTED', isSubmitted: true };
        case 'LOCK_EXAM':
            return { ...state, status: 'LOCKED', isLocked: true };
        case 'RESUME_EXAM':
            return { ...state, status: 'ACTIVE', isLocked: false };
        default:
            return state;
    }
}

interface SecurityContextType {
    state: SecurityState;
    dispatch: React.Dispatch<SecurityAction>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(securityReducer, initialState);

    // Persistence for State Recovery (Crash Protection)
    useEffect(() => {
        const savedState = localStorage.getItem('stee_session_state');
        if (savedState) {
            // In a real app, we would validate this or re-hydrate carefully
            // For now, we assume fresh start for simplicity unless explicitly handling resume logic
        }
    }, []);

    useEffect(() => {
        if (state.status !== 'IDLE') {
            localStorage.setItem('stee_session_state', JSON.stringify(state));
        }
    }, [state]);

    return (
        <SecurityContext.Provider value={{ state, dispatch }}>
            {children}
        </SecurityContext.Provider>
    );
};

export const useSecurityContext = () => {
    const context = useContext(SecurityContext);
    if (!context) {
        throw new Error('useSecurityContext must be used within a SecurityProvider');
    }
    return context;
};
