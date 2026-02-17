
import React from 'react';
import { AlertTriangle, Info, ShieldAlert, Clock } from 'lucide-react';
import { Alert } from '../types';

interface AlertPanelProps {
  alerts: Alert[];
  onViewHistory?: () => void;
}

const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onViewHistory }) => {
  return (
    <div className="bg-slate-900 border-l border-slate-800 w-80 flex flex-col">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Live Alerts
        </h2>
        <span className="bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full text-xs font-bold">
          {alerts.length} Active
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {alerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center px-4">
            <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">No critical threats detected at this moment.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border transition-all ${
                alert.severity === 'DANGER' 
                  ? 'bg-red-500/5 border-red-500/20' 
                  : alert.severity === 'WARNING'
                    ? 'bg-orange-500/5 border-orange-500/20'
                    : 'bg-blue-500/5 border-blue-500/20'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  alert.severity === 'DANGER' ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {alert.type}
                </span>
                <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                  <Clock className="w-3 h-3" />
                  {alert.timestamp}
                </div>
              </div>
              <p className="text-sm text-slate-200 font-medium mb-1">{alert.message}</p>
              <p className="text-xs text-slate-500">Location: <span className="text-slate-400">{alert.zone}</span></p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onViewHistory}
          className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors"
        >
          VIEW ALL HISTORY
        </button>
      </div>
    </div>
  );
};

export default AlertPanel;
