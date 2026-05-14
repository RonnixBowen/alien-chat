import React from 'react';
import { motion } from 'motion/react';
import { Rocket } from 'lucide-react';

export default function Splash() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 bg-[#05070A]">
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: 'backOut' }}
      >
        <Rocket className="w-24 h-24 text-brand" />
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
          Alien <span className="text-brand">Chat</span>
        </h1>
        <p className="mt-2 text-slate-500 font-medium tracking-widest uppercase text-xs">
          Employee & Intern Pulse
        </p>
      </motion.div>
    </div>
  );
}
