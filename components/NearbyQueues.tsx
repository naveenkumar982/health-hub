
import React, { useState, useEffect } from 'react';
import { Location, Clinic, HealthPath } from '../types';
import { findDoctorsNearLocation } from '../services/geminiService';

interface NearbyQueuesProps {
  location: Location | null;
  onBack: () => void;
  onSelectClinic: (clinic: Clinic) => void;
}

const NearbyQueues: React.FC<NearbyQueuesProps> = ({ location, onBack, onSelectClinic }) => {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [path, setPath] = useState<HealthPath>(HealthPath.NON_AYURVEDIC);

  useEffect(() => {
    fetchNearby();
  }, [location, path]);

  const fetchNearby = async () => {
    if (!location) return;
    setLoading(true);
    try {
      // Corrected to use findDoctorsNearLocation which matches the service export.
      const data = await findDoctorsNearLocation("general checkup", path, location);
      setClinics(data.clinics);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-800 font-medium flex items-center">
          <i className="fas fa-arrow-left mr-2"></i> Back to Hub
        </button>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setPath(HealthPath.NON_AYURVEDIC)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${path === HealthPath.NON_AYURVEDIC ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
          >
            Modern
          </button>
          <button 
            onClick={() => setPath(HealthPath.AYURVEDIC)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${path === HealthPath.AYURVEDIC ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
          >
            Ayurvedic
          </button>
        </div>
      </div>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Live Queue Dashboard</h1>
        <p className="text-slate-500">Real-time patient loads for clinics near your current location.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Tracking nearby hospital status...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clinics.map((clinic) => (
            <div key={clinic.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{clinic.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <i className="fas fa-map-marker-alt mr-1"></i> {clinic.distance} away
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  clinic.status === 'Available' ? 'bg-emerald-100 text-emerald-700' :
                  clinic.status === 'Busy' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {clinic.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Queue</p>
                  <p className="text-2xl font-black text-slate-900">{clinic.currentQueue} <span className="text-xs font-normal text-slate-500">Patients</span></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Wait Time</p>
                  <p className="text-2xl font-black text-slate-900">~{clinic.waitTime} <span className="text-xs font-normal text-slate-500">Mins</span></p>
                </div>
              </div>

              <button 
                onClick={() => onSelectClinic(clinic)}
                className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center space-x-2"
              >
                <span>Book Appointment</span>
                <i className="fas fa-chevron-right text-xs"></i>
              </button>
            </div>
          ))}
          {clinics.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <i className="fas fa-search-location text-4xl text-slate-300 mb-4"></i>
               <p className="text-slate-500 font-medium">No active medical centers detected in immediate vicinity.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyQueues;
