"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useToast } from "@/context/ToastContext";
import { Search, Loader2, User, KeyRound } from "lucide-react";

export default function AgentPortal() {
    const [agentId, setAgentId] = useState("");
    const [tasks, setTasks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const { showToast } = useToast();

    const fetchTasks = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!agentId.trim()) return;

        setIsLoading(true);
        setHasSearched(true);

        try {
            const res = await api.get(`/agents/${agentId}/tasks`);
            setTasks(res.data.data.tasks);
            showToast(`Found ${res.data.results} tasks assigned to this agent.`, "success");
        } catch (err: any) {
            showToast(err.response?.data?.message || "Failed to find agent. Check the Agent ID.", "error");
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-background-dark)] flex flex-col items-center pt-24 px-4 overflow-hidden relative">
            {/* Abstract Background */}
            <div className="absolute top-[10%] left-[20%] w-[30%] h-[40%] bg-[var(--color-primary)] opacity-10 blur-[150px] pointer-events-none rounded-full" />
            <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[30%] bg-purple-600 opacity-10 blur-[150px] pointer-events-none rounded-full" />

            <div className="w-full max-w-3xl z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[var(--color-primary)] to-blue-700 shadow-xl shadow-blue-500/20 mb-6 transform transition-transform hover:scale-105">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Agent Task Portal</h1>
                    <p className="text-[var(--color-text-secondary)] text-lg">Enter your Agent ID to view your assigned tasks.</p>
                </div>

                <div className="glass-panel p-6 rounded-2xl shadow-2xl border border-white/10 mb-8">
                    <form onSubmit={fetchTasks} className="flex gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <KeyRound className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                                placeholder="Enter 24-character Agent ID (e.g. 64c3...)"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/30 transition-all text-lg"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !agentId.trim()}
                            className="px-8 py-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center whitespace-nowrap"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6 mr-2" />}
                            {isLoading ? "" : "Look Up"}
                        </button>
                    </form>
                </div>

                {hasSearched && !isLoading && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                        {tasks.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end mb-6">
                                    <h2 className="text-2xl font-bold text-white">Your Assigned Tasks</h2>
                                    <span className="px-3 py-1 bg-white/10 rounded-lg text-white font-medium">Total: {tasks.length}</span>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {tasks.map((task, i) => (
                                        <div key={task._id} className="glass-panel p-5 rounded-xl border border-white/10 hover:border-[var(--color-primary)]/50 transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-bold text-lg text-white group-hover:text-[var(--color-primary)] transition-colors">{task.firstName}</h3>
                                                <span className="text-xs px-2 py-1 bg-white/10 rounded-md text-[var(--color-text-secondary)]">Task #{i + 1}</span>
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-[var(--color-text-secondary)]">
                                                    <span className="text-xs uppercase tracking-wider w-16">Phone:</span>
                                                    <span className="text-white font-medium">{task.phone}</span>
                                                </div>
                                            </div>
                                            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{task.notes || "No notes provided."}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-16 glass-panel rounded-2xl border border-white/10">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                    <Search className="w-8 h-8 text-[var(--color-text-secondary)]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No Tasks Found</h3>
                                <p className="text-[var(--color-text-secondary)] max-w-md mx-auto">Either this Agent ID doesn't exist, or no tasks have been distributed to you yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
