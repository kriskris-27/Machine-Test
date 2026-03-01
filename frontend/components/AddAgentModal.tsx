"use client";

import { useState } from "react";
import { X, UserPlus, FileText, Phone, Lock, Loader2 } from "lucide-react";

interface AddAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    api: any;
    showToast: (msg: string, type: any) => void;
}

export default function AddAgentModal({ isOpen, onClose, onSuccess, api, showToast }: AddAgentModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await api.post("/agents", formData);
            if (res.data.status === "success") {
                showToast("Agent created successfully!", "success");
                onSuccess();
                onClose();
                setFormData({ name: "", email: "", mobile: "", password: "" });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to create agent";
            showToast(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-md bg-[var(--color-surface-dark)] border border-white/10 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-semibold text-white tracking-tight">Add New Agent</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[var(--color-text-secondary)] hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Jane Doe"
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="jane@example.com"
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Mobile Number</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                required
                                placeholder="+1234567890"
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)]">Include country code (e.g., +1)</p>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-gray-500" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="••••••••"
                                minLength={6}
                                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Agent"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
