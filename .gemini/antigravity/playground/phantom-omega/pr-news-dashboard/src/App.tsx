import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchNewsData, calculateStats } from './services/googleSheet';
import type { NewsItem, DashboardStats } from './types';
import SummaryStats from './components/SummaryStats';
import DailyReport from './components/DailyReport';
import NewsCard from './components/NewsCard';
import { Search, RefreshCw, Filter } from 'lucide-react';
import './index.css';

function App() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const data = await fetchNewsData();
      setNews(data);
      setStats(calculateStats(data));
    } catch (error) {
      console.error("Failed to load news", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    return matchesSearch && matchesDistrict;
  });

  const districts = ['All', ...Array.from(new Set(news.map(item => item.district))).sort()];

  return (
    <div className="min-h-screen text-slate-50 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            PR News Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time updates from community</p>
        </div>

        <button
          onClick={loadData}
          disabled={refreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-slate-700 transition-all ${refreshing ? 'opacity-70' : ''}`}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="text-sm font-medium">Refresh</span>
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Stats & Filters */}
        <section className="lg:col-span-1 space-y-6">
          {stats ? (
            <>
              <DailyReport stats={stats} />
              <SummaryStats stats={stats} />
            </>
          ) : (
            <div className="glass-panel h-64 animate-pulse flex items-center justify-center">
              <span className="text-slate-500">Loading Stats...</span>
            </div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-4 space-y-4 sticky top-4"
          >
            <div className="flex items-center gap-2 text-sky-400 mb-2">
              <Filter size={18} />
              <h3 className="font-semibold">Filters</h3>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-200 placeholder-slate-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-slate-400 uppercase font-semibold tracking-wider">District</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-200 appearance-none cursor-pointer"
              >
                {districts.map(d => (
                  <option key={d} value={d} className="bg-slate-900 text-slate-200">{d}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </section>

        {/* Right Column: News Feed */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-200">Latest Updates</h2>
            <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-1 rounded-full">
              {filteredNews.length} items
            </span>
          </div>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel h-32 animate-pulse mb-4" />
              ))
            ) : filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 glass-panel">
                <p>No news found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
