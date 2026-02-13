import { useEffect, useState } from 'react';
import { useSecurityContext } from '../context/SecurityContext';
import { useSecurityMonitor } from '../hooks/useSecurityMonitor';
import { useDefensiveBlockers } from '../hooks/useDefensiveBlockers';
import { useExamTimer } from '../hooks/useExamTimer';
import { useFullscreenGuard } from '../hooks/useFullscreenGuard';
import { WarningModal } from '../components/WarningModal';
import { ViolationBadge } from '../components/ViolationBadge';
import { TimerDisplay } from '../components/TimerDisplay';
import { LogViewer } from '../components/LogViewer';

const SecureTestPage = () => {
    const { state, dispatch } = useSecurityContext();
    const { isFullscreen, enterFullscreen } = useFullscreenGuard();
    const [showWarning, setShowWarning] = useState(false);

    // Initialize Hooks
    useSecurityMonitor();
    useDefensiveBlockers();
    useExamTimer();

    // Monitor for new violations to show modal
    useEffect(() => {
        if (state.violationCount > 0 && state.status === 'ACTIVE') {
            setShowWarning(true);
        }
    }, [state.violationCount]);

    const handleStart = () => {
        enterFullscreen();
        dispatch({ type: 'START_EXAM', payload: { duration: 3600 } });
    };

    if (state.status === 'LOCKED' || state.status === 'SUBMITTED') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-8">
                <div className="max-w-lg text-center">
                    <h1 className="text-4xl font-bold mb-4">
                        {state.status === 'LOCKED' ? '🚫 Exam Locked' : '✅ Exam Submitted'}
                    </h1>
                    <p className="text-slate-300 mb-8">
                        {state.status === 'LOCKED'
                            ? 'You have exceeded the maximum number of security violations. Your session has been terminated.'
                            : 'Thank you. Your answers have been recorded securely.'}
                    </p>
                    <div className="p-4 bg-slate-800 rounded border border-slate-700">
                        <p className="font-mono text-sm">Session ID: {crypto.randomUUID().slice(0, 8)}</p>
                        <p className="font-mono text-sm text-red-400 mt-2">Violations Recorded: {state.violationCount}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (state.status === 'IDLE') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Secure Exam Environment</h1>
                    <div className="my-6 space-y-3 text-left text-sm text-slate-600 bg-blue-50 p-4 rounded border border-blue-100">
                        <p>🔒 <strong>Fullscreen Required:</strong> You must stay in fullscreen.</p>
                        <p>🚫 <strong>No Tab Switching:</strong> Leaving the tab is a violation.</p>
                        <p>👀 <strong>Focus Monitoring:</strong> Losing window focus is recorded.</p>
                        <p>🖱️ <strong>Restricted Input:</strong> Copy, Paste, and Right-click are disabled.</p>
                    </div>
                    <button
                        onClick={handleStart}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition-transform active:scale-95"
                    >
                        Start Exam Session
                    </button>
                </div>
            </div>
        );
    }

    // ACTIVE STATE
    if (!isFullscreen) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white z-50">
                <h2 className="text-3xl font-bold text-red-500 mb-4">⚠️ Fullscreen Required</h2>
                <p className="mb-6">You must return to fullscreen mode to continue the exam.</p>
                <button
                    onClick={enterFullscreen}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded"
                >
                    Return to Fullscreen
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white select-none relative" onContextMenu={(e) => e.preventDefault()}>
            <WarningModal
                isOpen={showWarning}
                violationCount={state.violationCount}
                maxViolations={7}
                onAcknowledge={() => setShowWarning(false)}
            />

            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-16 bg-slate-800 text-white flex items-center justify-between px-6 shadow-md z-40">
                <div className="font-bold text-lg">Final Algorithm Assessment</div>
                <div className="flex items-center gap-6">
                    <ViolationBadge count={state.violationCount} max={7} />
                    <div className="h-8 w-px bg-slate-600"></div>
                    <TimerDisplay seconds={state.remainingTime} total={3600} />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="pt-24 pb-12 px-8 max-w-4xl mx-auto">
                <div className="space-y-8">
                    {/* Mock Question */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Question 1: Algorithm Complexity</h3>
                        <p className="text-slate-600 mb-6">
                            Given a red-black tree with n internal nodes, what is the maximum height of the tree?
                            Explain your reasoning.
                        </p>
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            placeholder="Type your answer here..."
                        ></textarea>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-slate-800">Question 2: System Design</h3>
                        <p className="text-slate-600 mb-6">
                            Design a rate limiter for a distributed system.
                        </p>
                        <textarea
                            className="w-full h-32 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                            placeholder="Type your answer here..."
                        ></textarea>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => dispatch({ type: 'SUBMIT_EXAM' })}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                        Submit Assessment
                    </button>
                </div>
            </main>

            {/* Status Footer */}
            <footer className="fixed bottom-0 left-0 right-0 h-8 bg-slate-100 border-t flex items-center justify-between px-4 text-xs text-slate-400">
                <span>Attempt ID: 8f92-29a...</span>
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Secure Connection Active
                </span>
            </footer>
            <LogViewer />
        </div>
    );
};

export default SecureTestPage;
