import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Volume2, Type, Layers } from 'lucide-react';
import { playAudio, cn } from '../lib/utils';
import { useSensory } from '../contexts/SensoryContext';
import { useParent } from '../contexts/ParentContext';

const ANIMALS = [
  { id: 'cat', name: 'GATO', letters: ['G', 'A', 'T', 'O'], syl: ['GA', 'TO'], icon: '🐱' },
  { id: 'dog', name: 'CACHORRO', letters: ['C', 'A', 'C', 'H', 'O', 'R', 'R', 'O'], syl: ['CA', 'CHOR', 'RO'], icon: '🐶' },
  { id: 'lion', name: 'LEÃO', letters: ['L', 'E', 'Ã', 'O'], syl: ['LE', 'ÃO'], icon: '🦁' },
  { id: 'elephant', name: 'ELEFANTE', letters: ['E', 'L', 'E', 'F', 'A', 'N', 'T', 'E'], syl: ['E', 'LE', 'FAN', 'TE'], icon: '🐘' },
  { id: 'alligator', name: 'JACARÉ', letters: ['J', 'A', 'C', 'A', 'R', 'É'], syl: ['JA', 'CA', 'RÉ'], icon: '🐊' },
  { id: 'monkey', name: 'MACACO', letters: ['M', 'A', 'C', 'A', 'C', 'O'], syl: ['MA', 'CA', 'CO'], icon: '🐒' },
  { id: 'fish', name: 'PEIXE', letters: ['P', 'E', 'I', 'X', 'E'], syl: ['PEI', 'XE'], icon: '🐟' },
  { id: 'bird', name: 'PÁSSARO', letters: ['P', 'Á', 'S', 'S', 'A', 'R', 'O'], syl: ['PÁS', 'SA', 'RO'], icon: '🐦' },
  { id: 'horse', name: 'CAVALO', letters: ['C', 'A', 'V', 'A', 'L', 'O'], syl: ['CA', 'VA', 'LO'], icon: '🐎' },
  { id: 'cow', name: 'VACA', letters: ['V', 'A', 'C', 'A'], syl: ['VA', 'CA'], icon: '🐮' },
  { id: 'giraffe', name: 'GIRAFA', letters: ['G', 'I', 'R', 'A', 'F', 'A'], syl: ['GI', 'RA', 'FA'], icon: '🦒' },
  { id: 'turtle', name: 'TARTARUGA', letters: ['T', 'A', 'R', 'T', 'A', 'R', 'U', 'G', 'A'], syl: ['TAR', 'TA', 'RU', 'GA'], icon: '🐢' },
  { id: 'rabbit', name: 'COELHO', letters: ['C', 'O', 'E', 'L', 'H', 'O'], syl: ['CO', 'E', 'LHO'], icon: '🐰' },
  { id: 'toad', name: 'SAPO', letters: ['S', 'A', 'P', 'O'], syl: ['SA', 'PO'], icon: '🐸' },
  { id: 'duck', name: 'PATO', letters: ['P', 'A', 'T', 'O'], syl: ['PA', 'TO'], icon: '🦆' },
  { id: 'chicken', name: 'GALINHA', letters: ['G', 'A', 'L', 'I', 'N', 'H', 'A'], syl: ['GA', 'LI', 'NHA'], icon: '🐔' },
  { id: 'butterfly', name: 'BORBOLETA', letters: ['B', 'O', 'R', 'B', 'O', 'L', 'E', 'T', 'A'], syl: ['BOR', 'BO', 'LE', 'TA'], icon: '🦋' },
  { id: 'bee', name: 'ABELHA', letters: ['A', 'B', 'E', 'L', 'H', 'A'], syl: ['A', 'BE', 'LHA'], icon: '🐝' },
  { id: 'ant', name: 'FORMIGA', letters: ['F', 'O', 'R', 'M', 'I', 'G', 'A'], syl: ['FOR', 'MI', 'GA'], icon: '🐜' },
  { id: 'shark', name: 'TUBARÃO', letters: ['T', 'U', 'B', 'A', 'R', 'Ã', 'O'], syl: ['TU', 'BA', 'RÃO'], icon: '🦈' },
  { id: 'whale', name: 'BALEIA', letters: ['B', 'A', 'L', 'E', 'I', 'A'], syl: ['BA', 'LEI', 'A'], icon: '🐋' },
  { id: 'snake', name: 'COBRA', letters: ['C', 'O', 'B', 'R', 'A'], syl: ['CO', 'BRA'], icon: '🐍' },
  { id: 'owl', name: 'CORUJA', letters: ['C', 'O', 'R', 'U', 'J', 'A'], syl: ['CO', 'RU', 'JA'], icon: '🦉' },
  { id: 'rat', name: 'RATO', letters: ['R', 'A', 'T', 'O'], syl: ['RA', 'TO'], icon: '🐭' },
  { id: 'bear', name: 'URSO', letters: ['U', 'R', 'S', 'O'], syl: ['UR', 'SO'], icon: '🐻' },
  { id: 'zebra', name: 'ZEBRA', letters: ['Z', 'E', 'B', 'R', 'A'], syl: ['ZE', 'BRA'], icon: '🦓' },
];

