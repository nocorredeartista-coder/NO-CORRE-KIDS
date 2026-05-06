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
    <div className="flex flex-col h-full space-y-3 font-kids">
      <header className="flex items-center justify-between px-3 h-14 bg-white border-b border-slate-100 shrink-0 gap-2">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack} 
          className="p-2 bg-slate-50 rounded-xl text-slate-400 border border-slate-100 shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        
        <div className="flex items-center gap-1.5 flex-1 justify-end">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={clear} 
            className="p-2 bg-white rounded-xl text-slate-400 border border-slate-100"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={download} 
            className="p-2 bg-brand-blue text-white rounded-xl shadow-sm"
          >
            <Download className="w-5 h-5" />
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={save} 
            className="p-2 bg-brand-orange text-white rounded-xl shadow-sm"
          >
            <Save className="w-5 h-5" />
          </motion.button>
        </div>
      </header>

      <div className="flex-1 bg-white border-y border-slate-100 cursor-crosshair relative">
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

      <div className="p-3 bg-white border-t border-slate-100 shrink-0 space-y-4">
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 scrollbar-hide">
          {COLORS.map(c => (
            <motion.button
              key={c}
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                setColor(c);
                playAudio("Pincel", settings.voiceSpeed, settings.volume);
              }}
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full border-4 transition-all shadow-sm shrink-0",
                color === c ? "border-slate-800 scale-110" : "border-white"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-6 justify-center">
          {[10, 20, 30].map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={cn(
                "rounded-full transition-all bg-slate-200",
                brushSize === size ? "bg-slate-800 ring-2 ring-offset-2 ring-slate-800" : ""
              )}
              style={{ 
                width: size / 2 + 10, 
                height: size / 2 + 10 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
