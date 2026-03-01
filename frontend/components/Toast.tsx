"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
}

const Toast = ({ id, message, type, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [id, onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-400" />,
        error: <AlertCircle className="w-5 h-5 text-red-400" />,
        info: <Info className="w-5 h-5 text-blue-400" />,
    };

    const bgColors = {
        success: "bg-green-500/10 border-green-500/20",
        error: "bg-red-500/10 border-red-500/20",
        info: "bg-blue-500/10 border-blue-500/20",
    };

    return (
        <div className={`flex items-center space-x-3 p-4 rounded-xl border glass-panel shadow-lg ${bgColors[type]} animate-in slide-in-from-right-8 fade-in duration-300`}>
            {icons[type]}
            <p className="flex-1 text-sm font-medium text-white">{message}</p>
            <button onClick={() => onClose(id)} className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/70 hover:text-white">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
