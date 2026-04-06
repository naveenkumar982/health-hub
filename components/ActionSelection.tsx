
import React from 'react';
import { HealthPath } from '../types';

interface ActionSelectionProps {
  path: HealthPath;
  onBack: () => void;
  onSelect: (action: 'CHAT' | 'BOOK') => void;
}

const ActionSelection: React.FC<ActionSelectionProps> = ({ path, onBack, onSelect }) => {
  const isAyurvedic = path === HealthPath.AYURVEDIC;
  const themeColor = isAyurvedic ? 'emerald' : 'blue';

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back to selection
      </button>

      <div className="text-center mb-12">
        <span className={`inline-block px-4 py-1.5 rounded-full bg-${themeColor}-100 text-${themeColor}-700 text-sm font-bold uppercase tracking-wider mb-4`}>
          {isAyurvedic ? 'Ayurvedic Path' : 'Modern Path'}
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">What would you like to do?</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          {isAyurvedic 
            ? 'Consult our specialized Ayurvedic AI or book a session with a certified practitioner.' 
            : 'Access our high-performance medical AI or schedule an appointment with a specialist.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('CHAT')}
          className={`flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-${themeColor}-500 transition-all text-left w-full group`}
        >
          <div className={`h-14 w-14 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <i className="fas fa-robot text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Health Chatbot</h3>
          <p className="text-slate-500 text-center text-sm leading-relaxed">
            Get instant guidance, symptom analysis, and health advice from our AI specialist.
          </p>
        </button>

        <button
          onClick={() => onSelect('BOOK')}
          className={`flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-${themeColor}-500 transition-all text-left w-full group`}
        >
          <div className={`h-14 w-14 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            <i className="fas fa-calendar-check text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Book a Doctor</h3>
          <p className="text-slate-500 text-center text-sm leading-relaxed">
            Find and schedule an appointment with the best practitioners in your local area.
          </p>
        </button>
      </div>
    </div>
  );
};

export default ActionSelection;
