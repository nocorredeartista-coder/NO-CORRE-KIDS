import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
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
    const interval = setInterval(() => {
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
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-kids">
      <header className="flex items-center justify-between p-3 h-14 bg-white border-b border-slate-100 z-20 gap-2 shrink-0">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-2 bg-slate-50 rounded-xl text-slate-400 border border-slate-100 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        <div className="text-center flex-1">
          <h2 className="text-lg font-black text-brand-indigo uppercase tracking-tight truncate">Respiro</h2>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-3 space-y-6 overflow-y-auto custom-scrollbar">
        {/* Mode Selector */}
        <div className="flex gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm shrink-0">
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
                "px-4 py-1.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all",
                mode === m ? "bg-brand-indigo text-white shadow-sm" : "bg-slate-50 text-slate-300"
              )}
            >
              {m}
            </motion.button>
          ))}
        </div>

        {/* Breathing Animation Area */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          <div className="absolute inset-x-0 -bottom-8 flex flex-col items-center z-20">
            <span className="text-5xl font-black text-slate-800 tracking-tighter leading-none">{timer}</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode + phase}
              initial={{ scale: phase === 'inhale' ? 0.6 : 1.1 }}
              animate={{ 
                scale: phase === 'inhale' ? 1.1 : phase === 'exhale' ? 0.6 : 1.1,
              }}
              transition={{ 
                duration: phase === 'hold' ? 0 : 4,
                ease: "easeInOut"
              }}
              className="relative z-10"
            >
              {mode === 'nuvem' && <div className="text-9xl md:text-[12rem] drop-shadow-sm select-none">☁️</div>}
              {mode === 'balao' && <div className="text-9xl md:text-[12rem] drop-shadow-sm select-none">🎈</div>}
              {mode === 'flor' && <div className="text-9xl md:text-[12rem] drop-shadow-sm select-none">🌸</div>}
            </motion.div>
          </AnimatePresence>

          {/* Activity Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
             <div className="w-full h-full bg-brand-indigo/5 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="text-center space-y-1 mt-6">
          <motion.h3 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black text-brand-indigo uppercase tracking-tight leading-none"
          >
            {getLabel()}
          </motion.h3>
          <p className="text-sm font-bold text-slate-400 italic">
            {getSubLabel()}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setPhase('inhale');
            setTimer(4);
            playAudio("Vamos recomeçar.", settings.voiceSpeed, settings.volume);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white rounded-2xl text-brand-indigo shadow-sm font-black text-xs uppercase tracking-widest border border-slate-100 mt-4"
        >
          <RefreshCw className="w-4 h-4" />
          Reiniciar
        </motion.button>
      </div>
    </div>
  );
}
