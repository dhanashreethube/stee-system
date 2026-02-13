import { useEffect, useState } from 'react';
import { useLogService } from './useLogService';

export const useFullscreenGuard = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const { addLog } = useLogService('attempt-123');

    const enterFullscreen = async () => {
        try {
            await document.documentElement.requestFullscreen();
        } catch (e) {
            console.error("Fullscreen blocked", e);
        }
    };

    useEffect(() => {
        const handleChange = () => {
            const isFs = !!document.fullscreenElement;
            setIsFullscreen(isFs);

            if (!isFs) {
                addLog({
                    id: crypto.randomUUID(),
                    eventType: 'FULLSCREEN_EXIT',
                    timestamp: Date.now(),
                    attemptId: 'attempt-123',
                    metadata: {
                        browser: navigator.userAgent,
                        visibilityState: document.visibilityState,
                        focusState: document.hasFocus(),
                        violationCount: -1,
                        onlineStatus: navigator.onLine,
                        screenResolution: `${window.screen.width}x${window.screen.height}`
                    }
                });
            }
        };

        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, [addLog]);

    return { isFullscreen, enterFullscreen };
};
