import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Splash from './components/Splash';
import Login from './components/Login';
import Register from './components/Register';
import ChatDashboard from './components/ChatDashboard';
import Profile from './components/Profile';
import { AppView } from './types';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [view, setView] = useState<AppView>('splash');

  useEffect(() => {
    if (loading) return;

    if (view === 'splash') {
      const timer = setTimeout(() => {
        if (user) {
          setView('chat');
        } else {
          setView('login');
        }
      }, 2500);
      return () => clearTimeout(timer);
    }

    if (user && (view === 'login' || view === 'register')) {
      setView('chat');
    } else if (!user && (view === 'chat' || view === 'profile')) {
      setView('login');
    }
  }, [user, loading, view]);

  const renderView = () => {
    switch (view) {
      case 'splash': return <Splash />;
      case 'login': return <Login onNavigate={(v) => setView(v)} />;
      case 'register': return <Register onNavigate={(v) => setView(v)} />;
      case 'chat': return <ChatDashboard onNavigate={(v) => setView(v)} />;
      case 'profile': return <Profile onNavigate={(v) => setView(v)} />;
      default: return <Login onNavigate={(v) => setView(v)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 font-sans selection:bg-brand/30">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="h-screen w-full relative overflow-hidden"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
