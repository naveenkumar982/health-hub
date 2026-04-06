
import React, { useState, useEffect, useMemo } from 'react';
import { BookingInfo, HealthPath } from '../types';

interface LiveQueueProps {
  booking: BookingInfo;
  onClose: () => void;
}

const STATUS_MESSAGES = [
  "Doctor is reviewing current case...",
  "Room is being sanitized for the next patient.",
  "Doctor is on a short hydration break.",
  "Assistant is preparing medical charts.",
  "Pharmacist is verifying prescriptions.",
  "Consultation in progress..."
];

const LiveQueue: React.FC<LiveQueueProps> = ({ booking, onClose }) => {
  const [currentServing, setCurrentServing] = useState(booking.initialQueuePosition);
  const [statusText, setStatusText] = useState(STATUS_MESSAGES[0]);
  const isAyurvedic = booking.path === HealthPath.AYURVEDIC;
  const themeColor = isAyurvedic ? 'emerald' : 'blue';

  // Average time per patient in minutes
  const avgTime = isAyurvedic ? 12 : 15;
  const peopleAhead = Math.max(0, booking.tokenNumber - currentServing);
  const estWaitTime = peopleAhead * avgTime;

  useEffect(() => {
    // Simulate current serving token incrementing
    const queueInterval = setInterval(() => {
      setCurrentServing(prev => {
        if (prev < booking.tokenNumber) {
          return prev + 1;
        }
        return prev;
      });
    }, 45000); // Increments roughly every 45 seconds (simulated)

    // Simulate status message updates
    const statusInterval = setInterval(() => {
      const msg = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
      setStatusText(msg);
    }, 8000);

    return () => {
      clearInterval(queueInterval);
      clearInterval(statusInterval);
    };
  }, [booking.tokenNumber]);

  const progressPercentage = useMemo(() => {
    const total = booking.tokenNumber - booking.initialQueuePosition + 1;
    const completed = currentServing - booking.initialQueuePosition;
    return Math.min(100, Math.round((completed / total) * 100));
  }, [currentServing, booking.tokenNumber, booking.initialQueuePosition]);

  const isUserTurn = currentServing === booking.tokenNumber;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Section */}
        <div className={`bg-${themeColor}-600 p-8 text-white relative`}>
          <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-ping"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Tracking</span>
          </div>
          <h2 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-1">Queue Management</h2>
          <h3 className="text-2xl font-bold mb-2">{booking.hospitalName}</h3>
          <p className="text-white/70 text-sm flex items-center">
            <i className="fas fa-map-marker-alt mr-2"></i> Local Medical Plaza, Wing B
          </p>
        </div>

        {/* Content Section */}
        <div className="p-10 space-y-10">
          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Current Serving</p>
              <p className={`text-5xl font-black text-${themeColor}-600 tabular-nums`}>#{currentServing}</p>
            </div>
            <div className="text-center p-6 bg-slate-900 rounded-3xl shadow-lg transform scale-110">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Token</p>
              <p className="text-5xl font-black text-white tabular-nums">#{booking.tokenNumber}</p>
            </div>
          </div>

          {/* Progress Visual */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-slate-900">
                  {isUserTurn ? "It's your turn!" : `${peopleAhead} people ahead of you`}
                </p>
                <p className="text-sm text-slate-500">
                  {isUserTurn ? "Please proceed to Room 104" : `Estimated wait: ~${estWaitTime} mins`}
                </p>
              </div>
              <span className={`text-${themeColor}-600 font-bold text-sm`}>{progressPercentage}% Complete</span>
            </div>
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className={`h-full bg-${themeColor}-600 transition-all duration-1000 ease-out`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Live Status Ticker */}
          <div className="flex items-center space-x-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className={`h-10 w-10 rounded-xl bg-${themeColor}-100 text-${themeColor}-600 flex items-center justify-center shrink-0`}>
              <i className="fas fa-stethoscope"></i>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status Message</p>
              <p className="text-sm font-semibold text-slate-700 animate-pulse">{statusText}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 space-y-4">
            <button 
              onClick={() => window.print()}
              className="w-full flex items-center justify-center space-x-3 py-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all"
            >
              <i className="fas fa-download"></i>
              <span>Download Digital Pass</span>
            </button>
            <button 
              onClick={onClose}
              className={`w-full py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-xl`}
            >
              Return to Hub
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.2em]">
              <i className="fas fa-lock mr-2"></i> Real-time encrypted channel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQueue;
