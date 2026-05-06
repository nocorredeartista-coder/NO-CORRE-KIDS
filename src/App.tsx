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
  Settings
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
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-brand-lilac blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-brand-blue blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.main 
          key={currentActivity}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 z-10 overflow-hidden"
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
    { id: 'routine', label: 'Rotina', icon: Calendar, bg: 'bg-brand-stone', text: 'text-brand-stone-text', emoji: '☀️' },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Dashboard Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {/* Next Task Card */}
        <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => onSelect('routine')}
            className="bg-white p-6 rounded-[32px] border-4 border-slate-100 shadow-sm flex items-center gap-6 cursor-pointer"
        >
          <div className="bg-brand-yellow/20 p-4 rounded-3xl text-4xl">
            {nextTask?.icon || '✅'}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Próxima Tarefa</span>
            <span className="text-xl font-black text-slate-700 truncate">
               {nextTask ? nextTask.label : "Tudo pronto!"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                Você já fez {completedCount} hoje!
            </span>
          </div>
        </motion.div>

        {/* Emotion Card */}
        <motion.div 
            whileHover={{ y: -5 }}
            onClick={() => onSelect('emotions')}
            className="bg-white p-6 rounded-[32px] border-4 border-slate-100 shadow-sm flex items-center gap-6 cursor-pointer"
        >
          <div className="bg-brand-pink/20 p-4 rounded-3xl text-4xl">💜</div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Como você está?</span>
            <span className="text-xl font-black text-brand-pink-text">
                {progress.currentEmotion || 'Calmo'}
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                Toque para mudar
            </span>
          </div>
        </motion.div>

        {/* Safe Time Card */}
        <div className="bg-white p-6 rounded-[32px] border-4 border-slate-100 shadow-sm flex items-center gap-6">
          <div className="bg-brand-mint/20 p-4 rounded-3xl text-4xl">⏳</div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Tempo Seguro</span>
            <span className="text-xl font-black text-brand-mint-text">
                {timeLeft} minutos
            </span>
            <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                Quase na hora de pausar
            </span>
          </div>
        </div>
      </div>

      <header className="px-4">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Escolha uma Atividade</h2>
      </header>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full px-4 overflow-y-auto pb-8">
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
              "group relative flex flex-col items-center justify-center p-8 rounded-[40px] shadow-sm border-4 border-white transition-all",
              act.bg
            )}
          >
            <span className="text-6xl md:text-7xl mb-4 group-hover:scale-110 transition-transform">{act.emoji}</span>
            <span className={cn("text-2xl font-bold font-kids", act.text)}>{act.label}</span>
          </motion.button>
        ))}
      </div>

      <footer className="mt-4 flex justify-between items-end px-4">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-md relative">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="relative w-12 h-12 bg-orange-200 rounded-full"
            >
              <div className="absolute top-3 left-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
              <div className="absolute top-3 right-2 w-1.5 h-1.5 bg-slate-800 rounded-full" />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-4 h-2 border-b-2 border-slate-800 rounded-full" />
            </motion.div>
          </div>
          <div className="hidden sm:block bg-white px-6 py-3 rounded-2xl shadow-sm border-2 border-slate-100">
            <p className="text-lg font-bold text-slate-500 italic">“Tudo bem descansar um pouco!”</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <button 
            onClick={() => onSelect('parents')}
            className="flex items-center gap-3 bg-white px-5 py-2 rounded-2xl shadow-sm border-2 border-slate-100 hover:border-brand-lilac transition-all"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Settings className="w-5 h-5 text-slate-400" />
            </motion.div>
            <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Responsáveis</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

