import React from 'react';

interface WarningModalProps {
    isOpen: boolean;
    violationCount: number;
    maxViolations: number;
    onAcknowledge: () => void;
}

export const WarningModal: React.FC<WarningModalProps> = ({
    isOpen,
    violationCount,
    maxViolations,
    onAcknowledge
}) => {
    if (!isOpen) return null;

    const remaining = maxViolations - violationCount;
    const isCritical = remaining <= 2;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm bg-black/50">
            <div className="p-8 bg-white border-2 border-red-600 rounded-lg shadow-2xl max-w-md animate-bounce-short">
                <h2 className="text-2xl font-bold text-red-700 mb-4">⚠️ Security Violation Detected</h2>
                <p className="text-gray-700 mb-4">
                    You navigated away from the exam window or lost focus.
                    This action has been logged.
                </p>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded mb-6">
                    Violation {violationCount}/{maxViolations}
                </p>
                <button
                    onClick={onAcknowledge}
                    className={`w-full py-3 px-6 rounded text-white font-bold transition-colors
                ${isCritical ? 'bg-red-700 hover:bg-red-800' : 'bg-orange-500 hover:bg-orange-600'}
            `}
                >
                    I Understand & Return to Exam
                </button>
            </div>
        </div>
    );
};
