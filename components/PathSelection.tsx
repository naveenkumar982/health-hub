
import React from 'react';
import { HealthPath, View } from '../types';

interface PathSelectionProps {
  onSelect: (path: HealthPath) => void;
  onNavigate: (view: View) => void;
}

const PathSelection: React.FC<PathSelectionProps> = ({ onSelect, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">How can we help you today?</h1>
        <p className="text-xl text-slate-600">Select your preferred system of healthcare or check local wait times.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <button
          onClick={() => onSelect(HealthPath.AYURVEDIC)}
          className="group relative flex flex-col items-center bg-white p-10 rounded-3xl shadow-md border-2 border-transparent hover:border-emerald-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 text-emerald-100 group-hover:text-emerald-500 transition-colors">
            <i className="fas fa-leaf text-8xl opacity-20"></i>
          </div>
          <div className="bg-emerald-100 p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-mortar-pestle text-4xl text-emerald-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ayurvedic</h2>
          <p className="text-slate-600 text-center leading-relaxed">
            Traditional holistic healing focusing on balance, herbal remedies, and lifestyle.
          </p>
          <div className="mt-8 px-6 py-2 bg-emerald-600 text-white rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Select Ayurvedic
          </div>
        </button>

        <button
          onClick={() => onSelect(HealthPath.NON_AYURVEDIC)}
          className="group relative flex flex-col items-center bg-white p-10 rounded-3xl shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-4 text-blue-100 group-hover:text-blue-500 transition-colors">
            <i className="fas fa-stethoscope text-8xl opacity-20"></i>
          </div>
          <div className="bg-blue-100 p-6 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-user-md text-4xl text-blue-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Modern Medicine</h2>
          <p className="text-slate-600 text-center leading-relaxed">
            Modern evidence-based medicine, specialized consultations, and clinical diagnosis.
          </p>
          <div className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Select Modern
          </div>
        </button>
      </div>

      {/* Live Queue Widget */}
      <button 
        onClick={() => onNavigate(View.NEARBY_QUEUES)}
        className="w-full bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col sm:flex-row items-center justify-between hover:bg-slate-800 transition-all group overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 opacity-10 group-hover:scale-125 transition-transform">
          <i className="fas fa-map-marked-alt text-[12rem] -mr-12 -mt-12"></i>
        </div>
        <div className="flex flex-col items-center sm:items-start relative z-10">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Live Nearby Hub</span>
          </div>
          <h3 className="text-2xl font-bold mb-1">Track Local Queue Status</h3>
          <p className="text-slate-400 text-sm">See which clinics have the shortest wait times near you right now.</p>
        </div>
        <div className="mt-6 sm:mt-0 flex items-center space-x-4 relative z-10">
          <div className="text-right hidden sm:block">
            <p className="text-2xl font-black">15-45m</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Avg Local Wait</p>
          </div>
          <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      </button>
    </div>
  );
};

export default PathSelection;
