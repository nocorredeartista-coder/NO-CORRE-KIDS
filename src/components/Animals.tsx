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

      <div className="flex-1 flex flex-col items-center justify-start p-3 md:p-6 space-y-4 overflow-y-auto custom-scrollbar">
        
        <AnimatePresence mode="wait">
          <motion.div 
            key={animal.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center w-full max-w-2xl space-y-4"
          >
            {/* Header / Intro */}
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Toque no animal para ouvir</p>
            </div>

            {/* Animal Display with Navigation */}
            <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-lg">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handlePrev}
                  className="p-4 bg-white rounded-full text-brand-mint shadow-sm shrink-0 border-2 border-slate-50"
                >
                   <ArrowLeft className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={speakFullName}
                  className="flex-1 aspect-square max-w-[220px] bg-white rounded-[40px] border-4 border-brand-mint flex items-center justify-center text-[7rem] md:text-[10rem] shadow-sm select-none cursor-pointer"
                >
                  {animal.icon}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleNext}
                  className="p-4 bg-white rounded-full text-brand-mint shadow-sm shrink-0 border-2 border-slate-50 rotate-180"
                >
                   <ArrowLeft className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Name and Basic Actions */}
            <div className="flex flex-col items-center w-full gap-2">
              <h3 className="text-2xl md:text-4xl font-kids font-black text-slate-800 uppercase tracking-tight">
                {animal.name}
              </h3>
              
              <div className="flex gap-2">
                <button 
                  onClick={speakFullName}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-mint text-white rounded-xl font-bold text-xs uppercase"
                >
                  <Volume2 className="w-4 h-4" /> Ouvir
                </button>
                <button 
                  onClick={speakLetterByLetter}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl font-bold text-xs uppercase"
                >
                  <Type className="w-4 h-4" /> Soletrar
                </button>
                <button 
                  onClick={speakSyllables}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-yellow text-white rounded-xl font-bold text-xs uppercase"
                >
                  <Layers className="w-4 h-4" /> Sílabas
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100" />

            {/* Details (Letters/Syllables) */}
            <div className="flex flex-col items-center gap-6 w-full pb-8">
                {/* Letters Container */}
                <div className="flex flex-col items-center space-y-2 w-full">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Letras</span>
                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-3">
                    {animal.letters.map((char, idx) => (
                      <motion.button
                        key={`${animal.id}-char-${idx}`}
                        onClick={() => onLetterClick(char, idx)}
                        animate={{ 
                          scale: activeLetter === idx || highlightWord ? 1.1 : 1,
                          backgroundColor: activeLetter === idx || highlightWord ? '#D1FAE5' : '#FFFFFF',
                          borderColor: activeLetter === idx || highlightWord ? '#10B981' : '#F1F5F9',
                        }}
                        className="w-9 h-9 md:w-14 md:h-14 flex items-center justify-center text-lg md:text-2xl font-black rounded-xl border-2 shadow-sm transition-all"
                      >
                        {char}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Syllables Container */}
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Sílabas</span>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                        {animal.syl.map((s, idx) => (
                            <motion.button
                                key={`${animal.id}-syl-${idx}`}
                                onClick={() => onSyllableClick(s, idx)}
                                animate={{ 
                                    scale: activeSyllable === idx ? 1.1 : 1,
                                    borderColor: activeSyllable === idx ? '#3B82F6' : '#F1F5F9',
                                    backgroundColor: activeSyllable === idx ? '#DBEAFE' : '#FFFFFF',
                                }}
                                className="px-4 md:px-6 py-2 text-base md:text-xl font-black rounded-xl border-2 shadow-sm"
                            >
                                {s}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
