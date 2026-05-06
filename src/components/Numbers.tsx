import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Play, Pause, Square, Volume2, Hash, Layers } from 'lucide-react';
import { useSensory } from '../contexts/SensoryContext';
import { cn, playAudio, playAudioAsync } from '../lib/utils';

const NUMBER_NAMES: Record<number, string> = {
  0: 'ZERO', 1: 'UM', 2: 'DOIS', 3: 'TRÊS', 4: 'QUATRO', 5: 'CINCO',
  6: 'SEIS', 7: 'SETE', 8: 'OITO', 9: 'NOVE', 10: 'DEZ',
  11: 'ONZE', 12: 'DOZE', 13: 'TREZE', 14: 'QUATORZE', 15: 'QUINZE',
  16: 'DEZESSEIS', 17: 'DEZESSETE', 18: 'DEZOITO', 19: 'DEZENOVE', 20: 'VINTE',
  21: 'VINTE E UM', 22: 'VINTE E DOIS', 23: 'VINTE E TRÊS', 24: 'VINTE E QUATRO', 25: 'VINTE E CINCO',
  26: 'VINTE E SEIS', 27: 'VINTE E SETE', 28: 'VINTE E OITO', 29: 'VINTE E NOVE', 30: 'TRINTA',
  31: 'TRINTA E UM', 32: 'TRINTA E DOIS', 33: 'TRINTA E TRÊS', 34: 'TRINTA E QUATRO', 35: 'TRINTA E CINCO',
  36: 'TRINTA E SEIS', 37: 'TRINTA E SETE', 38: 'TRINTA E OITO', 39: 'TRINTA E NOVE', 40: 'QUARENTA',
  41: 'QUARENTA E UM', 42: 'QUARENTA E DOIS', 43: 'QUARENTA E TRÊS', 44: 'QUARENTA E QUATRO', 45: 'QUARENTA E CINCO',
  46: 'QUARENTA E SEIS', 47: 'QUARENTA E SETE', 48: 'QUARENTA E OITO', 49: 'QUARENTA E NOVE', 50: 'CINQUENTA',
  51: 'CINQUENTA E UM', 52: 'CINQUENTA E DOIS', 53: 'CINQUENTA E TRÊS', 54: 'CINQUENTA E QUATRO', 55: 'CINQUENTA E CINCO',
  56: 'CINQUENTA E SEIS', 57: 'CINQUENTA E SETE', 58: 'CINQUENTA E OITO', 59: 'CINQUENTA E NOVE', 60: 'SESSENTA',
  61: 'SESSENTA E UM', 62: 'SESSENTA E DOIS', 63: 'SESSENTA E TRÊS', 64: 'SESSENTA E QUATRO', 65: 'SESSENTA E CINCO',
  66: 'SESSENTA E SEIS', 67: 'SESSENTA E SETE', 68: 'SESSENTA E OITO', 69: 'SESSENTA E NOVE', 70: 'SETENTA',
  71: 'SETENTA E UM', 72: 'SETENTA E DOIS', 73: 'SETENTA E TRÊS', 74: 'SETENTA E QUATRO', 75: 'SETENTA E CINCO',
  76: 'SETENTA E SEIS', 77: 'SETENTA E SETE', 78: 'SETENTA E OITO', 79: 'SETENTA E NOVE', 80: 'OITENTA',
  81: 'OITENTA E UM', 82: 'OITENTA E DOIS', 83: 'OITENTA E TRÊS', 84: 'OITENTA E QUATRO', 85: 'OITENTA E CINCO',
  86: 'OITENTA E SEIS', 87: 'OITENTA E SETE', 88: 'OITENTA E OITO', 89: 'OITENTA E NOVE', 90: 'NOVENTA',
  91: 'NOVENTA E UM', 92: 'NOVENTA E DOIS', 93: 'NOVENTA E TRÊS', 94: 'NOVENTA E QUATRO', 95: 'NOVENTA E CINCO',
  96: 'NOVENTA E SEIS', 97: 'NOVENTA E SETE', 98: 'NOVENTA E OITO', 99: 'NOVENTA E NOVE', 100: 'CEM'
};

