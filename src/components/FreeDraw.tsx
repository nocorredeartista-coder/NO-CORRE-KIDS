import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Trash2, RefreshCw, Pencil, Download } from 'lucide-react';
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

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas to add white background (JPEG needs it)
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Fill with white
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // Draw the original drawing on top
    tempCtx.drawImage(canvas, 0, 0);

    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    
    // Add date to filename for organization
    const now = new Date();
    const dateStr = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    link.download = `meu-desenho-${dateStr}.jpg`;
    
    link.href = dataUrl;
    link.click();

    playAudio("Seu desenho foi salvo para você guardar!", settings.voiceSpeed, settings.volume);
    trackProgress('activity', 'draw_download');
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
      <header className="flex items-center justify-between px-4 gap-2">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-3 md:p-4 bg-white rounded-full shadow-sm border-2 border-slate-50 shrink-0"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
        </motion.button>
        <div className="text-center hidden sm:block">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-orange-text tracking-tight uppercase">Desenhar</h2>
        </div>
        <div className="flex gap-2 flex-1 justify-end">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={clear} 
            className="p-3 md:p-4 bg-white rounded-full shadow-sm border-2 border-slate-50"
            title="Limpar tela"
          >
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={download} 
            className="p-3 md:p-4 bg-brand-blue rounded-full text-brand-blue-text shadow-sm border-2 md:border-4 border-white"
            title="Baixar desenho"
          >
            <Download className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={save} 
            className="p-3 md:p-4 bg-brand-orange rounded-full text-brand-orange-text shadow-sm border-2 md:border-4 border-white"
            title="Celebrar"
          >
            <Save className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[32px] md:rounded-[40px] shadow-sm border-4 border-white cursor-crosshair overflow-hidden relative mx-2 md:mx-0">
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
      </div>

      <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-[32px] md:rounded-[40px] border-4 border-white shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-8 justify-center mx-2 md:mx-0">
        <div className="flex space-x-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide px-2">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                playAudio("Cor trocada", settings.voiceSpeed, settings.volume);
              }}
              className={cn(
                "w-10 h-10 md:w-14 md:h-14 rounded-full border-4 transition-all shadow-sm shrink-0",
                color === c ? "border-white scale-110 md:scale-125 shadow-md ring-2 ring-brand-orange" : "border-transparent opacity-80"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex items-center space-x-6 px-4 md:px-8 border-t-2 md:border-t-0 md:border-l-2 border-slate-100 pt-4 md:pt-0">
          {[10, 20, 30].map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={cn(
                "rounded-full transition-all",
                brushSize === size ? "bg-brand-orange-text scale-110 md:scale-125" : "bg-slate-200"
              )}
              style={{ 
                width: Math.min(size + 10, 30) + (brushSize === size ? 4 : 0), 
                height: Math.min(size + 10, 30) + (brushSize === size ? 4 : 0) 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
