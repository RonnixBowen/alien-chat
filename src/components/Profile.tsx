import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { AppView } from '../types';
import { ChevronLeft, LogOut, User, Mail, Phone, Calendar } from 'lucide-react';

interface Props {
  onNavigate: (v: AppView) => void;
}

export default function Profile({ onNavigate }: Props) {
  const { profile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        Loading profile...
      </div>
    );
  }

  const createdDate =
    profile.createdAt?.toDate?.() instanceof Date
      ? profile.createdAt.toDate()
      : null;

  return (
    <div className="flex flex-col h-full bg-background">

      {/* HEADER */}
      <header className="flex items-center p-4 bg-surface border-b border-white/10 shrink-0">
        <button
          onClick={() => onNavigate('chat')}
          className="w-10 h-10 rounded-lg bg-background border border-white/10 flex items-center justify-center hover:border-brand transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>

        <h2 className="ml-4 text-sm font-black text-brand uppercase tracking-tighter">
          Pulse Profile
        </h2>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">

        {/* PROFILE HEADER */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-3xl bg-brand p-1 shadow-[0_0_20px_rgba(0,255,157,0.2)]">
            <div className="w-full h-full rounded-[20px] bg-background flex items-center justify-center">
              <User className="w-12 h-12 text-brand" />
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-black text-white uppercase">
              {profile.fullName || 'Unknown User'}
            </h3>

            <span className="inline-block px-3 py-1 rounded-lg bg-brand/10 border border-brand/20 text-brand text-[10px] font-black uppercase tracking-widest mt-1">
              Role: {profile.role || 'User'}
            </span>
          </div>
        </div>

        {/* DETAILS */}
        <div className="space-y-4 pt-4">

          {/* EMAIL */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/10">
            <Mail className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                Access ID
              </p>
              <p className="text-sm text-white">
                {profile.email || 'Not set'}
              </p>
            </div>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/10">
            <Phone className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                Comm Line
              </p>
              <p className="text-sm text-white">
                {profile.phoneNumber || 'Not available'}
              </p>
            </div>
          </div>

          {/* DATE */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-white/10">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">
                Enlistment Date
              </p>
              <p className="text-sm text-white">
                {createdDate
                  ? createdDate.toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })
                  : 'Unknown'}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* LOGOUT */}
      <div className="p-6 pb-12 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full h-12 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-black uppercase rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}