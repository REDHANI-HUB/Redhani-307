
import React, { useState, useEffect, useRef } from 'react';
import { Users, Camera, Activity, ShieldCheck, X, Download, Plus, Video, Thermometer, Crosshair } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AlertPanel from './components/AlertPanel';
import Dashboard from './views/Dashboard';
import Heatmap from './components/Heatmap';
import TemporalAnalysis from './components/TemporalAnalysis';
import ParkingStatus from './components/ParkingStatus';
import { api } from './services/api';
import { Alert, CrowdDataPoint, ParkingSlot, HeatmapCell } from './types';

interface CameraFeed {
  name: string;
  id: string;
  status: string;
  confidence: string;
  seed: string;
  videoUrl?: string;
}

const CCTVFeed: React.FC<{ feed: CameraFeed; onEnlarge: (feed: CameraFeed) => void }> = ({ feed, onEnlarge }) => (
  <button 
    onClick={() => onEnlarge(feed)}
    className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-blue-500/50 transition-all group text-left active:scale-[0.98]"
  >
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${feed.status === 'Critical' ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
        <span className="text-sm font-bold text-white tracking-wide">CCTV Feed: {feed.name}</span>
      </div>
      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{feed.id}</span>
    </div>
    
    <div className="aspect-video bg-black rounded-xl overflow-hidden relative shadow-inner group">
      {feed.videoUrl ? (
        <video 
          src={feed.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      ) : (
        <img 
          src={`https://picsum.photos/seed/${feed.seed}/800/450`} 
          alt={`Feed from ${feed.name}`}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
            <Activity className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] text-white font-medium uppercase tracking-tighter">YOLO v8 Active</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
            <ShieldCheck className="w-3 h-3 text-green-400" />
            <span className="text-[10px] text-white font-medium">Confidence: {feed.confidence}</span>
          </div>
        </div>
        <div className="bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
          <span className="text-[10px] text-white font-mono">{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
    
    <div className="mt-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase ${feed.status === 'Critical' ? 'text-red-500' : 'text-green-500'}`}>
          {feed.status}
        </span>
      </div>
      <span className="text-[10px] font-bold text-blue-400 group-hover:text-blue-300 transition-colors uppercase tracking-widest">
        ENLARGE FEED
      </span>
    </div>
  </button>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [temporalData, setTemporalData] = useState<CrowdDataPoint[]>([]);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([]);
  const [enlargedFeed, setEnlargedFeed] = useState<CameraFeed | null>(null);
  const [isThermal, setIsThermal] = useState(false);
  const [ptzMessage, setPtzMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cameras, setCameras] = useState<CameraFeed[]>([
    { name: "North Gate Entrance", id: "NG-CAM-01", status: "Stable Flow", confidence: "94.2%", seed: "north", videoUrl: "https://assets.mixkit.io/videos/preview/mixkit-busy-street-in-the-city-at-night-4001-large.mp4" },
    { name: "South Concourse", id: "SC-CAM-04", status: "Increasing Density", confidence: "89.1%", seed: "south", videoUrl: "https://assets.mixkit.io/videos/preview/mixkit-city-traffic-at-night-time-lapse-1678-large.mp4" },
    { name: "East Exit Plaza", id: "EE-CAM-07", status: "Stable Flow", confidence: "96.5%", seed: "east" },
    { name: "West Corridor A", id: "WC-CAM-02", status: "Moderate", confidence: "91.8%", seed: "west" },
    { name: "VIP Lounge Deck", id: "VIP-CAM-01", status: "Stable Flow", confidence: "98.2%", seed: "vip" },
    { name: "Main Atrium", id: "MA-CAM-12", status: "Critical", confidence: "87.4%", seed: "atrium" },
  ]);

  useEffect(() => {
    Promise.all([
      api.getAlerts(),
      api.getTemporalData(),
      api.getParkingStatus(),
      api.getHeatmapData()
    ]).then(([alertsRes, temporalRes, parkingRes, heatmapRes]) => {
      setAlerts(alertsRes);
      setTemporalData(temporalRes);
      setParkingSlots(parkingRes);
      setHeatmapData(heatmapRes);
    });

    const interval = setInterval(() => {
      api.getAlerts().then(setAlerts);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      const newId = `USER-CAM-${Math.floor(Math.random() * 1000)}`;
      const newCamera: CameraFeed = {
        name: `Footage: ${file.name}`,
        id: newId,
        status: "Live Source",
        confidence: "99.9%",
        seed: `seed-${newId}`,
        videoUrl: videoUrl
      };
      setCameras([newCamera, ...cameras]);
    }
  };

  const handleExportLog = () => {
    const header = "Timestamp,Type,Severity,Message,Zone\n";
    const csvContent = alerts.map(a => `${a.timestamp},${a.type},${a.severity},"${a.message}",${a.zone}`).join("\n");
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CrowdVision_AlertLog_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePTZControl = () => {
    setPtzMessage("Initializing Pan-Tilt-Zoom...");
    setTimeout(() => setPtzMessage("Acquiring Target..."), 1500);
    setTimeout(() => setPtzMessage(null), 3500);
  };

  const handleCaptureSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000';
      ctx.fillRect(0,0,1920,1080);
      ctx.fillStyle = '#fff';
      ctx.font = '48px Arial';
      ctx.fillText(`SNAPSHOT: ${enlargedFeed?.name}`, 100, 100);
      ctx.fillText(`TIMESTAMP: ${new Date().toLocaleString()}`, 100, 200);
      
      const link = document.createElement('a');
      link.download = `snapshot_${enlargedFeed?.id}_${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <Dashboard />;
      case 'live':
        return (
          <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring Hub</h1>
                <p className="text-slate-400">Direct integration with YOLO detection streams and neural processing</p>
              </div>
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileUpload} />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors flex items-center gap-2 shadow-lg active:scale-95"
                >
                  <Video className="w-4 h-4" /> Upload Footage
                </button>
                <button onClick={handleExportLog} className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 active:scale-95">
                  <Download className="w-4 h-4" /> Export Log
                </button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cameras.map((feed) => (
                <CCTVFeed key={feed.id} feed={feed} onEnlarge={setEnlargedFeed} />
              ))}
            </div>
          </div>
        );
      case 'heatmap': return <div className="p-8"><Heatmap data={heatmapData} /></div>;
      case 'temporal': return <div className="p-8"><TemporalAnalysis data={temporalData} /></div>;
      case 'parking': return <div className="p-8"><ParkingStatus slots={parkingSlots} /></div>;
      case 'alerts':
        return (
           <div className="p-8 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Security Incident Alerts</h1>
                <button onClick={handleExportLog} className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 active:scale-95">
                  <Download className="w-4 h-4" /> Download Archive
                </button>
              </div>
              {alerts.map(a => (
                <div key={a.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex justify-between items-center group">
                  <div>
                    <h3 className="text-white font-bold">{a.message}</h3>
                    <p className="text-slate-400 text-sm">{a.zone} • {a.timestamp}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 mr-4">DISMISS</button>
                    <span className={`px-4 py-1 rounded-full font-bold text-xs ${a.severity === 'DANGER' ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'}`}>
                      {a.severity}
                    </span>
                  </div>
                </div>
              ))}
           </div>
        );
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto bg-slate-950 flex flex-col">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm font-medium">Facility: Central Arena</span>
            <div className="h-4 w-px bg-slate-700"></div>
            <span className="text-slate-500 text-sm font-medium">Status: Operational</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">Active Operator</span>
              <span className="text-sm text-slate-300">Admin_904</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-all active:scale-90">
              <Users className="w-5 h-5 text-blue-500" />
            </button>
          </div>
        </header>
        <div className="flex-1">{renderContent()}</div>
      </main>

      <AlertPanel alerts={alerts} onViewHistory={() => setActiveTab('alerts')} />

      {enlargedFeed && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 animate-in fade-in zoom-in duration-300">
          <div className="max-w-6xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative">
            <button onClick={() => {setEnlargedFeed(null); setIsThermal(false);}} className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors active:scale-90">
              <X className="w-6 h-6" />
            </button>
            <div className="p-8 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Full View: {enlargedFeed.name}</h2>
                <p className="text-slate-400 font-mono text-sm">{enlargedFeed.id} • Live Neural Processing</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-1 rounded-full font-bold text-sm ${enlargedFeed.status === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                  {enlargedFeed.status}
                </span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Sync Confidence: {enlargedFeed.confidence}</p>
              </div>
            </div>
            <div className="aspect-video bg-black relative overflow-hidden">
              {enlargedFeed.videoUrl ? (
                <video src={enlargedFeed.videoUrl} autoPlay loop muted playsInline className={`w-full h-full object-contain transition-all duration-500 ${isThermal ? 'grayscale hue-rotate-180 invert brightness-125 contrast-125' : ''}`} />
              ) : (
                <img src={`https://picsum.photos/seed/${enlargedFeed.seed}/1920/1080`} className={`w-full h-full object-contain transition-all duration-500 ${isThermal ? 'grayscale hue-rotate-180 invert brightness-125 contrast-125' : ''}`} alt="Enlarged CCTV" />
              )}
              
              {isThermal && (
                <div className="absolute inset-0 pointer-events-none border-[30px] border-red-500/10 mix-blend-overlay"></div>
              )}

              {ptzMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/10 backdrop-blur-[1px]">
                  <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 animate-pulse">
                    <Crosshair className="w-5 h-5" />
                    {ptzMessage}
                  </div>
                </div>
              )}

              <div className="absolute top-4 left-4 flex gap-2">
                 <div className="bg-red-600 px-3 py-1 rounded flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="text-xs font-bold text-white uppercase tracking-widest">REC</span>
                 </div>
                 {isThermal && (
                   <div className="bg-amber-600 px-3 py-1 rounded flex items-center gap-2">
                      <Thermometer className="w-3 h-3 text-white" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">THERMAL-ACTIVE</span>
                   </div>
                 )}
              </div>
              <div className="absolute bottom-4 left-4 text-white font-mono text-xs bg-black/60 p-2 rounded backdrop-blur">
                 ZONE_COORDINATES: [42.102, -18.334]
              </div>
            </div>
            <div className="p-6 bg-slate-950 flex justify-between items-center">
              <div className="flex gap-4">
                 <button onClick={handlePTZControl} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-2">
                   <Crosshair className="w-4 h-4" /> PTZ CONTROL
                 </button>
                 <button 
                  onClick={() => setIsThermal(!isThermal)}
                  className={`${isThermal ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'} text-white px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-2`}
                 >
                   <Thermometer className="w-4 h-4" /> THERMAL OVERLAY
                 </button>
              </div>
              <button onClick={handleCaptureSnapshot} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all active:scale-95 flex items-center gap-2">
                <Camera className="w-4 h-4" /> CAPTURE SNAPSHOT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
