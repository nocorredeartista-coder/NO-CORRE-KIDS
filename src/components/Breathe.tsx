import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw, Wind, Flower2, Heart } from 'lucide-react';
import { playAudio, cn } from '../lib/utils';
import { useSensory } from '../contexts/SensoryContext';

type BreathingMode = 'nuvem' | 'balao' | 'flor';

export default function Breathe({ onBack }: { onBack: () => void }) {
  const { settings } = useSensory();
  const [mode, setMode] = useState<BreathingMode>('nuvem');
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    playAudio("Respire junto com a animação. Vamos começar?", settings.voiceSpeed, settings.volume);
    playAudio("Puxe o ar...", settings.voiceSpeed, settings.volume);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (phase === 'inhale') {
            setPhase('hold');
            playAudio("Segura...", settings.voiceSpeed, settings.volume);
            return 2;
          } else if (phase === 'hold') {
            setPhase('exhale');
            playAudio("Solta devagar...", settings.voiceSpeed, settings.volume);
            return 4;
          } else {
            setPhase('inhale');
            playAudio("Puxa o ar...", settings.voiceSpeed, settings.volume);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, settings]);

  const getLabel = () => {
    if (phase === 'inhale') return "Puxa o ar...";
    if (phase === 'hold') return "Segura...";
    return "Solta devagar...";
  };

  const getSubLabel = () => {
    if (mode === 'flor') {
      return phase === 'inhale' ? "Cheira a florzinha 🌸" : phase === 'exhale' ? "Sopra a vela 🕯️" : "Sinta o perfume...";
    }
    if (mode === 'balao') {
      return phase === 'inhale' ? "Encha o balão 🎈" : phase === 'exhale' ? "Solte o ar do balão 🌬️" : "Não deixe estourar!";
    }
    return phase === 'inhale' ? "Encha o peito ☁️" : phase === 'exhale' ? "Esvazie devagar 🌬️" : "Fique calmo...";
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm z-20">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-4 bg-slate-100 rounded-full text-slate-500 shadow-sm"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
        
        <div className="text-center">
          <h2 className="text-3xl font-black text-brand-indigo uppercase tracking-tighter">Respirar</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
            Respire junto com a animação
          </p>
        </div>

        <div className="w-12" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        
        {/* Mode Selector */}
        <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-sm border-2 border-white">
          {(['nuvem', 'balao', 'flor'] as BreathingMode[]).map((m) => (
            <motion.button
              key={m}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setMode(m);
                setPhase('inhale');
                setTimer(4);
                playAudio(`Modo ${m}`, settings.voiceSpeed, settings.volume);
              }}
              className={cn(
                "px-6 py-2 rounded-2xl font-bold uppercase text-xs tracking-widest transition-all",
                mode === m ? "bg-brand-indigo text-white shadow-md scale-105" : "bg-slate-50 text-slate-400"
              )}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {/* Breathing Animation */}
        <div className="relative w-80 h-80 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode + phase}
              initial={{ scale: phase === 'inhale' ? 0.6 : 1.2 }}
              animate={{ 
                scale: phase === 'inhale' ? 1.2 : phase === 'exhale' ? 0.6 : 1.2,
              }}
              transition={{ 
                duration: phase === 'hold' ? 0 : 4,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              {mode === 'nuvem' && (
                <div className="relative">
                  <div className="text-[12rem] drop-shadow-xl">☁️</div>
                  <motion.div
                    animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 -right-4"
                  >
                    <SparklesIcon className="w-12 h-12 text-yellow-400" />
                  </motion.div>
                </div>
              )}
              {mode === 'balao' && (
                <div className="w-64 h-80 bg-red-400 rounded-full border-8 border-red-500 shadow-xl flex items-center justify-center overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-12 h-20 bg-white/30 rounded-full blur-sm" />
                </div>
              )}
              {mode === 'flor' && (
                <div className="relative">
                  <Flower2 className="w-64 h-64 text-pink-400 fill-pink-100" strokeWidth={1} />
                  {phase === 'inhale' && (
                    <motion.div
                      animate={{ y: [0, -20], opacity: [1, 0], scale: [0.5, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute top-1/4 left-1/2 -translate-x-1/2"
                    >
                      <Heart className="w-12 h-12 text-pink-300 fill-current" />
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="12"
              className="opacity-20"
            />
            <motion.circle
              cx="160"
              cy="160"
              r="150"
              fill="none"
              stroke={phase === 'inhale' ? '#6366F1' : phase === 'hold' ? '#A5B4FC' : '#818CF8'}
              strokeWidth="12"
              strokeDasharray={150 * 2 * Math.PI}
              animate={{ 
                strokeDashoffset: (150 * 2 * Math.PI) * (1 - (timer / (phase === 'hold' ? 2 : 4)))
              }}
              transition={{ duration: 1, ease: "linear" }}
              strokeLinecap="round"
            />
          </svg>

          {/* Center Timer */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center translate-y-12">
            <span className="text-7xl font-black text-slate-800 tracking-tighter">{timer}</span>
          </div>
        </div>

        {/* Text Guidance */}
        <div className="text-center pt-8">
          <motion.h3 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-kids font-black text-brand-indigo uppercase mb-2 tracking-tight"
          >
            {getLabel()}
          </motion.h3>
          <p className="text-xl font-kids font-bold text-slate-400 italic">
            {getSubLabel()}
          </p>
        </div>
      </div>

      {/* Footer / Repeat */}
      <div className="p-8 pb-12 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setPhase('inhale');
            setTimer(4);
            playAudio("Vamos continuar respirando.", settings.voiceSpeed, settings.volume);
          }}
          className="flex items-center gap-3 px-12 py-5 bg-white rounded-full text-brand-indigo shadow-lg font-black text-xl uppercase tracking-widest border-2 border-white"
        >
          <RefreshCw className="w-8 h-8" />
          <span>Reiniciar</span>
        </motion.button>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
