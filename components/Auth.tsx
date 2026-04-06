
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
  isSignup: boolean;
  setView: (view: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, isSignup, setView }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignup && !username)) return;
    
    onLogin({ 
      username: username || email.split('@')[0], 
      email 
    });
  };

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 text-emerald-600 pointer-events-none">
          <i className="fas fa-hand-holding-medical text-[12rem]"></i>
        </div>
        
        <div className="relative z-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-emerald-100 text-emerald-600 mb-8 shadow-inner">
            <i className="fas fa-heartbeat text-4xl"></i>
          </div>
          <h2 className="text-center text-4xl font-black tracking-tight text-slate-900 mb-2">
            {isSignup ? 'Join Health Hub' : 'Welcome Hub'}
          </h2>
          <p className="text-center text-slate-500 text-sm max-w-[240px] mx-auto leading-relaxed">
            {isSignup ? 'Start tracking your family\'s wellness today.' : 'Sign in to access live queues and consultations.'}
          </p>
        </div>

        <form className="mt-10 space-y-5 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {isSignup && (
              <div className="animate-fade-in-down">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <i className="fas fa-user"></i>
                  </span>
                  <input
                    type="text"
                    required
                    className="block w-full appearance-none rounded-2xl bg-slate-50 border border-slate-200 px-12 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                    placeholder="johndoe_health"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            <div className="animate-fade-in-down delay-75">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Email or Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="text"
                  required
                  className="block w-full appearance-none rounded-2xl bg-slate-50 border border-slate-200 px-12 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                  placeholder="name@healthhub.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="animate-fade-in-down delay-150">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  required
                  className="block w-full appearance-none rounded-2xl bg-slate-50 border border-slate-200 px-12 py-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-2xl bg-slate-900 py-4 px-4 text-sm font-bold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all shadow-xl active:scale-95"
            >
              {isSignup ? 'Create Account' : 'Secure Sign In'}
              <span className="absolute right-4 top-1/2 -translate-y-1/2 group-hover:translate-x-1 transition-transform">
                <i className="fas fa-arrow-right"></i>
              </span>
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => setView(isSignup ? 'LOGIN' : 'SIGNUP')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-500 uppercase tracking-widest transition-colors"
            >
              {isSignup ? 'Already a member? Sign in' : 'New here? Join Health Hub'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
