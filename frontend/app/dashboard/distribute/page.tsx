"use client";

import { useState, useRef } from "react";
import { useToast } from "@/context/ToastContext";
import api from "@/lib/api";
import { UploadCloud, FileSpreadsheet, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function DistributePage() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [previewData, setPreviewData] = useState<any[] | null>(null);
    const [isDistributing, setIsDistributing] = useState(false);
    const [distributionResult, setDistributionResult] = useState<{ message: string, total: number } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (selectedFile: File) => {
        const validTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
            showToast("Invalid file type. Please upload a .csv or .xlsx file.", "error");
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            showToast("File is too large. Maximum size is 5MB.", "error");
            return;
        }

        setFile(selectedFile);
        setPreviewData(null);
        setDistributionResult(null);
    };

    const handlePreview = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post("/upload/preview", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setPreviewData(res.data.data.tasks.slice(0, 5)); // Show only top 5 rows
            showToast(`Successfully parsed ${res.data.results} valid rows!`, "success");
        } catch (err: any) {
            showToast(err.response?.data?.message || "Failed to preview file.", "error");
            setFile(null); // Reset file if it failed parsing
        } finally {
            setIsUploading(false);
        }
    };

    const handleDistribute = async () => {
        if (!file) return;

        setIsDistributing(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await api.post("/upload/distribute", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setDistributionResult({
                message: res.data.message,
                total: res.data.data.totalDistributed
            });
            showToast("Tasks distributed successfully!", "success");
            setFile(null);
            setPreviewData(null);
        } catch (err: any) {
            showToast(err.response?.data?.message || "Distribution failed.", "error");
        } finally {
            setIsDistributing(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Task Distribution</h1>
                <p className="text-[var(--color-text-secondary)]">Upload a CSV or Excel file to automatically distribute tasks among active agents.</p>
            </div>

            {distributionResult && (
                <div className="mb-8 p-6 glass-panel rounded-2xl border border-green-500/30 bg-green-500/10 flex items-start space-x-4 animate-in slide-in-from-top-4">
                    <div className="p-2 bg-green-500/20 rounded-full">
                        <CheckCircle2 className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-green-400 mb-1">Distribution Complete!</h3>
                        <p className="text-white mb-2">{distributionResult.message}</p>
                        <button
                            onClick={() => setDistributionResult(null)}
                            className="text-sm px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                            Upload Another File
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Zone */}
            {!distributionResult && (
                <div className="space-y-6">
                    <div
                        className={`relative p-10 border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center text-center 
              ${isDragging
                                ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-[1.02]"
                                : file
                                    ? "border-green-500/50 bg-green-500/5"
                                    : "border-white/20 bg-black/20 hover:border-white/40 hover:bg-white/5"
                            }
            `}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => !file && fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".csv, .xlsx, .xls"
                        />

                        {file ? (
                            <div className="flex flex-col items-center animate-in zoom-in-95">
                                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]">
                                    <FileSpreadsheet className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1">{file.name}</h3>
                                <p className="text-sm text-[var(--color-text-secondary)] mb-6">{(file.size / 1024).toFixed(1)} KB • Ready to process</p>

                                <div className="flex space-x-3">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setFile(null); setPreviewData(null); }}
                                        className="px-5 py-2.5 rounded-xl border border-white/10 text-white hover:bg-white/10 transition-colors"
                                    >
                                        Remove
                                    </button>
                                    {!previewData && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handlePreview(); }}
                                            disabled={isUploading}
                                            className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center disabled:opacity-70 disabled:hover:scale-100"
                                        >
                                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Loader2 className="w-5 h-5 mr-2 opacity-0 -ml-7" />}
                                            Preview Data
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center pointer-events-none">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 shadow-inner border border-white/5 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-10 h-10 text-[var(--color-text-secondary)]" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Select a file or drag and drop</h3>
                                <p className="text-[var(--color-text-secondary)] max-w-sm">CSV or Excel Spreadsheet up to 5MB.</p>
                                <div className="mt-6 px-6 py-2.5 rounded-xl bg-white/10 text-white font-medium pointer-events-auto hover:bg-white/20 transition-colors cursor-pointer">
                                    Browse Files
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview & Action Area */}
                    {previewData && (
                        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-xl animate-in slide-in-from-bottom-4">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Data Preview (Top 5 rows)</h3>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Please verify the columns before distributing.</p>
                                </div>
                                <button
                                    onClick={handleDistribute}
                                    disabled={isDistributing}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold shadow-lg shadow-green-500/20 transition-all hover:scale-105 active:scale-95 flex items-center"
                                >
                                    {isDistributing ? (
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    ) : (
                                        <>
                                            Distribute Tasks <ArrowRight className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-black/20 text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">
                                            <th className="p-4 font-semibold">First Name</th>
                                            <th className="p-4 font-semibold">Phone</th>
                                            <th className="p-4 font-semibold">Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {previewData.map((row, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="p-4 text-white font-medium">{row.firstName}</td>
                                                <td className="p-4 text-[var(--color-text-secondary)]">{row.phone}</td>
                                                <td className="p-4 text-[var(--color-text-secondary)] max-w-xs truncate">{row.notes}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
