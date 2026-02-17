
import React from 'react';
import { HeatmapCell } from '../types';

interface HeatmapProps {
  data: HeatmapCell[];
}

const Heatmap: React.FC<HeatmapProps> = ({ data }) => {
  const getColor = (intensity: number) => {
    if (intensity < 0.2) return 'bg-emerald-500/20';
    if (intensity < 0.4) return 'bg-emerald-500/60';
    if (intensity < 0.6) return 'bg-yellow-500/60';
    if (intensity < 0.8) return 'bg-orange-500/80';
    return 'bg-red-600';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 relative overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Spatial Density Heatmap</h2>
          <p className="text-slate-400 text-sm">Real-time distribution of pedestrians in Zone A-4</p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded"></div> Low</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-500 rounded"></div> Medium</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-600 rounded"></div> High</div>
        </div>
      </div>
      
      <div className="grid grid-cols-10 gap-1 aspect-video relative">
        {data.map((cell, idx) => (
          <div
            key={idx}
            className={`rounded-sm transition-all duration-700 hover:ring-2 hover:ring-white/20 ${getColor(cell.intensity)}`}
            title={`Density: ${(cell.intensity * 100).toFixed(0)}%`}
          />
        ))}
        {/* Simplified Overlay Map Lines */}
        <div className="absolute inset-0 border-2 border-slate-700/30 pointer-events-none grid grid-cols-2 grid-rows-2">
          <div className="border-r border-b border-slate-600/20 flex items-end p-2 text-[10px] text-slate-500 font-mono">NORTH WING</div>
          <div className="border-b border-slate-600/20 flex items-end p-2 text-[10px] text-slate-500 font-mono">SOUTH WING</div>
          <div className="border-r border-slate-600/20 flex items-end p-2 text-[10px] text-slate-500 font-mono">WEST ENTRANCE</div>
          <div className="flex items-end p-2 text-[10px] text-slate-500 font-mono">EAST EXIT</div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;
