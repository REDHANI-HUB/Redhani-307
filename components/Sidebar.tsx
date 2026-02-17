
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Activity, 
  Grid3X3, 
  TrendingUp, 
  Car, 
  Bell, 
  ShieldAlert,
  Info,
  Cpu,
  Database,
  Wifi,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [showStatus, setShowStatus] = useState(false);
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'live', label: 'Live Monitoring', icon: Activity },
    { id: 'heatmap', label: 'Heatmap', icon: Grid3X3 },
    { id: 'temporal', label: 'Trends', icon: TrendingUp },
    { id: 'parking', label: 'Smart Parking', icon: Car },
    { id: 'alerts', label: 'Alerts', icon: Bell },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <ShieldAlert className="text-blue-500 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          CrowdVision
        </h1>
      </div>
      
      <nav className="flex-1 py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group active:scale-[0.97] ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'group-hover:text-blue-400'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={() => setShowStatus(true)}
          className="w-full text-left bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 hover:border-blue-500/30 transition-all active:scale-95 group"
        >
          <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 group-hover:text-slate-400">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-slate-300">Predictive Engine Live</span>
          </div>
        </button>
      </div>

      {showStatus && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-500" />
                Diagnostics
              </h3>
              <button onClick={() => setShowStatus(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-slate-300">Neural Load</span>
                </div>
                <span className="text-xs font-mono text-blue-400">14.2%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-slate-300">Sync Status</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">Optimal</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <Wifi className="w-4 h-4 text-amber-400" />
                  <span className="text-sm text-slate-300">Latency</span>
                </div>
                <span className="text-xs font-mono text-amber-400">12ms</span>
              </div>
              <p className="text-[10px] text-slate-500 text-center mt-2 font-mono uppercase">Version: 2.1.0-STABLE</p>
            </div>
            <div className="p-4 bg-slate-950">
              <button 
                onClick={() => setShowStatus(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold transition-all"
              >
                CLOSE DIAGNOSTICS
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
