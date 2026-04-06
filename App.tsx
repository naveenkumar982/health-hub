
import React, { useState, useEffect } from 'react';
import { View, HealthPath, User, Location, BookingInfo, Clinic } from './types';
import Login from './components/Auth';
import PathSelection from './components/PathSelection';
import ActionSelection from './components/ActionSelection';
import Chatbot from './components/Chatbot';
import BookDoctor from './components/BookDoctor';
import LiveQueue from './components/LiveQueue';
import NearbyQueues from './components/NearbyQueues';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [selectedPath, setSelectedPath] = useState<HealthPath | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [activeBooking, setActiveBooking] = useState<BookingInfo | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location access denied.", error);
        }
      );
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView(View.PATH_SELECTION);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedPath(null);
    setActiveBooking(null);
    setCurrentView(View.LOGIN);
  };

  const handleBookingConfirmed = (info: BookingInfo) => {
    setActiveBooking(info);
    setCurrentView(View.LIVE_QUEUE);
  };

  const handleSelectClinic = (clinic: Clinic) => {
    setSelectedPath(clinic.path);
    // Directly inject clinic info into booking flow
    const token = Math.floor(Math.random() * 20) + 15;
    handleBookingConfirmed({
      hospitalName: clinic.name,
      tokenNumber: token,
      initialQueuePosition: Math.max(1, token - 5),
      path: clinic.path
    });
  };

  const renderView = () => {
    switch (currentView) {
      case View.LOGIN:
      case View.SIGNUP:
        return (
          <Login 
            onLogin={handleLogin} 
            isSignup={currentView === View.SIGNUP} 
            setView={(v) => setCurrentView(v as View)} 
          />
        );
      
      case View.PATH_SELECTION:
        return (
          <PathSelection 
            onSelect={(path) => {
              setSelectedPath(path);
              setCurrentView(View.ACTION_SELECTION);
            }} 
            onNavigate={(v) => setCurrentView(v)}
          />
        );

      case View.NEARBY_QUEUES:
        return (
          <NearbyQueues 
            location={location}
            onBack={() => setCurrentView(View.PATH_SELECTION)}
            onSelectClinic={handleSelectClinic}
          />
        );

      case View.ACTION_SELECTION:
        return (
          <ActionSelection 
            path={selectedPath!} 
            onBack={() => setCurrentView(View.PATH_SELECTION)}
            onSelect={(action) => setCurrentView(action === 'CHAT' ? View.CHATBOT : View.BOOK_DOCTOR)}
          />
        );

      case View.CHATBOT:
        return (
          <Chatbot 
            path={selectedPath!} 
            onBack={() => setCurrentView(View.ACTION_SELECTION)} 
          />
        );

      case View.BOOK_DOCTOR:
        return (
          <BookDoctor 
            path={selectedPath!} 
            location={location}
            onBack={() => setCurrentView(View.ACTION_SELECTION)}
            onConfirmBooking={handleBookingConfirmed}
          />
        );

      case View.LIVE_QUEUE:
        return (
          <LiveQueue 
            booking={activeBooking!} 
            onClose={() => setCurrentView(View.PATH_SELECTION)} 
          />
        );

      default:
        return <div className="p-10 text-center">Page Not Found</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {user && (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => setCurrentView(View.PATH_SELECTION)}
            >
              <div className="bg-emerald-600 p-2 rounded-lg">
                <i className="fas fa-heartbeat text-white text-xl"></i>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">Health Hub</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-600 hidden md:block">Welcome, <span className="font-semibold text-slate-900">{user.username}</span></span>
              <button 
                onClick={handleLogout}
                className="text-slate-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Health Hub. Empowering your wellness journey.
      </footer>
    </div>
  );
};

export default App;
