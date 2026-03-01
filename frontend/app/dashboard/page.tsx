"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Users, Plus, Loader2, MoreVertical, RefreshCw } from "lucide-react";
import AddAgentModal from "@/components/AddAgentModal";
import { useToast } from "@/context/ToastContext";

interface Agent {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    createdAt: string;
}

export default function AgentsPage() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();

    const fetchAgents = async () => {
        try {
            setLoading(true);
            const res = await api.get("/agents");
            setAgents(res.data.data.agents);
            setError("");
        } catch (err: any) {
            setError("Failed to load agents. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Agents Management</h1>
                    <p className="text-[var(--color-text-secondary)]">View and manage support agents in the system.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchAgents}
                        className="p-2.5 rounded-xl border border-white/10 text-[var(--color-text-secondary)] hover:text-white hover:bg-white/5 transition-all group"
                        title="Refresh list"
                    >
                        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                        <span className="font-medium">Add Agent</span>
                    </button>
                </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin mb-4" />
                        <p className="text-[var(--color-text-secondary)] font-medium tracking-wide animate-pulse">Loading agents...</p>
                    </div>
                ) : error ? (
                    <div className="py-16 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4 border border-red-500/20">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <p className="text-red-400 font-medium mb-4">{error}</p>
                        <button onClick={fetchAgents} className="px-4 py-2 rounded-lg border border-red-500/30 text-red-300 hover:bg-red-500/10 transition-colors text-sm font-medium">Try Again</button>
                    </div>
                ) : agents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-white/5">
                            <Users className="w-10 h-10 text-[var(--color-text-secondary)]/50" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No agents found</h3>
                        <p className="text-[var(--color-text-secondary)] max-w-sm text-center">Get started by adding a new agent to the system so they can receive distributed tasks.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5 text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">
                                    <th className="p-5 font-semibold">Agent Profile</th>
                                    <th className="p-5 font-semibold">Contact Details</th>
                                    <th className="p-5 font-semibold">Date Added</th>
                                    <th className="p-5 font-semibold text-center">Status</th>
                                    <th className="p-5 font-semibold"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {agents.map((agent, index) => (
                                    <tr
                                        key={agent._id}
                                        className="hover:bg-white/5 transition-colors group animate-in fade-in slide-in-from-bottom-2"
                                        style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-purple-600 flex items-center justify-center text-white font-bold shadow-lg text-sm border border-white/10">
                                                    {agent.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white tracking-wide">{agent.name}</p>
                                                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">ID: {agent._id.slice(-6)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-[var(--color-text-secondary)]">{agent.email}</p>
                                            <p className="text-sm text-[var(--color-text-secondary)] mt-1">{agent.mobile}</p>
                                        </td>
                                        <td className="p-5">
                                            <p className="text-sm text-[var(--color-text-secondary)]">
                                                {new Date(agent.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                                <span>Active</span>
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="p-2 text-[var(--color-text-secondary)] hover:text-white rounded-lg hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modals */}
            <AddAgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAgents}
                api={api}
                showToast={showToast}
            />
        </div>
    );
}
