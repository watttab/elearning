import React from 'react';
import type { DashboardStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Users, MapPin } from 'lucide-react';

interface SummaryStatsProps {
    stats: DashboardStats;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
    const data = stats.districtCounts.slice(0, 5); // Top 5 districts

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Stat Cards */}
            <motion.div
                className="glass-panel p-4 flex items-center gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Total Posts</p>
                    <h3 className="text-2xl font-bold text-white">{stats.totalPosts}</h3>
                </div>
            </motion.div>

            <motion.div
                className="glass-panel p-4 flex items-center gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <div className="p-3 bg-purple-500/20 rounded-full text-purple-400">
                    <Users size={24} /> {/* Using Users icon as placeholder for Activity/Today */}
                </div>
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Today</p>
                    <h3 className="text-2xl font-bold text-white">{stats.postsToday}</h3>
                </div>
            </motion.div>

            <motion.div
                className="glass-panel p-4 flex items-center gap-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="p-3 bg-amber-500/20 rounded-full text-amber-400">
                    <MapPin size={24} />
                </div>
                <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider">Top District</p>
                    <h3 className="text-xl font-bold text-white truncate max-w-[120px]">{stats.activeDistrict}</h3>
                </div>
            </motion.div>

            {/* Chart Section - Full Width on Mobile */}
            <motion.div
                className="glass-panel p-4 col-span-1 md:col-span-3 mt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                <h4 className="text-sm font-semibold text-slate-300 mb-4">Activity by District (Top 5)</h4>
                <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={80}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#38bdf8' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index === 0 ? '#38bdf8' : '#64748b'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default SummaryStats;
