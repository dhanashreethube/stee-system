import { useEffect } from 'react';
import { useLogService } from './useLogService';

export const useDefensiveBlockers = () => {
    const { addLog } = useLogService('attempt-123');

    useEffect(() => {
        const preventAction = (e: Event, type: any) => {
            e.preventDefault();
            addLog({
                id: crypto.randomUUID(),
                eventType: type,
                timestamp: Date.now(),
                attemptId: 'attempt-123',
                metadata: {
                    browser: navigator.userAgent,
                    visibilityState: document.visibilityState,
                    focusState: document.hasFocus(),
                    violationCount: -1, // Not tracked here directly
                    onlineStatus: navigator.onLine,
                    screenResolution: `${window.screen.width}x${window.screen.height}`
                }
            });
        };

        const handleContextMenu = (e: MouseEvent) => preventAction(e, 'RIGHT_CLICK_BLOCKED');
        const handleCopy = (e: ClipboardEvent) => preventAction(e, 'COPY_ATTEMPT');
        const handlePaste = (e: ClipboardEvent) => preventAction(e, 'PASTE_ATTEMPT');
        const handleCut = (e: ClipboardEvent) => preventAction(e, 'COPY_ATTEMPT'); // Treated same as copy

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste);
        document.addEventListener('cut', handleCut);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste);
            document.removeEventListener('cut', handleCut);
        };
    }, [addLog]);
};
