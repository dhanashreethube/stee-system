import React, { useState, useEffect } from 'react';
import { SecurityLog } from '../types';

export const LogViewer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logs, setLogs] = useState<SecurityLog[]>([]);

    const fetchLogs = () => {
        try {
            const stored = localStorage.getItem('stee_unsent_logs');
            if (stored) {
                setLogs(JSON.parse(stored).reverse()); // Newest first
            }
        } catch (e) {
            console.error("Failed to parse logs", e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchLogs();
            const interval = setInterval(fetchLogs, 1000); // Poll for updates
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:bg-slate-800 transition-all z-50 flex items-center gap-2 border-2 border-slate-700 hover:scale-110 active:scale-95"
                title="View Security Logs"
            >
                <span className="text-2xl">📜</span>
                <span className="font-bold text-sm hidden group-hover:block pr-2">Security Logs</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-8">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Security Audit Logs</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchLogs}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-4 bg-slate-50 font-mono text-sm">
                    {logs.length === 0 ? (
                        <p className="text-gray-400 text-center mt-10">No logs recorded yet.</p>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-slate-200 text-slate-500">
                                    <th className="p-2">Time</th>
                                    <th className="p-2">Event</th>
                                    <th className="p-2">Violations</th>
                                    <th className="p-2">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-200 hover:bg-slate-100">
                                        <td className="p-2 text-slate-500">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </td>
                                        <td className="p-2 font-bold">
                                            <span className={`
                                                ${log.eventType.includes('VIOLATION') || log.eventType.includes('ATTEMPT') ? 'text-red-600' : 'text-blue-600'}
                                            `}>
                                                {log.eventType}
                                            </span>
                                        </td>
                                        <td className="p-2 text-center text-slate-600">
                                            {log.metadata.violationCount}
                                        </td>
                                        <td className="p-2 text-xs text-slate-500 max-w-xs truncate">
                                            {JSON.stringify(log.metadata)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};