export default function Animals({ onBack }: { onBack: () => void }) {
  const { settings } = useSensory();
  const { trackProgress } = useParent();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLetter, setActiveLetter] = useState<number | null>(null);
  const [activeSyllable, setActiveSyllable] = useState<number | null>(null);
  const [highlightWord, setHighlightWord] = useState(false);

  const animal = ANIMALS[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANIMALS.length);
    resetHighlights();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ANIMALS.length) % ANIMALS.length);
    resetHighlights();
  };

  const resetHighlights = () => {
    setActiveLetter(null);
    setActiveSyllable(null);
    setHighlightWord(false);
  };

  const speakFullName = async () => {
    resetHighlights();
    trackProgress('word', animal.name);
    setHighlightWord(true);
    playAudio(animal.name, settings.voiceSpeed * 0.8, settings.volume);
    setTimeout(() => setHighlightWord(false), 1000);
  };

  const speakLetterByLetter = async () => {
    resetHighlights();
    playAudio("Vamos soletrar?", settings.voiceSpeed, settings.volume);
    await new Promise(r => setTimeout(r, 1200));

    for (let i = 0; i < animal.letters.length; i++) {
        setActiveLetter(i);
        playAudio(animal.letters[i], settings.voiceSpeed * 0.75, settings.volume);
        await new Promise(r => setTimeout(r, 900 / settings.voiceSpeed));
    }
    setActiveLetter(null);
  };

  const speakSyllables = async () => {
    resetHighlights();
    playAudio("Vamos falar em pedacinhos?", settings.voiceSpeed, settings.volume);
    await new Promise(r => setTimeout(r, 1200));

    for (let i = 0; i < animal.syl.length; i++) {
        setActiveSyllable(i);
        playAudio(animal.syl[i], settings.voiceSpeed * 0.75, settings.volume);
        await new Promise(r => setTimeout(r, 1000 / settings.voiceSpeed));
    }
    setActiveSyllable(null);
  };

  const onLetterClick = (letter: string, index: number) => {
    setActiveLetter(index);
    playAudio(letter, settings.voiceSpeed * 0.8, settings.volume);
    setTimeout(() => setActiveLetter(null), 500);
  };

  const onSyllableClick = (syllable: string, index: number) => {
    setActiveSyllable(index);
    playAudio(syllable, settings.voiceSpeed * 0.8, settings.volume);
    setTimeout(() => setActiveSyllable(null), 500);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-kids">
      <header className="flex items-center justify-between p-3 md:p-4 bg-white shadow-sm z-20 gap-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-3 md:p-4 bg-slate-100 rounded-full text-slate-500 shadow-sm shrink-0"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
        
        <div className="text-center truncate flex-1">
          <h2 className="text-2xl md:text-3xl font-black text-brand-mint-text uppercase tracking-tighter truncate">Animais</h2>
        </div>

        <div className="flex shrink-0">
            <span className="text-[10px] md:text-xs font-black bg-slate-100 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-slate-400">
                {currentIndex + 1}/{ANIMALS.length}
            </span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={animal.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="flex flex-col items-center w-full max-w-4xl space-y-6 md:space-y-8"
          >
            {/* Animal Icon Display */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={speakFullName}
              className="text-[7rem] md:text-[14rem] leading-none drop-shadow-xl animate-float cursor-pointer select-none mb-2 md:mb-4"
            >
              {animal.icon}
            </motion.button>

            <span className="text-lg md:text-xl font-kids font-black text-slate-800 uppercase tracking-tight text-center">
                {animal.name}
                <span className="block text-[10px] md:text-xs font-black text-slate-300 uppercase tracking-[0.2em] animate-pulse mt-1 md:mt-2">
                    Toque para ouvir
                </span>
            </span>

            {/* Word Representation */}
            <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
                
                {/* Letters Container */}
                <div className="flex flex-col items-center space-y-3 md:space-y-4 w-full">
                  <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Toque nas letras</span>
                  <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                    {animal.letters.map((char, idx) => (
                      <motion.button
                        key={`${animal.id}-char-${idx}`}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => onLetterClick(char, idx)}
                        animate={{ 
                          scale: activeLetter === idx || highlightWord ? 1.15 : 1,
                          backgroundColor: activeLetter === idx || highlightWord ? '#D1FAE5' : '#FFFFFF',
                          borderColor: activeLetter === idx || highlightWord ? '#10B981' : '#E2E8F0',
                          color: activeLetter === idx || highlightWord ? '#065F46' : '#1E293B'
                        }}
                        className="w-10 h-10 md:w-20 md:h-20 flex items-center justify-center text-xl md:text-5xl font-black rounded-xl md:rounded-2xl border-2 md:border-4 shadow-sm transition-all"
                      >
                        {char}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-slate-200 max-w-md mx-auto" />

                {/* Syllables Container */}
                <div className="flex flex-col items-center space-y-3 md:space-y-4">
                    <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest">Toque nas sílabas</span>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                        {animal.syl.map((s, idx) => (
                            <motion.button
                                key={`${animal.id}-syl-${idx}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onSyllableClick(s, idx)}
                                animate={{ 
                                    scale: activeSyllable === idx ? 1.1 : 1,
                                    borderColor: activeSyllable === idx ? '#3B82F6' : '#FFFFFF',
                                    backgroundColor: activeSyllable === idx ? '#DBEAFE' : '#FFFFFF',
                                    color: activeSyllable === idx ? '#1E40AF' : '#334155'
                                }}
                                className="px-5 md:px-8 py-2 md:py-4 text-xl md:text-4xl font-black rounded-2xl md:rounded-3xl border-2 md:border-4 shadow-sm"
                            >
                                {s}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:grid md:grid-cols-3 gap-3 md:gap-4 w-full pt-2 md:pt-4">
                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={speakFullName}
                    className="flex items-center justify-center gap-3 p-4 md:p-6 bg-brand-mint text-white rounded-2xl md:rounded-[32px] shadow-md md:shadow-lg border-b-4 md:border-b-8 border-brand-mint-text/20"
                >
                    <Volume2 className="w-6 h-6 md:w-8 md:h-8" />
                    <div className="text-left">
                        <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Escutar</span>
                        <span className="text-base md:text-xl font-black uppercase leading-tight">Ouvir nome</span>
                    </div>
                </motion.button>

                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={speakLetterByLetter}
                    className="flex items-center justify-center gap-3 p-4 md:p-6 bg-brand-blue text-white rounded-2xl md:rounded-[32px] shadow-md md:shadow-lg border-b-4 md:border-b-8 border-brand-blue-text/20"
                >
                    <Type className="w-6 h-6 md:w-8 md:h-8" />
                    <div className="text-left">
                        <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Soletrar</span>
                        <span className="text-base md:text-xl font-black uppercase leading-tight">Letra por Letra</span>
                    </div>
                </motion.button>

                <motion.button 
                    whileTap={{ scale: 0.95 }}
                    onClick={speakSyllables}
                    className="flex items-center justify-center gap-3 p-4 md:p-6 bg-brand-yellow text-white rounded-2xl md:rounded-[32px] shadow-md md:shadow-lg border-b-4 md:border-b-8 border-brand-yellow-text/20"
                >
                    <Layers className="w-6 h-6 md:w-8 md:h-8" />
                    <div className="text-left">
                        <span className="block text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 leading-none">Pedacinhos</span>
                        <span className="text-base md:text-xl font-black uppercase leading-tight">Ouvir Sílabas</span>
                    </div>
                </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Bottom Area */}
        <div className="flex items-center justify-between w-full max-w-4xl pt-4 md:pt-8 pb-8 md:pb-12 mt-auto">
            <motion.button
                whileHover={{ x: -10 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrev}
                className="flex items-center gap-2 md:gap-3 p-4 md:p-6 bg-white rounded-2xl md:rounded-[32px] text-brand-mint-text shadow-sm border-2 md:border-4 border-white font-black uppercase tracking-widest"
            >
                <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
                <span className="hidden sm:inline">Anterior</span>
            </motion.button>

            <div className="flex gap-1 md:gap-2 max-w-[120px] md:max-w-none overflow-hidden">
                <div className="flex gap-1 md:gap-2 transition-transform duration-300">
                    {ANIMALS.map((_, idx) => (
                        <div 
                            key={idx}
                            className={cn(
                                "w-2 h-2 md:w-3 md:h-3 rounded-full transition-all shrink-0",
                                currentIndex === idx ? "bg-brand-mint w-4 md:w-6" : "bg-slate-200"
                            )}
                        />
                    ))}
                </div>
            </div>

            <motion.button
                whileHover={{ x: 10 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="flex items-center gap-2 md:gap-3 p-4 md:p-6 bg-white rounded-2xl md:rounded-[32px] text-brand-mint-text shadow-sm border-2 md:border-4 border-white font-black uppercase tracking-widest"
            >
                <span className="hidden sm:inline">Próximo</span>
                <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
            </motion.button>
        </div>

      </div>
    </div>
  );
}
