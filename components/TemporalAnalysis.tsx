
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { CrowdDataPoint } from '../types';

interface TemporalAnalysisProps {
  data: CrowdDataPoint[];
}

const TemporalAnalysis: React.FC<TemporalAnalysisProps> = ({ data }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 h-[400px]">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Temporal Crowd Trends</h2>
        <p className="text-slate-400 text-sm">Comparing actual flow vs. historic predictions</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#f8fafc' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#3b82f6" 
              fillOpacity={1} 
              fill="url(#colorCount)" 
              strokeWidth={3}
              name="Actual Count"
            />
            <Line 
              type="monotone" 
              dataKey="expected" 
              stroke="#94a3b8" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              dot={false}
              name="Historical Expected"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemporalAnalysis;
