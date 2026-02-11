import React, { useState } from 'react';
import type { DashboardStats } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface DailyReportProps {
    stats: DashboardStats;
}

const DailyReport: React.FC<DailyReportProps> = ({ stats }) => {
    const [showMissing, setShowMissing] = useState(false);
    const totalDistricts = stats.uniqueDistricts.length;
    const submittedCount = stats.submittedToday.length;
    const missingCount = stats.uniqueDistricts.length - submittedCount; // Using uniqueDistricts as master list

    return (
        <div className="glass-panel p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">Daily Submission Report</h3>
                    <p className="text-sm text-slate-400">Status for {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <span className="text-sm font-medium text-slate-500">Total Districts</span>
                    <p className="text-xl font-bold text-white">{totalDistricts}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col items-center justify-center">
                    <CheckCircle className="text-emerald-400 mb-2" size={24} />
                    <span className="text-2xl font-bold text-white">{submittedCount}</span>
                    <span className="text-xs text-emerald-300 font-medium uppercase tracking-wide">Submitted</span>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col items-center justify-center">
                    <XCircle className="text-rose-400 mb-2" size={24} />
                    <span className="text-2xl font-bold text-white">{missingCount}</span>
                    <span className="text-xs text-rose-300 font-medium uppercase tracking-wide">Missing</span>
                </div>
            </div>

            {/* Toggle Missing List */}
            <button
                onClick={() => setShowMissing(!showMissing)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:text-white transition-colors border-t border-slate-700/50 mt-2"
            >
                {showMissing ? 'Hide Missing Districts' : 'Show Missing Districts'}
                {showMissing ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
                {showMissing && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                            {stats.missingToday.length > 0 ? (
                                stats.missingToday.map((district, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-slate-800/50 p-2 rounded text-xs text-rose-200">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                        {district}
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center text-emerald-400 text-sm py-2">
                                    🎉 All districts submitted news today!
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DailyReport;
