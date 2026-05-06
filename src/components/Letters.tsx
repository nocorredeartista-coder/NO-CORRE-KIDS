import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2 } from 'lucide-react';
import { playAudio, cn } from '../lib/utils';
import { useSensory } from '../contexts/SensoryContext';
import { useParent } from '../contexts/ParentContext';

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const WORDS: Record<string, { word: string, icon: string }> = {
  'A': { word: 'ABELHA', icon: '🐝' },
  'B': { word: 'BOLA', icon: '⚽' },
  'C': { word: 'CASA', icon: '🏠' },
  'D': { word: 'DADO', icon: '🎲' },
  'E': { word: 'ELEFANTE', icon: '🐘' },
  'F': { word: 'FOCA', icon: '🦭' },
  'G': { word: 'GATO', icon: '🐱' },
  'H': { word: 'HIPOPÓTAMO', icon: '🦛' },
  'I': { word: 'IGREJA', icon: '⛪' },
  'J': { word: 'JACARÉ', icon: '🐊' },
  'K': { word: 'KIWI', icon: '🥝' },
  'L': { word: 'LEÃO', icon: '🦁' },
  'M': { word: 'MACACO', icon: '🐒' },
  'N': { word: 'NAVIO', icon: '🚢' },
  'O': { word: 'OVO', icon: '🥚' },
  'P': { word: 'PATO', icon: '🦆' },
  'Q': { word: 'QUEIJO', icon: '🧀' },
  'R': { word: 'RATO', icon: '🐭' },
  'S': { word: 'SAPO', icon: '🐸' },
  'T': { word: 'TARTARUGA', icon: '🐢' },
  'U': { word: 'UVA', icon: '🍇' },
  'V': { word: 'VACA', icon: '🐮' },
  'W': { word: 'WAFFLE', icon: '🧇' },
  'X': { word: 'XÍCARA', icon: '☕' },
  'Y': { word: 'YAKISSOBA', icon: '🍜' },
  'Z': { word: 'ZEBRA', icon: '🦓' },
};

export default function Letters({ onBack }: { onBack: () => void }) {
  const { settings } = useSensory();
  const { trackProgress } = useParent();
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [isUpperCase, setIsUpperCase] = useState(true);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    const wordData = WORDS[letter];
    playAudio(`${letter} de ${wordData?.word || letter}`, settings.voiceSpeed, settings.volume);
    trackProgress('letter', letter);
  };

  const displayLetter = isUpperCase ? selectedLetter : selectedLetter.toLowerCase();

  return (
    <div className="flex flex-col h-full space-y-4">
      <header className="flex items-center justify-between px-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-4 bg-white rounded-full shadow-sm border-2 border-slate-50"
        >
          <ArrowLeft className="w-6 h-6 text-slate-400" />
        </motion.button>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-brand-blue-text tracking-tight uppercase">Letras</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Toque na letra para aprender</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUpperCase(!isUpperCase)}
          className="px-6 py-3 bg-white rounded-2xl shadow-sm border-2 border-brand-blue/30 text-brand-blue-text font-bold text-xl uppercase"
        >
          {isUpperCase ? 'Aa' : 'AA'}
        </motion.button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row gap-6 items-center justify-center p-4 min-h-0">
        {/* Main Display */}
        <motion.div 
          key={selectedLetter + isUpperCase}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 w-full max-w-sm aspect-square bg-brand-blue rounded-[40px] border-4 border-white shadow-sm flex flex-col items-center justify-center p-8 text-center relative"
        >
          <span className={cn(
            "font-kids font-bold text-brand-blue-text leading-none drop-shadow-sm",
            isUpperCase ? "text-[12rem]" : "text-[14rem]"
          )}>
            {displayLetter}
          </span>
          <div className="mt-4 flex flex-col items-center">
            <span className="text-7xl mb-2">{WORDS[selectedLetter].icon}</span>
            <span className="text-4xl font-kids font-bold text-brand-blue-text tracking-widest bg-white px-8 py-3 rounded-2xl shadow-sm border-2 border-brand-blue/30">
              {WORDS[selectedLetter].word}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => playAudio(`${selectedLetter} de ${WORDS[selectedLetter].word}`, settings.voiceSpeed, settings.volume)}
            className="mt-6 p-5 bg-white rounded-full text-brand-blue-text shadow-md transition-all"
          >
            <Volume2 className="w-10 h-10 fill-current" />
          </motion.button>
        </motion.div>

        {/* Picker */}
        <div className="w-full md:w-80 h-48 md:h-full overflow-y-auto grid grid-cols-4 md:grid-cols-2 gap-4 p-4 bg-white/50 rounded-[40px] border-4 border-white">
          {LETTERS.map((letter) => (
            <motion.button
              key={letter}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleLetterClick(letter)}
              className={cn(
                "p-5 text-3xl font-kids font-bold rounded-2xl transition-all border-2",
                selectedLetter === letter 
                  ? "bg-brand-blue border-white text-brand-blue-text shadow-md scale-105" 
                  : "bg-white border-transparent text-slate-400"
              )}
            >
              {isUpperCase ? letter : letter.toLowerCase()}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
