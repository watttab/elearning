import React from 'react';
import { motion } from 'framer-motion';
import type { NewsItem } from '../types';
import { ExternalLink, Link as LinkIcon, FileText } from 'lucide-react';

interface NewsCardProps {
    item: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
    const isLinkOnly = item.type === 'link';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-4 mb-4 hover:bg-slate-800/50 transition-colors border-l-4 border-l-sky-500 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                {item.type === 'link' ? <LinkIcon size={16} /> : <FileText size={16} />}
            </div>

            <div className="flex justify-between items-start mb-2">
                <span className="bg-sky-500/20 text-sky-300 text-xs px-2 py-1 rounded-full font-medium">
                    {item.district || 'General'}
                </span>
                <span className="text-slate-400 text-xs">
                    {item.date}
                </span>
            </div>

            <div className="mb-3">
                {isLinkOnly ? (
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 font-medium break-all flex items-center gap-2"
                    >
                        <ExternalLink size={14} />
                        {item.link}
                    </a>
                ) : (
                    <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.message}
                    </p>
                )}
            </div>

            {item.type === 'mixed' && item.link && (
                <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-400 flex items-center gap-1 hover:underline"
                    >
                        <ExternalLink size={12} />
                        Attached Link
                    </a>
                </div>
            )}
        </motion.div>
    );
};

export default NewsCard;
