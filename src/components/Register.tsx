import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppView, UserRole } from '../types';
import { Rocket, Mail, Lock, User, Phone, Briefcase, AlertCircle } from 'lucide-react';

interface Props {
  onNavigate: (v: AppView) => void;
}

export default function Register({ onNavigate }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    role: 'intern' as UserRole,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, email, phoneNumber, password, role } = formData;

    if (!fullName || !email || !phoneNumber || !password) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        email,
        phoneNumber,
        role,
        createdAt: serverTimestamp(),
      });
      // App.tsx handles navigation on session change
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start h-full p-6 bg-background overflow-y-auto pt-12">
      <div className="w-full max-w-sm space-y-8 pb-12">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-brand flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-background" />
          </div>
          <h2 className="text-3xl font-black text-brand tracking-tight uppercase">Join the Crew</h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">New Entity Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Full Name</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full h-12 bg-surface border border-white/10 rounded-lg pl-10 pr-4 text-white focus:outline-none focus:border-brand transition-all text-sm"
                placeholder="John Matrix"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 bg-surface border border-white/10 rounded-lg pl-10 pr-4 text-white focus:outline-none focus:border-brand transition-all text-sm"
                placeholder="john@alien.co"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full h-12 bg-surface border border-white/10 rounded-lg pl-10 pr-4 text-white focus:outline-none focus:border-brand transition-all text-sm"
                placeholder="+254 700 000000"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Role</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full h-12 bg-surface border border-white/10 rounded-lg pl-10 pr-4 text-white appearance-none focus:outline-none focus:border-brand transition-all text-sm"
              >
                <option value="intern">Intern</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Cipher Code</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-12 bg-surface border border-white/10 rounded-lg pl-10 pr-4 text-white focus:outline-none focus:border-brand transition-all text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-wider animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-background font-black rounded-lg uppercase tracking-tighter shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all active:scale-98 mt-4"
          >
            {loading ? 'Initializing...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-slate-500 text-xs">
            Already enlisted?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-brand font-bold hover:underline"
            >
              Initiate Session
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
