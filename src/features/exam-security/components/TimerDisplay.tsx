import { useMemo } from 'react';

export const TimerDisplay = ({ seconds, total }: { seconds: number, total: number }) => {
    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const formatted = useMemo(() => formatTime(seconds), [seconds]);
    const progress = (seconds / total) * 100;
    const isLow = seconds < 300; // 5 mins

    return (
        <div className="flex flex-col items-center">
            <div className={`text-xl font-mono font-bold ${isLow ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
                {formatted}
            </div>
            <div className="w-32 h-1 bg-gray-200 mt-1 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${isLow ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
