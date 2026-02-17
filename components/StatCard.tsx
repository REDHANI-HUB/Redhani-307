
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, trendUp }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10 border border-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-500`} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-50 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
