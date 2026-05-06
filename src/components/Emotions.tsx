import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sun, CloudRain, Zap, Coffee, Star, Smile } from 'lucide-react';
import { playAudio, cn } from '../lib/utils';
import { useSensory } from '../contexts/SensoryContext';
import { ActivityType } from '../types';

import { useParent } from '../contexts/ParentContext';

const EMOJIS = [
  { id: 'happy', label: 'Feliz', icon: '😊', bg: 'bg-brand-yellow', text: 'text-brand-yellow-text', suggestion: 'draw' },
  { id: 'sad', label: 'Triste', icon: '😢', bg: 'bg-brand-blue', text: 'text-brand-blue-text', suggestion: 'draw' },
  { id: 'angry', label: 'Bravo', icon: '😠', bg: 'bg-brand-orange', text: 'text-brand-orange-text', suggestion: 'breathe', intense: true },
  { id: 'tired', label: 'Cansado', icon: '😴', bg: 'bg-brand-stone', text: 'text-brand-stone-text', suggestion: 'breathe' },
  { id: 'excited', label: 'Animado', icon: '🤩', bg: 'bg-brand-mint', text: 'text-brand-mint-text', suggestion: 'draw' },
  { id: 'restless', label: 'Agitado', icon: '😰', bg: 'bg-brand-pink', text: 'text-brand-pink-text', suggestion: 'breathe', intense: true },
  { id: 'anxious', label: 'Ansioso', icon: '😟', bg: 'bg-brand-indigo', text: 'text-brand-indigo-text', suggestion: 'breathe', intense: true },
  { id: 'calm', label: 'Calmo', icon: '🧘', bg: 'bg-brand-mint', text: 'text-brand-mint-text', suggestion: 'draw' },
];

export default function Emotions({ onBack, onSuggest }: { onBack: () => void, onSuggest: (activity: ActivityType) => void }) {
  const { settings, updateSettings } = useSensory();
  const { trackProgress } = useParent();
  const [selectedMood, setSelectedMood] = useState<typeof EMOJIS[0] | null>(null);

  const handleMoodClick = (mood: typeof EMOJIS[0]) => {
    setSelectedMood(mood);
    trackProgress('emotion', mood.label);
    
    // Adapt sensory intensity if the kid is anxious/restless/angry
    if (mood.intense) {
      updateSettings({ lowStimulation: true, volume: Math.min(settings.volume, 0.4) });
    } else if (mood.id === 'calm' || mood.id === 'happy') {
      updateSettings({ lowStimulation: false });
    }

    const suggestionLabel = mood.suggestion === 'breathe' ? 'respiraçao' : 'desenho';
    playAudio(`Você está se sentindo ${mood.label}. Que tal fazer uma atividade de ${suggestionLabel}?`, settings.voiceSpeed, settings.volume);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <header className="flex items-center justify-between px-3 h-14 shrink-0 gap-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-2 md:p-3 bg-white rounded-full shadow-sm border-2 border-slate-50 shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </motion.button>
        <div className="text-center flex-1">
          <h2 className="text-lg md:text-2xl font-black text-brand-pink-text uppercase tracking-tight truncate">Emoções</h2>
        </div>
        <div className="w-10" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-start p-3 overflow-y-auto custom-scrollbar space-y-4">
        <h3 className="text-xl font-kids text-slate-700 text-center max-w-lg px-4 italic leading-tight">Como você está se sentindo?</h3>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full max-w-2xl">
          {EMOJIS.map((mood) => (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodClick(mood)}
              className={cn(
                "flex flex-col items-center justify-center p-3 md:p-6 rounded-[24px] transition-all shadow-sm border-2 border-white",
                mood.bg,
                selectedMood?.id === mood.id ? "ring-2 ring-white scale-105 z-10" : "opacity-90"
              )}
            >
              <span className="text-4xl md:text-6xl mb-1 transition-transform">{mood.icon}</span>
              <span className={cn("font-bold text-[10px] md:text-sm uppercase", mood.text)}>{mood.label}</span>
            </motion.button>
          ))}
        </div>

        {selectedMood && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-4 md:p-6 rounded-[24px] shadow-sm border-2 border-slate-50 text-center space-y-3 max-w-md w-full"
          >
            <p className="text-base md:text-lg font-bold text-slate-500 italic">
              {selectedMood.id === 'restless' || selectedMood.id === 'angry' 
                ? "Respirar fundo pode ajudar!" 
                : "Que legal! Vamos fazer uma atividade?"}
            </p>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onSuggest(selectedMood.suggestion as ActivityType)}
              className={cn(
                "w-full py-3 rounded-xl text-white font-bold text-sm uppercase tracking-widest shadow-sm",
                selectedMood.text.replace('text-', 'bg-').replace('-text', '')
              )}
            >
              Ir para {selectedMood.suggestion === 'breathe' ? 'Respiração' : 'Desenhar'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
