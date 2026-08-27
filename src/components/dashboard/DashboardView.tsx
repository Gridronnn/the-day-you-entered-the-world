import React from 'react';
import {
  Inbox,
  Flame,
  Clock,
  Sparkles,
  Zap,
  BarChart3,
  Download,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import { useEmail } from '../../context/EmailContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

const CATEGORY_CHART_COLORS: Record<string, string> = {
  Important: '#f43f5e',
  Work: '#6366f1',
  Academic: '#10b981',
  Personal: '#a855f7',
  Finance: '#f59e0b',
  Shopping: '#f97316',
  Newsletters: '#06b6d4',
  Promotions: '#ec4899',
  Social: '#0ea5e9',
  'Spam Risk': '#ef4444',
  Others: '#64748b'
};

export const DashboardView: React.FC = () => {
  const { analytics, setActiveView, setSelectedEmailId, setSelectedCategory } = useEmail();
  const { showToast } = useToast();

  const handleExportCsv = () => {
    window.open(api.getExportCsvUrl(), '_blank');
    showToast('success', 'Report Exported', 'Downloading fmail_ai_productivity_report.csv');
  };

  const categoryData = (analytics?.categoryDistribution || []).map((c) => ({
    name: c.category,
    count: c.count,
    color: CATEGORY_CHART_COLORS[c.category] || '#64748b'
  }));

  const weeklyData = analytics?.weeklyVolume || [
    { day: 'Mon', received: 12, processed: 10 },
    { day: 'Tue', received: 18, processed: 16 },
    { day: 'Wed', received: 15, processed: 14 },
    { day: 'Thu', received: 22, processed: 20 },
    { day: 'Fri', received: 19, processed: 19 },
    { day: 'Sat', received: 8, processed: 8 },
    { day: 'Sun', received: 5, processed: 5 }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 overflow-y-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Productivity Dashboard</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time telemetry, automated triage metrics, and daily actionable workflow plan.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 text-slate-800 dark:text-white shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4 text-indigo-500" />
          <span>Export Viva Report (.CSV)</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveView('inbox')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inbox</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.totalEmails || 35}
          </div>
          <div className="text-[11px] text-slate-400">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{analytics?.unreadCount || 0} unread</span> • 100% triaged
          </div>
        </div>

        <div
          onClick={() => setActiveView('focus')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Urgent Focus</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
            {analytics?.urgentCount || 0}
          </div>
          <div className="text-[11px] text-slate-400">
            Deadlines & high-priority items
          </div>
        </div>

        <div
          onClick={() => setActiveView('followups')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Awaiting Reply</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">
            {analytics?.pendingFollowUps || 2}
          </div>
          <div className="text-[11px] text-slate-400">
            SLA Follow-up Reminders
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Time Saved</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {Math.round((analytics?.timeSavedMinutes || 85) / 60)} hrs {(analytics?.timeSavedMinutes || 85) % 60}m
          </div>
          <div className="text-[11px] text-slate-400">
            Automated triage & AI reply staging
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Today’s Email Action Plan</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Recommended automated triage</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {analytics?.todayPlan.map((plan) => (
            <div
              key={plan.id}
              onClick={() => {
                if (plan.emailId) {
                  setActiveView('inbox');
                  setSelectedEmailId(plan.emailId);
                } else if (plan.type === 'follow_up') {
                  setActiveView('followups');
                } else {
                  setActiveView('inbox');
                }
              }}
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  {plan.urgency === 'high' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                  )}
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                    {plan.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-center justify-end text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-1 group-hover:translate-x-0.5 transition-transform">
                <span>{plan.actionLabel}</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <span>Weekly Email Volume & Automation</span>
            </h3>
            <span className="text-xs text-slate-400">Last 7 Days</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="received" name="Received" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="processed" name="Auto-Triaged" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span>Category Distribution (11 Classes)</span>
            </h3>
            <span className="text-xs text-slate-400">Total Classified</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-52 w-52 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto w-full text-xs">
              {categoryData.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setActiveView('inbox');
                    setSelectedCategory(cat.name as any);
                  }}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="truncate text-slate-700 dark:text-slate-300">{cat.name}</span>
                  </div>
                  <span className="font-bold text-slate-500 ml-1">{cat.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
