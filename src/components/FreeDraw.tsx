import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Trash2, RefreshCw, Pencil } from 'lucide-react';
import { useSensory } from '../contexts/SensoryContext';
import { useParent } from '../contexts/ParentContext';
import confetti from 'canvas-confetti';
import { playAudio, cn } from '../lib/utils';

const COLORS = [
  '#EA580C', '#7C3AED', '#0EA5E9', '#059669', '#DB2777', '#CA8A04', '#1E293B'
];

export default function FreeDraw({ onBack }: { onBack: () => void }) {
  const { settings } = useSensory();
  const { trackProgress } = useParent();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(15);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Only set if size actually changed to avoid clearing canvas
        if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
          const tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
          ctx.putImageData(tempImage, 0, 0);
        }
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  const getPos = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDraw = (e: any) => {
    setIsDrawing(true);
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
    if (e.preventDefault && e.cancelable) e.preventDefault();
  };

  const stopDraw = () => setIsDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    playAudio("Tela limpa! Vamos começar de novo.", settings.voiceSpeed, settings.volume);
    trackProgress('activity', 'draw_clear');
  };

  const save = () => {
    playAudio("Seu desenho ficou incrível! Você é um grande artista!", settings.voiceSpeed, settings.volume);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F3E8FF', '#E0F2FE', '#DCFCE7']
    });
    trackProgress('activity', 'draw_save');
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
          <h2 className="text-3xl font-extrabold text-brand-orange-text tracking-tight uppercase">Desenhar</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Desenhe o que você quiser</p>
        </div>
        <div className="flex space-x-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={clear} 
            className="p-4 bg-white rounded-full shadow-sm border-2 border-slate-50"
          >
            <RefreshCw className="w-6 h-6 text-slate-400" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={save} 
            className="p-4 bg-brand-orange rounded-full text-brand-orange-text shadow-sm border-4 border-white"
          >
            <Save className="w-6 h-6" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[40px] shadow-sm border-4 border-white cursor-crosshair overflow-hidden relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseOut={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="w-full h-full touch-none"
        />
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03]">
          <Pencil className="w-96 h-96 text-slate-900" />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-sm p-6 rounded-[40px] border-4 border-white shadow-sm flex flex-col md:flex-row items-center gap-8 justify-center">
        <div className="flex space-x-4 overflow-x-auto p-1">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                playAudio("Cor trocada", settings.voiceSpeed, settings.volume);
              }}
              className={cn(
                "w-14 h-14 rounded-full border-4 transition-all shadow-sm shrink-0",
                color === c ? "border-white scale-125 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex items-center space-x-6 px-8 border-t-2 md:border-t-0 md:border-l-2 border-slate-100 pt-6 md:pt-0">
          {[10, 20, 30].map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={cn(
                "rounded-full bg-slate-100 transition-all",
                brushSize === size ? "bg-brand-orange-text scale-125" : "bg-slate-200"
              )}
              style={{ width: size + 10, height: size + 10 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