const BLOCKS = [
  { start: 1, end: 10 },
  { start: 11, end: 20 },
  { start: 21, end: 30 },
  { start: 31, end: 40 },
  { start: 41, end: 50 },
  { start: 51, end: 60 },
  { start: 61, end: 70 },
  { start: 71, end: 80 },
  { start: 81, end: 90 },
  { start: 91, end: 100 },
];

type Mode = 'count-blocks' | 'block-detail' | 'count-all';

interface NumbersProps {
  onBack: () => void;
}

export default function Numbers({ onBack }: NumbersProps) {
  const [mode, setMode] = useState<Mode>('count-blocks');
  const [selectedBlock, setSelectedBlock] = useState<{ start: number, end: number } | null>(null);
  const [activeNumber, setActiveNumber] = useState<number | null>(null);
  const [isCounting, setIsCounting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { settings } = useSensory();
  
  const isCountingRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isCountingRef.current = isCounting;
    isPausedRef.current = isPaused;
  }, [isCounting, isPaused]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleBack = () => {
    if (mode === 'count-blocks') {
      onBack();
    } else if (mode === 'block-detail') {
      window.speechSynthesis.cancel();
      setIsCounting(false);
      setMode('count-blocks');
    } else {
      window.speechSynthesis.cancel();
      setIsCounting(false);
      setMode('count-blocks');
    }
  };

  const handleNumberClick = (num: number) => {
    playAudio(NUMBER_NAMES[num], settings.voiceSpeed, settings.volume);
    setActiveNumber(num);
    setTimeout(() => setActiveNumber(null), 1000);
  };

  const runCount = async (start: number, end: number) => {
    setIsCounting(true);
    setIsPaused(false);
    
    for (let i = start; i <= end; i++) {
      while (isPausedRef.current) {
        if (!isCountingRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      if (!isCountingRef.current) break;
      
      setActiveNumber(i);
      await playAudioAsync(NUMBER_NAMES[i], settings.voiceSpeed, settings.volume);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    if (isCountingRef.current) {
      await playAudioAsync("Muito bem! Você contou até " + end, settings.voiceSpeed, settings.volume);
    }
    
    setIsCounting(false);
    setActiveNumber(null);
  };

  const renderBlocks = () => (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-kids text-slate-700 italic">Pausas também ajudam 💜</h3>
        <p className="text-slate-400 font-bold uppercase tracking-widest mt-2">Escolha uma fase para contar</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
        {BLOCKS.map((block) => (
          <motion.button
            key={`${block.start}-${block.end}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedBlock(block);
              setMode('block-detail');
            }}
            className="p-6 bg-white rounded-[32px] border-4 border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-2 hover:border-brand-mint/30 transition-all"
          >
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest">Bloco</span>
            <span className="text-2xl font-black text-slate-700">{block.start}...{block.end}</span>
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            setMode('count-all');
            runCount(1, 100);
          }}
          className="col-span-full p-8 bg-brand-yellow/10 rounded-[32px] border-4 border-dashed border-brand-yellow/30 flex items-center justify-center gap-4 text-brand-yellow-text"
        >
          <Layers className="w-8 h-8" />
          <span className="text-2xl font-black uppercase tracking-tighter">Desafio: Contar até 100</span>
        </motion.button>
      </div>
    </div>
  );

  const renderBlockDetail = () => {
    if (!selectedBlock) return null;
    const nums = [];
    for (let i = selectedBlock.start; i <= selectedBlock.end; i++) nums.push(i);

    return (
      <div className="flex-1 flex flex-col p-3 md:p-6 overflow-y-auto custom-scrollbar">
        <div className="text-center mb-4">
          <h3 className="text-xl md:text-3xl font-kids font-black text-slate-700 uppercase tracking-tight">
            Contando até {selectedBlock.end}
          </h3>
        </div>

        <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto w-full mb-6">
          {nums.map((n) => (
            <motion.button
              key={n}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleNumberClick(n)}
              animate={{ 
                scale: activeNumber === n ? 1.1 : 1,
                backgroundColor: activeNumber === n ? '#FDE68A' : '#FFFFFF',
                borderColor: activeNumber === n ? '#F59E0B' : '#F1F5F9'
              }}
              className="aspect-square flex items-center justify-center rounded-[20px] border-2 text-xl md:text-2xl font-black text-slate-700 shadow-sm transition-colors"
            >
              {n}
            </motion.button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-4 w-full max-w-sm">
            {!isCounting ? (
              <button
                onClick={() => runCount(selectedBlock.start, selectedBlock.end)}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-brand-mint text-white rounded-[24px] font-black uppercase text-sm shadow-md"
              >
                <Play className="w-5 h-5 fill-current" />
                Contar comigo
              </button>
            ) : (
              <button
                onClick={() => setIsCounting(false)}
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-slate-200 text-slate-500 rounded-[24px] font-black uppercase text-sm"
              >
                <Square className="w-5 h-5 fill-current" />
                Parar
              </button>
            )}
          </div>
          
          <AnimatePresence>
            {activeNumber && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <span className="text-xl md:text-2xl font-black text-brand-yellow-text uppercase tracking-widest bg-white px-6 py-2 rounded-xl shadow-sm border-2 border-brand-yellow/30">
                  {NUMBER_NAMES[activeNumber]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderCountAll = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-6">
      <div className="text-center">
        <p className="text-brand-yellow-text font-black text-lg uppercase tracking-widest">Contando até 100</p>
      </div>

      <div className="flex items-center gap-4 md:gap-8 w-full max-w-md">
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            setIsCounting(false);
            const prev = Math.max(0, (activeNumber || 1) - 1);
            handleNumberClick(prev);
          }}
          className="p-4 bg-white rounded-full text-brand-yellow shadow-sm border-2 border-slate-50 shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>

        <motion.div 
          key={activeNumber}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 aspect-square bg-white rounded-[40px] border-8 border-brand-yellow/10 shadow-lg flex flex-col items-center justify-center p-6 text-center"
        >
          <span className="text-8xl md:text-[8rem] font-kids font-black text-brand-yellow-text leading-none">
            {activeNumber || 0}
          </span>
          {activeNumber && (
            <span className="text-lg font-kids font-bold text-slate-400 mt-2 uppercase tracking-widest truncate max-w-full">
              {NUMBER_NAMES[activeNumber]}
            </span>
          )}
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => {
            setIsCounting(false);
            const next = Math.min(100, (activeNumber || 0) + 1);
            handleNumberClick(next);
          }}
          className="p-4 bg-white rounded-full text-brand-yellow shadow-sm border-2 border-slate-50 rotate-180 shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex items-center justify-center gap-4 w-full max-w-sm">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="w-16 h-16 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-sm text-brand-yellow-text"
        >
          {isPaused ? <Play className="w-8 h-8 fill-current ml-1" /> : <Pause className="w-8 h-8 fill-current" />}
        </button>
        <button
          onClick={() => {
            setIsCounting(false);
            setMode('count-blocks');
          }}
          className="flex-1 py-4 bg-brand-yellow text-white rounded-[24px] font-black uppercase text-sm shadow-md"
        >
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-kids">
      <header className="flex items-center justify-between p-3 md:p-4 bg-white shadow-sm z-20 gap-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleBack}
          className="p-3 md:p-4 bg-slate-100 rounded-full text-slate-500 shadow-sm shrink-0"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </motion.button>
        
        <div className="text-center truncate flex-1">
          <h2 className="text-2xl md:text-3xl font-black text-brand-blue-text uppercase tracking-tighter truncate">Números</h2>
        </div>

        <div className="w-10 md:w-12 flex justify-end">
            <Hash className="w-6 h-6 text-slate-200" />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
           key={mode}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           transition={{ duration: 0.3 }}
           className="flex-1 flex flex-col overflow-hidden"
        >
          {mode === 'count-blocks' && renderBlocks()}
          {mode === 'block-detail' && renderBlockDetail()}
          {mode === 'count-all' && renderCountAll()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
