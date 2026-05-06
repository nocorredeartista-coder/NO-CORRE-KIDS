/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Dog, 
  Volume2, 
  Heart, 
  Wind, 
  Pencil, 
  Calendar,
  Settings,
  Hash
} from 'lucide-react';
import { SensoryProvider, useSensory } from './contexts/SensoryContext';
import { ParentProvider, useParent } from './contexts/ParentContext';
import { ActivityType } from './types';
import { cn, playAudio } from './lib/utils';

// Import Screens
import Letters from './components/Letters';
import Animals from './components/Animals';
import Breathe from './components/Breathe';
import Emotions from './components/Emotions';
import Routine from './components/Routine';
import FreeDraw from './components/FreeDraw';
import SpeechModule from './components/SpeechModule';
import ParentArea from './components/ParentArea';
import Numbers from './components/Numbers';

export default function App() {
  return (
    <SensoryProvider>
      <ParentProvider>
        <AppContent />
      </ParentProvider>
    </SensoryProvider>
  );
}

function AppContent() {
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('home');
  const { trackProgress } = useParent();
  const { settings } = useSensory();

  const handleBack = () => setCurrentActivity('home');

  const renderActivity = () => {
    switch (currentActivity) {
      case 'home': return <Home onSelect={(a) => {
        setCurrentActivity(a);
        trackProgress('activity', a);
      }} />;
      case 'letters': return <Letters onBack={handleBack} />;
      case 'animals': return <Animals onBack={handleBack} />;
      case 'breathe': return <Breathe onBack={handleBack} />;
      case 'emotions': return <Emotions onBack={handleBack} onSuggest={setCurrentActivity} />;
      case 'routine': return <Routine onBack={handleBack} />;
      case 'draw': return <FreeDraw onBack={handleBack} />;
      case 'speech': return <SpeechModule onBack={handleBack} />;
      case 'numbers': return <Numbers onBack={handleBack} />;
      case 'parents': return <ParentArea onBack={handleBack} />;
      default: return <Home onSelect={setCurrentActivity} />;
    }
  };

  return (
    <div className={cn(
      "relative w-full h-screen bg-bg-natural overflow-hidden flex flex-col transition-all duration-700",
      settings.lowStimulation ? "grayscale-[0.2]" : ""
    )}>
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-lilac blur-3xl invisible md:visible" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-brand-blue blur-3xl invisible md:visible" />
      </div>

      <AnimatePresence mode="wait">
        <motion.main 
          key={currentActivity}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex-1 w-full max-w-[1100px] mx-auto px-3 md:px-6 py-2 md:py-8 z-10 overflow-y-auto custom-scrollbar flex flex-col"
        >
          {renderActivity()}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}

function Home({ onSelect }: { onSelect: (activity: ActivityType) => void }) {
  const { settings: sensory } = useSensory();
  const { progress, settings: parentSettings } = useParent();
  
  const completedCount = progress.routineTasks?.filter(t => t.completed).length || 0;
  const nextTask = progress.routineTasks?.find(t => !t.completed);

  // Time remaining logic (simple calculation)
  const [timeLeft, setTimeLeft] = useState<number>(0);
  useEffect(() => {
    if (!parentSettings.startTime) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - parentSettings.startTime!) / 60000;
      const remaining = Math.max(0, parentSettings.timeLimitMinutes - elapsed);
      setTimeLeft(Math.round(remaining));
    }, 10000);
    return () => clearInterval(interval);
  }, [parentSettings.startTime, parentSettings.timeLimitMinutes]);

  const activities = [
    { id: 'letters', label: 'Letras', icon: BookOpen, bg: 'bg-brand-blue', text: 'text-brand-blue-text', emoji: '✍️' },
    { id: 'animals', label: 'Animais', icon: Dog, bg: 'bg-brand-mint', text: 'text-brand-mint-text', emoji: '🐶' },
    { id: 'speech', label: 'Falar', icon: Volume2, bg: 'bg-brand-yellow', text: 'text-brand-yellow-text', emoji: '🔊' },
    { id: 'emotions', label: 'Emoções', icon: Heart, bg: 'bg-brand-pink', text: 'text-brand-pink-text', emoji: '💜' },
    { id: 'breathe', label: 'Respirar', icon: Wind, bg: 'bg-brand-indigo', text: 'text-brand-indigo-text', emoji: '🌙' },
    { id: 'draw', label: 'Desenhar', icon: Pencil, bg: 'bg-brand-orange', text: 'text-brand-orange-text', emoji: '🖍️' },
    { id: 'numbers', label: 'Números', icon: Hash, bg: 'bg-brand-lilac', text: 'text-brand-lilac-text', emoji: '🔢' },
    { id: 'routine', label: 'Rotina', icon: Calendar, bg: 'bg-brand-stone', text: 'text-brand-stone-text', emoji: '☀️' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Dashboard Section */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-4">
        {/* Next Task Card */}
        <motion.div 
            whileHover={{ y: -2 }}
            onClick={() => onSelect('routine')}
            className="bg-white p-3 md:p-4 rounded-[24px] md:rounded-[32px] border-2 md:border-4 border-slate-100 shadow-sm flex items-center gap-3 md:gap-4 cursor-pointer"
        >
          <div className="bg-brand-yellow/20 p-2 md:p-3 rounded-xl md:rounded-2xl text-2xl md:text-3xl shrink-0">
            {nextTask?.icon || '✅'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Rotina</span>
            <span className="text-sm md:text-lg font-black text-slate-700 truncate">
               {nextTask ? nextTask.label : "Tudo pronto!"}
            </span>
          </div>
        </motion.div>

        {/* Emotion Card */}
        <motion.div 
            whileHover={{ y: -2 }}
            onClick={() => onSelect('emotions')}
            className="bg-white p-3 md:p-4 rounded-[24px] md:rounded-[32px] border-2 md:border-4 border-slate-100 shadow-sm flex items-center gap-3 md:gap-4 cursor-pointer"
        >
          <div className="bg-brand-pink/20 p-2 md:p-3 rounded-xl md:rounded-2xl text-2xl md:text-3xl shrink-0">💜</div>
          <div className="flex flex-col">
            <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Humor</span>
            <span className="text-sm md:text-lg font-black text-brand-pink-text">
                {progress.currentEmotion || 'Calmo'}
            </span>
          </div>
        </motion.div>

        {/* Safe Time Card - Visible only on larger screens or as a small pill elsewhere */}
        <div className="hidden lg:flex bg-white p-4 rounded-[32px] border-4 border-slate-100 shadow-sm items-center gap-4">
          <div className="bg-brand-mint/20 p-3 rounded-2xl text-3xl">⏳</div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tempo Seguro</span>
            <span className="text-lg font-black text-brand-mint-text">
                {timeLeft} minutos
            </span>
          </div>
        </div>
      </div>

      <header className="px-4 flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">O que vamos fazer?</h2>
        <div className="flex items-center gap-2 bg-brand-mint/10 px-3 py-1 rounded-full border border-brand-mint/20">
            <span className="text-[9px] md:text-[10px] font-black text-brand-mint-text uppercase">⏳ {timeLeft}m</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full px-2">
        {activities.map((act, idx) => (
          <motion.button
            key={act.id}
            onClick={() => {
              playAudio(act.label, sensory.voiceSpeed, sensory.volume);
              onSelect(act.id as ActivityType);
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              delay: idx * 0.05,
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
            className={cn(
              "group relative flex flex-col items-center justify-center p-4 md:p-6 rounded-[28px] md:rounded-[36px] shadow-sm border-2 md:border-4 border-white transition-all min-h-[140px] md:min-h-[180px]",
              act.bg
            )}
          >
            <span className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">{act.emoji}</span>
            <span className={cn("text-lg md:text-xl font-bold font-kids", act.text)}>{act.label}</span>
          </motion.button>
        ))}
      </div>

      <footer className="mt-2 flex justify-between items-center px-4 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative shrink-0">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative w-8 h-8 bg-orange-200 rounded-full"
            >
              <div className="absolute top-2 left-1 w-0.5 h-0.5 bg-slate-800 rounded-full" />
              <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-slate-800 rounded-full" />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-1 border-b-2 border-slate-800 rounded-full" />
            </motion.div>
          </div>
          <p className="text-[10px] md:text-sm font-bold text-slate-400 italic">Pausas também ajudam 💜</p>
        </div>

        <button 
          onClick={() => onSelect('parents')}
          className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border-2 border-slate-100 hover:border-brand-lilac transition-all"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Pais</span>
        </button>
      </footer>
    </div>
  );
}

