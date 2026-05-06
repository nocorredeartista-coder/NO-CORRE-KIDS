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

  return (
    <div className="flex flex-col h-full space-y-6">
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
          <h2 className="text-3xl font-extrabold text-brand-yellow-text tracking-tight uppercase">Falar</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Repita as palavras para praticar</p>
        </div>
        <div className="w-12" />
      </header>

      {/* Categories */}
      <div className="flex justify-center gap-2 px-4 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <motion.button
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedCategory(cat.id);
              setSelectedWord(WORDS.find(w => cat.id === 'all' || w.category === cat.id) || WORDS[0]);
            }}
            className={cn(
              "px-5 py-2 rounded-2xl font-bold flex items-center gap-2 transition-all border-2 shrink-0",
              selectedCategory === cat.id 
                ? "bg-brand-yellow border-brand-yellow-text text-brand-yellow-text shadow-sm" 
                : "bg-white border-transparent text-slate-400"
            )}
          >
            <span>{cat.icon}</span>
            <span className="text-sm">{cat.label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white rounded-[40px] border-4 border-white shadow-sm relative overflow-hidden">
        {showMirror && (
          <div className="absolute inset-0 z-0">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover opacity-30 grayscale scale-x-[-1]"
            />
          </div>
        )}
        
        <div className="text-center z-10 flex flex-col items-center space-y-6">
          <motion.div 
            key={selectedWord.word}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10rem] md:text-[12rem] drop-shadow-xl animate-float"
          >
            {selectedWord.icon}
          </motion.div>
          
          <h3 className="text-5xl md:text-7xl font-kids font-black text-brand-yellow-text tracking-tighter uppercase mb-2">
            {selectedWord.word}
          </h3>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => playAudio(selectedWord.word, settings.voiceSpeed, settings.volume)}
              className="flex flex-col items-center gap-2 p-5 bg-brand-yellow rounded-full text-brand-yellow-text shadow-sm hover:scale-105 transition-all"
            >
              <Play className="w-8 h-8 fill-current" />
              <span className="font-bold text-[10px] uppercase tracking-widest px-2">Ouvir</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleMirror}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-full shadow-sm transition-all",
                showMirror ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-400"
              )}
            >
              {showMirror ? <EyeOff className="w-8 h-8" /> : <Eye className="w-8 h-8" />}
              <span className="font-bold text-[10px] uppercase tracking-widest px-2">Espelho</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-full shadow-md transition-all scale-110",
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-brand-lilac text-brand-lilac-text"
              )}
            >
              <Mic className="w-8 h-8" />
              <span className="font-bold text-[10px] uppercase tracking-widest px-2">{isRecording ? 'Gravando' : 'Falar'}</span>
            </motion.button>

            {recordedBlob && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={playRecorded}
                className="flex flex-col items-center gap-2 p-5 bg-brand-mint rounded-full text-brand-mint-text shadow-sm hover:scale-105 transition-all"
              >
                <Volume2 className="w-8 h-8" />
                <span className="font-bold text-[10px] uppercase tracking-widest px-2">Meu som</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 p-4 bg-white/50 rounded-[40px] border-4 border-white overflow-x-auto min-h-0">
        {filteredWords.map(w => (
          <motion.button
            key={w.word}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedWord(w);
              setRecordedBlob(null);
              playAudio(w.word, settings.voiceSpeed, settings.volume);
              trackProgress('word', w.word);
            }}
            className={cn(
              "w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm transition-all border-2 shrink-0",
              selectedWord.word === w.word ? "border-brand-yellow scale-110 shadow-md" : "border-transparent opacity-60"
            )}
          >
            {w.icon}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
