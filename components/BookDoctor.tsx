
import React, { useState, useEffect, useMemo } from 'react';
import { HealthPath, Location, BookingInfo } from '../types';
import { findDoctorsNearLocation } from '../services/geminiService';

interface BookDoctorProps {
  path: HealthPath;
  location: Location | null;
  onBack: () => void;
  onConfirmBooking: (info: BookingInfo) => void;
}

interface SelectedDoctor {
  hospitalName: string;
  location?: string;
  uri?: string;
}

const BookDoctor: React.FC<BookDoctorProps> = ({ path, location, onBack, onConfirmBooking }) => {
  const [issue, setIssue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ text: string; groundingSources: any[] } | null>(null);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor | null>(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Reminder State
  const [reminderInterval, setReminderInterval] = useState('1 hour');
  const [reminderSet, setReminderSet] = useState(false);
  const [showReminderSuccess, setShowReminderSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  // Filter State
  const [minRating, setMinRating] = useState<number>(0);
  const [availability, setAvailability] = useState<string>('any');

  const isAyurvedic = path === HealthPath.AYURVEDIC;
  const themeColor = isAyurvedic ? 'emerald' : 'blue';

  // Generate a stable reference ID when booking is confirmed
  useEffect(() => {
    if (isBookingConfirmed && !bookingRef) {
      setBookingRef(Math.random().toString(36).substring(2, 9).toUpperCase());
    }
  }, [isBookingConfirmed, bookingRef]);

  // Fee calculation based on specialization path
  const FEES = isAyurvedic 
    ? { consultancy: 45.00, platform: 4.50, name: 'Ayurvedic Specialist' } 
    : { consultancy: 115.00, platform: 12.00, name: 'Modern Medicine Specialist' };

  const handleSearch = async () => {
    if (!issue.trim()) return;
    if (!location) {
      alert("We need your location to find nearby doctors. Please enable GPS and refresh.");
      return;
    }
    
    setIsLoading(true);
    setFeedback(null);
    setSelectedDoctor(null);
    setIsBookingConfirmed(false);
    try {
      const data = await findDoctorsNearLocation(issue, path, location, {
        minRating,
        availability
      });
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookDoctor = (hospitalName: string, uri?: string) => {
    setSelectedDoctor({ hospitalName, uri });
  };

  const proceedToQueue = () => {
    const token = Math.floor(Math.random() * 20) + 15; // User token between 15 and 35
    const initialPos = token - (Math.floor(Math.random() * 10) + 5); // Start queue a few places back
    
    onConfirmBooking({
      hospitalName: selectedDoctor?.hospitalName || "Selected Specialist",
      tokenNumber: token,
      initialQueuePosition: Math.max(1, initialPos),
      path: path
    });
  };

  const handleSetReminder = () => {
    const reminderData = {
      ref: bookingRef,
      hospital: selectedDoctor?.hospitalName,
      interval: reminderInterval,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`reminder_${bookingRef}`, JSON.stringify(reminderData));
    setReminderSet(true);
    setShowReminderSuccess(true);
    // Hide success pulse after 3 seconds
    setTimeout(() => setShowReminderSuccess(false), 3000);
  };

  const RatingFilter = () => (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Min. Rating</label>
      <div className="flex items-center space-x-2">
        {[0, 3, 4, 4.5].map((val) => (
          <button
            key={val}
            onClick={() => setMinRating(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              minRating === val 
                ? `bg-${themeColor}-600 border-${themeColor}-600 text-white shadow-sm` 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {val === 0 ? 'Any' : `${val}+ ⭐`}
          </button>
        ))}
      </div>
    </div>
  );

  const AvailabilityFilter = () => (
    <div className="flex flex-col space-y-2">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Availability</label>
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'any', label: 'Anytime' },
          { id: 'today', label: 'Today' },
          { id: 'this_week', label: 'This Week' }
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setAvailability(opt.id)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              availability === opt.id 
                ? `bg-${themeColor}-600 border-${themeColor}-600 text-white shadow-sm` 
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (selectedDoctor && !isBookingConfirmed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <button 
          onClick={() => setSelectedDoctor(null)}
          className="mb-8 flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium"
        >
          <i className="fas fa-arrow-left mr-2"></i> Back to results
        </button>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
          <div className={`bg-${themeColor}-600 px-8 py-10 text-white text-center`}>
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              <i className="fas fa-file-invoice-dollar text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold">Billing Summary</h2>
            <p className="text-white/80 text-sm">Review your selection for {FEES.name}</p>
          </div>

          <div className="p-8 space-y-6">
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Hospital Name</p>
                <p className="text-lg font-bold text-slate-900">{selectedDoctor.hospitalName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm text-slate-600">Local Area (See Maps for full address)</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-slate-600">
                <span className="flex flex-col">
                  <span>Consultancy Fee</span>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Specialization: {FEES.name}</span>
                </span>
                <span className="font-semibold text-slate-900">${FEES.consultancy.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="flex items-center">
                  Platform Fee
                  <i className="fas fa-info-circle ml-1.5 text-slate-300 text-xs cursor-help" title="Service charge for platform facilitation."></i>
                </span>
                <span className="font-semibold text-slate-900">${FEES.platform.toFixed(2)}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-lg font-bold text-slate-900">Total Amount</span>
                <span className={`text-2xl font-black text-${themeColor}-600`}>
                  ${(FEES.consultancy + FEES.platform).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setIsBookingConfirmed(true)}
                className={`w-full py-4 rounded-2xl bg-${themeColor}-600 text-white font-bold text-lg hover:bg-${themeColor}-700 shadow-lg shadow-${themeColor}-200 transition-all active:scale-[0.98]`}
              >
                Proceed to Checkout
              </button>
              <p className="text-center text-[10px] text-slate-400 uppercase mt-4 tracking-widest">
                <i className="fas fa-shield-alt mr-1"></i> Secure specialized health services
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isBookingConfirmed) {
    const currentDate = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center animate-scale-in">
        <div className="mb-8 scale-110">
          <div className={`h-24 w-24 bg-${themeColor}-100 text-${themeColor}-600 rounded-full flex items-center justify-center mx-auto shadow-inner`}>
            <i className="fas fa-check-circle text-5xl"></i>
          </div>
        </div>
        
        <div className="space-y-4 mb-10">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Confirmed!</h2>
          <p className="text-slate-600 text-lg max-w-sm mx-auto leading-relaxed">
            Your appointment at <span className="font-bold text-slate-900">{selectedDoctor?.hospitalName}</span> has been successfully scheduled.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-6 transition-all duration-300">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
          >
            <span className="font-bold text-slate-700 flex items-center">
              <i className="fas fa-calendar-alt mr-3 text-slate-400"></i>
              Appointment Details
            </span>
            <i className={`fas fa-chevron-${showDetails ? 'up' : 'down'} text-slate-400 transition-transform`}></i>
          </button>
          
          {showDetails && (
            <div className="px-6 pb-6 text-left space-y-4 animate-fade-in-down border-t border-slate-100 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Reference ID</p>
                  <p className="font-mono font-bold text-slate-700">#{bookingRef}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                  <p className="font-bold text-slate-700">{isAyurvedic ? 'Ayurvedic' : 'Modern'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Provider</p>
                  <p className="font-bold text-slate-700">{selectedDoctor?.hospitalName}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="font-bold text-slate-700">{currentDate}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time</p>
                  <p className="font-bold text-slate-700">{currentTime}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reminder Section */}
        <div className={`bg-white rounded-2xl border ${reminderSet ? `border-${themeColor}-200 ring-2 ring-${themeColor}-500/10 shadow-lg` : 'border-slate-200 shadow-sm'} p-6 mb-10 text-left transition-all duration-300 relative overflow-hidden`}>
          {showReminderSuccess && (
            <div className={`absolute inset-0 bg-${themeColor}-500/5 animate-pulse pointer-events-none`}></div>
          )}
          
          <div className="flex items-center space-x-3 mb-4">
            <div className={`h-10 w-10 rounded-xl bg-${themeColor}-100 text-${themeColor}-600 flex items-center justify-center transition-transform ${showReminderSuccess ? 'scale-110' : ''}`}>
              <i className={`fas ${reminderSet ? 'fa-bell' : 'fa-bell-slash'}`}></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-900">Set Appointment Reminder</h4>
              <p className="text-xs text-slate-500">Choose when you'd like to be notified.</p>
            </div>
          </div>

          {!reminderSet ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap gap-2">
                {['15 mins', '1 hour', '3 hours', '1 day'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setReminderInterval(opt)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      reminderInterval === opt 
                        ? `bg-${themeColor}-600 border-${themeColor}-600 text-white shadow-md` 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSetReminder}
                className={`w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 active:scale-95`}
              >
                <i className="fas fa-check"></i>
                <span>Confirm Reminder</span>
              </button>
            </div>
          ) : (
            <div className={`flex flex-col space-y-4 animate-fade-in`}>
              <div className={`p-3 rounded-xl bg-${themeColor}-50 border border-${themeColor}-100 flex items-center justify-between`}>
                <div className="flex items-center space-x-2">
                  <i className={`fas fa-check-circle text-${themeColor}-600`}></i>
                  <p className={`text-sm font-bold text-${themeColor}-700`}>
                    Reminder set for {reminderInterval} before
                  </p>
                </div>
                {showReminderSuccess && (
                  <span className={`text-[10px] font-black uppercase text-${themeColor}-600 animate-bounce tracking-widest`}>Saved!</span>
                )}
              </div>
              <button 
                onClick={() => setReminderSet(false)}
                className="text-xs text-slate-400 hover:text-slate-600 underline font-semibold flex items-center self-end"
              >
                <i className="fas fa-edit mr-1"></i> Change Reminder
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <button 
            onClick={proceedToQueue}
            className={`w-full py-4 rounded-2xl bg-${themeColor}-600 text-white font-bold text-lg hover:bg-${themeColor}-700 shadow-lg shadow-${themeColor}-200 transition-all flex items-center justify-center space-x-3 active:scale-[0.98]`}
          >
            <i className="fas fa-clock"></i>
            <span>Track Live Queue</span>
          </button>
          <button 
            onClick={onBack}
            className={`px-8 py-3 rounded-xl text-slate-500 font-semibold hover:text-slate-800 transition-all`}
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium"
      >
        <i className="fas fa-arrow-left mr-2"></i> Back
      </button>

      {!results ? (
        <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100">
          <div className="text-center mb-10">
            <div className={`h-20 w-20 bg-${themeColor}-100 text-${themeColor}-600 rounded-full flex items-center justify-center mx-auto mb-6`}>
              <i className="fas fa-user-md text-4xl"></i>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Specialist</h1>
            <p className="text-slate-500">Describe what's bothering you, and we'll find the best match near you.</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <RatingFilter />
              <AvailabilityFilter />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Tell us about your health issue</label>
              <textarea 
                className={`w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 min-h-[120px] transition-all shadow-sm`}
                placeholder="e.g., Persistent lower back pain, seasonal allergies, digestive issues..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              />
            </div>

            {!location && (
              <div className="p-4 bg-amber-50 rounded-xl flex items-start space-x-3 border border-amber-200">
                <i className="fas fa-map-marker-alt text-amber-600 mt-1"></i>
                <p className="text-sm text-amber-700">
                  Location services are currently disabled. We need your location to find doctors nearby.
                </p>
              </div>
            )}

            <button
              onClick={handleSearch}
              disabled={isLoading || !issue.trim() || !location}
              className={`w-full py-4 rounded-2xl bg-${themeColor}-600 text-white font-bold text-lg hover:bg-${themeColor}-700 shadow-lg shadow-${themeColor}-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-3`}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-circle-notch animate-spin"></i>
                  <span>Searching Best Matches...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-search"></i>
                  <span>Find Best Doctors</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-3xl font-bold text-slate-900">Recommended Specialists</h2>
            <button 
              onClick={() => {
                setResults(null);
                setFeedback(null);
              }}
              className={`text-${themeColor}-600 font-semibold hover:underline flex items-center`}
            >
              <i className="fas fa-plus-circle mr-2"></i> Start New Search
            </button>
          </div>

          {/* Quick Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-end gap-6">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <RatingFilter />
              <AvailabilityFilter />
            </div>
            <button 
              onClick={handleSearch}
              disabled={isLoading}
              className={`px-6 py-2.5 rounded-xl bg-${themeColor}-600 text-white font-bold text-sm hover:bg-${themeColor}-700 transition-all disabled:opacity-50 h-fit mb-1`}
            >
              {isLoading ? <i className="fas fa-sync animate-spin mr-2"></i> : <i className="fas fa-filter mr-2"></i>}
              Update Results
            </button>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="mb-8">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {results.text}
              </div>
            </div>

            {results.groundingSources.length > 0 && (
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Verified Map Locations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.groundingSources.map((source, i) => (
                    source.maps && (
                      <div 
                        key={i}
                        className={`flex flex-col p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-${themeColor}-500 transition-all group shadow-sm`}
                      >
                        <div className="flex items-center mb-4">
                          <div className={`h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-${themeColor}-600 mr-4 group-hover:scale-110 transition-transform`}>
                            <i className="fas fa-hospital-alt"></i>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Hospital Name</p>
                            <p className="font-bold text-slate-900 truncate">{source.maps.title}</p>
                            <a 
                              href={source.maps.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-[10px] text-${themeColor}-600 font-bold hover:underline flex items-center mt-1 uppercase`}
                            >
                              Location: View Maps <i className="fas fa-external-link-alt ml-1 scale-75"></i>
                            </a>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleBookDoctor(source.maps.title, source.maps.uri)}
                          className={`w-full py-2.5 rounded-xl bg-white border border-${themeColor}-200 text-${themeColor}-600 font-bold text-sm hover:bg-${themeColor}-600 hover:text-white transition-all`}
                        >
                          Book & Checkout
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="pt-6 border-t border-slate-100 flex flex-col items-center sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
              <span className="text-sm font-medium text-slate-600">Was this information helpful?</span>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setFeedback('up')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border ${feedback === 'up' ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-500 hover:text-emerald-500'}`}
                >
                  <i className="fas fa-thumbs-up"></i>
                  <span className="text-sm font-semibold">Yes</span>
                </button>
                <button 
                  onClick={() => setFeedback('down')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all border ${feedback === 'down' ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-red-500 hover:text-red-500'}`}
                >
                  <i className="fas fa-thumbs-down"></i>
                  <span className="text-sm font-semibold">No</span>
                </button>
              </div>
            </div>
            {feedback && (
              <p className="text-center text-xs text-emerald-600 font-medium mt-4 animate-bounce">
                Thank you for your feedback! It helps us improve our recommendations.
              </p>
            )}
          </div>
          
          <div className={`bg-${themeColor}-50 border border-${themeColor}-100 p-6 rounded-3xl text-center`}>
            <p className={`text-${themeColor}-700 font-medium`}>
              Call our support line for assistance: 1-800-HEALTH-HUB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDoctor;
