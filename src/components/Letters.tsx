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
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter);
    const wordData = WORDS[letter];
    playAudio(`${letter} de ${wordData?.word || letter}`, settings.voiceSpeed, settings.volume);
    trackProgress('letter', letter);
    setViewMode('detail');
  };

  const handleNext = () => {
    const currentIndex = LETTERS.indexOf(selectedLetter);
    const nextIndex = (currentIndex + 1) % LETTERS.length;
    handleLetterClick(LETTERS[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = LETTERS.indexOf(selectedLetter);
    const prevIndex = (currentIndex - 1 + LETTERS.length) % LETTERS.length;
    handleLetterClick(LETTERS[prevIndex]);
  };

  const displayLetter = isUpperCase ? selectedLetter : selectedLetter.toLowerCase();

  return (
    <div className="flex flex-col h-full space-y-2 md:space-y-4">
      <header className="flex items-center justify-between px-3 h-14 shrink-0 gap-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={viewMode === 'detail' ? () => setViewMode('grid') : onBack} 
          className="p-2 md:p-3 bg-white rounded-full shadow-sm border-2 border-slate-50 shrink-0"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </motion.button>
        <div className="text-center">
          <h2 className="text-lg md:text-2xl font-black text-brand-blue-text uppercase tracking-tight">
            {viewMode === 'grid' ? 'Todas as Letras' : 'Letra'}
          </h2>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUpperCase(!isUpperCase)}
          className="px-3 md:px-4 py-1.5 md:py-2 bg-white rounded-xl shadow-sm border-2 border-brand-blue/30 text-brand-blue-text font-bold text-sm md:text-lg uppercase shrink-0"
        >
          {isUpperCase ? 'Aa' : 'AA'}
        </motion.button>
      </header>

      <div className="flex-1 overflow-hidden p-2">
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 pb-4 custom-scrollbar"
            >
              {LETTERS.map(letter => (
                <motion.button
                  key={letter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLetterClick(letter)}
                  className={cn(
                    "aspect-square flex items-center justify-center text-2xl md:text-3xl font-kids font-bold rounded-2xl border-2 transition-all",
                    selectedLetter === letter 
                      ? "bg-brand-blue border-white text-brand-blue-text shadow-md" 
                      : "bg-white border-slate-100 text-slate-400"
                  )}
                >
                  {isUpperCase ? letter : letter.toLowerCase()}
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full flex flex-col items-center justify-center space-y-4"
            >
              <div className="text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] md:text-xs mb-2">Toque para ouvir</p>
              </div>

              <div className="flex items-center gap-4 md:gap-8 w-full max-w-xl px-2">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handlePrev}
                  className="p-4 bg-white rounded-full text-brand-blue shadow-sm shrink-0 border-2 border-slate-50"
                >
                   <ArrowLeft className="w-6 h-6" />
                </motion.button>

                <motion.div 
                  key={selectedLetter}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  onClick={() => playAudio(selectedLetter, settings.voiceSpeed, settings.volume)}
                  className="flex-1 aspect-square bg-white rounded-[32px] md:rounded-[48px] border-4 border-brand-blue flex flex-col items-center justify-center p-4 shadow-sm cursor-pointer"
                >
                   <span className={cn(
                      "font-kids font-black text-brand-blue-text leading-none",
                      isUpperCase ? "text-8xl md:text-[10rem]" : "text-9xl md:text-[12rem]"
                    )}>
                      {displayLetter}
                    </span>
                </motion.div>

                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleNext}
                  className="p-4 bg-white rounded-full text-brand-blue shadow-sm shrink-0 border-2 border-slate-50 rotate-180"
                >
                   <ArrowLeft className="w-6 h-6" />
                </motion.button>
              </div>

              <div className="flex flex-col items-center w-full max-w-sm gap-2">
                <div className="flex items-center gap-4 bg-white p-3 md:p-4 rounded-3xl border-2 border-brand-blue/20 shadow-sm w-full">
                  <span className="text-4xl md:text-6xl">{WORDS[selectedLetter].icon}</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Palavra</span>
                    <span className="text-lg md:text-2xl font-kids font-black text-brand-blue-text uppercase truncate">
                      {WORDS[selectedLetter].word}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => playAudio(WORDS[selectedLetter].word, settings.voiceSpeed, settings.volume)}
                    className="ml-auto w-10 h-10 bg-brand-blue rounded-full text-white flex items-center justify-center shrink-0"
                  >
                    <Volume2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <button 
                onClick={() => setViewMode('grid')}
                className="mt-4 px-8 py-3 bg-slate-100 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-colors"
                id="btn-ver-todas"
              >
                Ver todas as letras
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
