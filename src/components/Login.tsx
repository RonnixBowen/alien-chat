import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AppView } from '../types';
import { Rocket, Mail, Lock, AlertCircle } from 'lucide-react';

interface Props {
  onNavigate: (v: AppView) => void;
}

export default function Login({ onNavigate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError('Invalid credentials or connection error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-brand flex items-center justify-center mb-4">
            <Rocket className="w-8 h-8 text-background" />
          </div>
          <h2 className="text-3xl font-black text-brand tracking-tight uppercase">Initiate Session</h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Secure Environment • v1.0</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Access ID (Email)</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-surface border border-white/10 rounded-lg pl-10 pr-4 text-white focus:outline-none focus:border-brand transition-all text-sm"
                placeholder="jane.doe@alien.co"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-500 font-bold ml-1 tracking-wider">Cipher Code</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-brand transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            className="w-full h-12 bg-brand hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-background font-black rounded-lg uppercase tracking-tighter shadow-[0_0_15px_rgba(0,255,157,0.3)] transition-all active:scale-98"
          >
            {loading ? 'Transmitting...' : 'Initiate Session'}
          </button>
        </form>

        <div className="text-center pt-4">
          <p className="text-slate-500 text-xs">
            Need registration?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-brand font-bold hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
