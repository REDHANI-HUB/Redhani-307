
import React, { useState, useMemo } from 'react';
import { RefreshCw, Filter, Car, Battery, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { ParkingSlot } from '../types';

interface ParkingStatusProps {
  slots: ParkingSlot[];
}

const ParkingStatus: React.FC<ParkingStatusProps> = ({ slots: initialSlots }) => {
  const [slots, setSlots] = useState<ParkingSlot[]>(initialSlots);
  const [filter, setFilter] = useState<'ALL' | 'STANDARD' | 'DISABLED' | 'EV'>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);

  const filteredSlots = useMemo(() => {
    if (filter === 'ALL') return slots;
    return slots.filter(s => s.type === filter);
  }, [slots, filter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      const updatedSlots = slots.map(slot => ({
        ...slot,
        occupied: Math.random() > 0.4
      }));
      setSlots(updatedSlots);
      setIsRefreshing(false);
    }, 800);
  };

  const toggleSlotStatus = (id: string) => {
    setSlots(prev => prev.map(s => 
      s.id === id ? { ...s, occupied: !s.occupied } : s
    ));
    if (selectedSlot?.id === id) {
      setSelectedSlot(prev => prev ? { ...prev, occupied: !prev.occupied } : null);
    }
  };

  const occupiedCount = slots.filter(s => s.occupied).length;
  const occupancyRate = ((occupiedCount / slots.length) * 100).toFixed(1);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            <Car className="text-blue-500" />
            Smart Parking Hub
          </h2>
          <p className="text-slate-400 text-sm">Real-time facility management and slot allocation</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300 transition-colors disabled:opacity-50"
            title="Refresh Status"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700">
            {(['ALL', 'STANDARD', 'DISABLED', 'EV'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  filter === f ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 mb-8">
        {filteredSlots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => setSelectedSlot(slot)}
            className={`h-10 rounded-lg border-2 transition-all flex items-center justify-center relative group ${
              slot.occupied 
                ? 'bg-slate-700/50 border-slate-600 text-slate-500' 
                : 'bg-blue-500/10 border-blue-500/50 text-blue-400 hover:bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
            }`}
            title={`${slot.id}: ${slot.occupied ? 'Occupied' : 'Available'}`}
          >
            {slot.type === 'EV' && <Battery className="w-4 h-4" />}
            {slot.type === 'DISABLED' && <UserIcon className="w-4 h-4" />}
            {slot.type === 'STANDARD' && <span className="text-[10px] font-bold">{slot.id.split('-')[1]}</span>}
            
            {!slot.occupied && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Car className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Occupancy</p>
            <p className="text-2xl font-bold text-white">{occupancyRate}%</p>
          </div>
        </div>
        
        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Available</p>
            <p className="text-2xl font-bold text-white">{slots.length - occupiedCount}</p>
          </div>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700/50 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg">
            <Battery className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">EV Points</p>
            <p className="text-2xl font-bold text-white">6 Active</p>
          </div>
        </div>
      </div>

      {/* Slot Management Modal Overlay */}
      {selectedSlot && (
        <div className="absolute inset-0 z-10 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Slot {selectedSlot.id}</h3>
                <span className="text-xs bg-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono uppercase tracking-widest">
                  {selectedSlot.type} ZONE
                </span>
              </div>
              <div className={`p-2 rounded-lg ${selectedSlot.occupied ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {selectedSlot.occupied ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Current Status</span>
                <span className={`font-bold ${selectedSlot.occupied ? 'text-red-500' : 'text-green-500'}`}>
                  {selectedSlot.occupied ? 'OCCUPIED' : 'VACANT'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Time in Status</span>
                <span className="text-slate-200 font-mono">01:24:05</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Rate (Hourly)</span>
                <span className="text-slate-200">$4.50</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => toggleSlotStatus(selectedSlot.id)}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${
                  selectedSlot.occupied 
                    ? 'bg-blue-600 text-white hover:bg-blue-500' 
                    : 'bg-red-600 text-white hover:bg-red-500'
                }`}
              >
                {selectedSlot.occupied ? 'FORCE RELEASE' : 'MARK RESERVED'}
              </button>
              <button 
                onClick={() => setSelectedSlot(null)}
                className="py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-bold text-sm transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParkingStatus;
