import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Message, AppView } from '../types';
import { Send, User, LogOut, Rocket } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  onNavigate: (v: AppView) => void;
}

export default function ChatDashboard({ onNavigate }: Props) {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !profile) return;

    const text = inputText;
    setInputText('');

    try {
      await addDoc(collection(db, 'messages'), {
        text,
        senderId: user.uid,
        senderName: profile.fullName,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-surface border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand flex items-center justify-center">
            <Rocket className="w-6 h-6 text-background" />
          </div>
          <div>
            <h2 className="text-sm font-black text-brand uppercase tracking-tighter">Alien Chat</h2>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">System Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-bold">Node: Employee-Intern Sync</span>
          <button
            onClick={() => onNavigate('profile')}
            className="w-10 h-10 rounded-lg border border-white/10 bg-surface flex items-center justify-center overflow-hidden hover:border-brand transition-colors"
          >
            <User className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[radial-gradient(circle_at_top_right,rgba(0,255,157,0.05),transparent)]"
      >
        <div className="flex justify-center mb-8">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">Internal Comms Active</span>
        </div>

        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className={`text-[9px] font-black uppercase tracking-widest ${msg.senderId === user?.uid ? 'text-brand' : 'text-slate-500'}`}>
                {msg.senderId === user?.uid ? 'YOU' : msg.senderName}
              </span>
              <span className="text-[9px] text-slate-600 font-mono">
                {msg.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed ${
                msg.senderId === user?.uid
                  ? 'bg-brand text-background rounded-tr-none shadow-[0_5px_20px_rgba(0,255,157,0.15)]'
                  : 'bg-surface text-slate-200 border border-white/5 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-surface border-t border-white/10 shrink-0 pb-8">
        <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
          <div className="bg-background border border-white/10 rounded-xl flex items-center p-1 group focus-within:border-brand transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Transmit message..."
              className="flex-grow bg-transparent px-4 py-3 text-sm text-white focus:outline-none placeholder:text-slate-700"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-10 h-10 bg-brand text-background rounded-lg flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110 transition-all active:scale-90 shadow-[0_0_15px_rgba(0,255,157,0.2)]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
