
import React, { useState, useEffect } from 'react';
import { Users, LayoutGrid, AlertCircle, Clock, Sparkles, Settings, X, Check } from 'lucide-react';
import StatCard from '../components/StatCard';
import { api } from '../services/api';
import { getAIPrediction } from '../services/gemini';
import { PredictionResult } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showAutomationSettings, setShowAutomationSettings] = useState(false);
  
  // Automation states
  const [automation, setAutomation] = useState({
    autoGates: true,
    paAlerts: true,
    lighting: false
  });

  useEffect(() => {
    api.getOverview().then(setStats);
  }, []);

  const handleRunPrediction = async () => {
    if (!stats) return;
    setIsPredicting(true);
    try {
      const res = await getAIPrediction(stats.currentCount, stats.density, []);
      setPrediction(res);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPredicting(false);
    }
  };

  const toggleAutomation = (key: keyof typeof automation) => {
    setAutomation(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (!stats) return <div className="p-10 text-slate-500">Loading metrics...</div>;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white">Security Command Overview</h1>
          <p className="text-slate-400 mt-1">From Reactive Crowd Control to Predictive Crowd Prevention</p>
        </div>
        <button 
          onClick={handleRunPrediction}
          disabled={isPredicting}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50 active:scale-95"
        >
          {isPredicting ? (
            <span className="flex items-center gap-2 animate-pulse">
              <Clock className="w-5 h-5 animate-spin" />
              Analyzing patterns...
            </span>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate AI Insight
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Crowd Count" 
          value={stats.currentCount.toLocaleString()} 
          icon={Users} 
          color="blue" 
          trend="+12% vs last hour" 
          trendUp={true} 
        />
        <StatCard 
          title="Density Level" 
          value={stats.density} 
          icon={LayoutGrid} 
          color="amber" 
          trend="Increasing" 
          trendUp={true} 
        />
        <StatCard 
          title="Congestion Alerts" 
          value={stats.alertCount} 
          icon={AlertCircle} 
          color="red" 
        />
        <StatCard 
          title="Parking Occupancy" 
          value={`${stats.parkingOccupancy}%`} 
          icon={Clock} 
          color="emerald" 
        />
      </div>

      {prediction && (
        <div className="bg-slate-800/80 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-blue-500/10 pointer-events-none group-hover:text-blue-500/20 transition-all">
            <Sparkles className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Gemini Predictive Analysis</h2>
              <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded">Next 60 Min Forecast</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Predicted Crowd Risk</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-white">{prediction.riskScore}%</span>
                    <div className="flex-1 h-3 bg-slate-700 rounded-full mb-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-red-500" 
                        style={{ width: `${prediction.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Forecasted Count</p>
                  <p className="text-3xl font-bold text-blue-400">{prediction.forecastedCount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <p className="text-slate-400 text-sm mb-3">AI Recommendations</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prediction.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </div>
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Venue Surveillance Feed</h2>
          <div className="aspect-video bg-black rounded-xl relative flex items-center justify-center group overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>
            <video 
              src="https://assets.mixkit.io/videos/preview/mixkit-busy-street-in-the-city-at-night-4001-large.mp4" 
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[20s]" 
            />
            <div className="relative z-20 text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-white font-bold text-lg">CCTV Feed: South Gate</p>
              <p className="text-slate-400 text-sm">YOLO Processing Active • 60 FPS</p>
            </div>
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 flex flex-col justify-center text-center space-y-6 relative overflow-hidden">
           {showAutomationSettings && (
             <div className="absolute inset-0 bg-slate-900/95 z-20 p-6 flex flex-col items-start text-left animate-in slide-in-from-right-4 duration-300 backdrop-blur-sm">
                <div className="flex justify-between items-center w-full mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" />
                    Automation Config
                  </h3>
                  <button onClick={() => setShowAutomationSettings(false)} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4 w-full">
                  <button 
                    onClick={() => toggleAutomation('autoGates')}
                    className={`flex items-center justify-between p-3 rounded-lg border w-full transition-colors ${automation.autoGates ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-700 opacity-60'}`}
                  >
                    <span className="text-sm text-slate-300">Auto-Open Gates</span>
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${automation.autoGates ? 'bg-blue-600' : 'bg-slate-600'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${automation.autoGates ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                  <button 
                    onClick={() => toggleAutomation('paAlerts')}
                    className={`flex items-center justify-between p-3 rounded-lg border w-full transition-colors ${automation.paAlerts ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-700 opacity-60'}`}
                  >
                    <span className="text-sm text-slate-300">Smart PA Alerts</span>
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${automation.paAlerts ? 'bg-blue-600' : 'bg-slate-600'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${automation.paAlerts ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                  <button 
                    onClick={() => toggleAutomation('lighting')}
                    className={`flex items-center justify-between p-3 rounded-lg border w-full transition-colors ${automation.lighting ? 'bg-slate-800 border-blue-500/50' : 'bg-slate-900 border-slate-700 opacity-60'}`}
                  >
                    <span className="text-sm text-slate-300">Predictive Lighting</span>
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${automation.lighting ? 'bg-blue-600' : 'bg-slate-600'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${automation.lighting ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </button>
                </div>
                <button 
                  onClick={() => setShowAutomationSettings(false)}
                  className="mt-auto w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-all"
                >
                  SAVE CHANGES
                </button>
             </div>
           )}
           <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto">
             <AlertCircle className="w-12 h-12 text-blue-500" />
           </div>
           <div>
             <h3 className="text-2xl font-bold text-white">Dynamic Flow Management</h3>
             <p className="text-slate-400 max-w-sm mx-auto mt-2">
               The system has automatically opened 3 additional ticket turnstiles to alleviate pressure on the West corridor.
             </p>
           </div>
           <button 
             onClick={() => setShowAutomationSettings(true)}
             className="text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors active:scale-95"
           >
             MODIFY AUTOMATED ACTIONS →
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
