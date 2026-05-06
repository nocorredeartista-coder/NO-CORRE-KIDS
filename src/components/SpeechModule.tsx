import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, Play, Square, RefreshCcw, Volume2, Eye, EyeOff } from 'lucide-react';
import { playAudio, cn } from '../lib/utils';
import { useSensory } from '../contexts/SensoryContext';
import { useParent } from '../contexts/ParentContext';
import confetti from 'canvas-confetti';

const WORDS = [
  // OBJETOS
  { word: 'Bola', icon: '⚽', category: 'objetos' },
  { word: 'Casa', icon: '🏠', category: 'objetos' },
  { word: 'Água', icon: '💧', category: 'objetos' },
  { word: 'Cama', icon: '🛏️', category: 'objetos' },
  
  // AÇÕES
  { word: 'Comer', icon: '😋', category: 'acoes' },
  { word: 'Dormir', icon: '😴', category: 'acoes' },
  { word: 'Brincar', icon: '🎡', category: 'acoes' },
  { word: 'Correr', icon: '🏃', category: 'acoes' },

  // ALIMENTOS
  { word: 'Maçã', icon: '🍎', category: 'comida' },
  { word: 'Banana', icon: '🍌', category: 'comida' },
  { word: 'Leite', icon: '🥛', category: 'comida' },
  { word: 'Suco', icon: '🧃', category: 'comida' },

  // PESSOAS
  { word: 'Mamãe', icon: '👩', category: 'pessoas' },
  { word: 'Papai', icon: '👨', category: 'pessoas' },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: '🌟' },
  { id: 'objetos', label: 'Objetos', icon: '🧸' },
  { id: 'acoes', label: 'Ações', icon: '🎬' },
  { id: 'comida', label: 'Comida', icon: '🍎' },
  { id: 'pessoas', label: 'Pessoas', icon: '👥' },
];

export default function SpeechModule({ onBack }: { onBack: () => void }) {
  const { settings } = useSensory();
  const { trackProgress } = useParent();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWord, setSelectedWord] = useState(WORDS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [showMirror, setShowMirror] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const filteredWords = selectedCategory === 'all' 
    ? WORDS 
    : WORDS.filter(w => w.category === selectedCategory);

  const toggleMirror = async () => {
    if (showMirror) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setShowMirror(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setShowMirror(true);
      } catch (err) {
        console.error("Câmera não disponível", err);
      }
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      
      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microfone não disponível", err);
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#FEF9C3', '#E0F2FE']
    });
  };

  const playRecorded = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const audio = new Audio(url);
    audio.play();
  };

  const handleNext = () => {
    const currentIndex = filteredWords.indexOf(selectedWord);
    const nextIndex = (currentIndex + 1) % filteredWords.length;
    setSelectedWord(filteredWords[nextIndex]);
    setRecordedBlob(null);
  };

  const handlePrev = () => {
    const currentIndex = filteredWords.indexOf(selectedWord);
    const prevIndex = (currentIndex - 1 + filteredWords.length) % filteredWords.length;
    setSelectedWord(filteredWords[prevIndex]);
    setRecordedBlob(null);
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
        <div className="text-center truncate flex-1">
          <h2 className="text-lg md:text-2xl font-black text-brand-yellow-text uppercase tracking-tight truncate">Falar</h2>
        </div>
        <div className="w-10" />
      </header>

      {/* Categories */}
      <div className="flex justify-center gap-1.5 px-3 overflow-x-auto custom-scrollbar pb-1 scrollbar-hide shrink-0">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory(cat.id);
              const firstMatch = WORDS.find(w => cat.id === 'all' || w.category === cat.id) || WORDS[0];
              setSelectedWord(firstMatch);
            }}
            className={cn(
              "px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all border shrink-0",
              selectedCategory === cat.id 
                ? "bg-brand-yellow border-brand-yellow-text text-brand-yellow-text shadow-sm" 
                : "bg-white border-slate-100 text-slate-400"
            )}
          >
            <span className="text-sm">{cat.icon}</span>
            <span className="text-[10px] uppercase tracking-wider">{cat.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-white rounded-[32px] border-4 border-white shadow-sm relative overflow-hidden">
        {showMirror && (
          <div className="absolute inset-0 z-0">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover opacity-20 grayscale scale-x-[-1]"
            />
          </div>
        )}
        
        <div className="text-center z-10 flex flex-col items-center space-y-4 w-full">
          <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-lg">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handlePrev}
              className="p-4 bg-white rounded-full text-brand-yellow shadow-sm shrink-0 border-2 border-slate-50"
            >
               <ArrowLeft className="w-6 h-6" />
            </motion.button>

            <motion.div 
              key={selectedWord.word}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 aspect-square max-w-[200px] bg-white rounded-[32px] border-4 border-brand-yellow/20 flex items-center justify-center text-7xl md:text-9xl drop-shadow-sm select-none"
            >
              {selectedWord.icon}
            </motion.div>

            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleNext}
              className="p-4 bg-white rounded-full text-brand-yellow shadow-sm shrink-0 border-2 border-slate-50 rotate-180"
            >
               <ArrowLeft className="w-6 h-6" />
            </motion.button>
          </div>
          
          <div className="text-center">
            <h3 className="text-3xl md:text-5xl font-kids font-black text-brand-yellow-text tracking-tight uppercase truncate max-w-full">
              {selectedWord.word}
            </h3>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => playAudio(selectedWord.word, settings.voiceSpeed, settings.volume)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-yellow rounded-2xl text-brand-yellow-text font-bold shadow-sm"
            >
              <Play className="w-5 h-5 fill-current" />
              <span className="text-xs uppercase tracking-widest">Ouvir</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-sm",
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-brand-lilac text-brand-lilac-text"
              )}
            >
              <Mic className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest">{isRecording ? 'Gravando' : 'Falar'}</span>
            </motion.button>

            {recordedBlob && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={playRecorded}
                className="flex items-center gap-2 px-6 py-3 bg-brand-mint rounded-2xl text-brand-mint-text font-bold shadow-sm"
              >
                <Volume2 className="w-5 h-5" />
                <span className="text-xs uppercase tracking-widest">Meu som</span>
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMirror}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-2xl transition-all border-2",
                showMirror ? "bg-slate-700 border-slate-700 text-white" : "bg-white border-slate-100 text-slate-300"
              )}
            >
              {showMirror ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
