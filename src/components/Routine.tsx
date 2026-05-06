import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, CheckCircle2, Circle, Star, 
  Lightbulb, Trophy, PlusCircle, Smile,
  Bath, Shirt, Coffee, Droplets, BookOpen,
  Gamepad2, Package, Bed, Moon, Utensils
} from 'lucide-react';
import { useParent } from '../contexts/ParentContext';
import { useSensory } from '../contexts/SensoryContext';
import { playAudio, cn } from '../lib/utils';
import { Task } from '../types';

export default function Routine({ onBack }: { onBack: () => void }) {
  const { progress, trackProgress } = useParent();
  const { settings } = useSensory();

  const tasks = Array.isArray(progress.routineTasks) ? progress.routineTasks : [];

  const stats = useMemo(() => {
    const completed = tasks.filter(t => t.completed).length;
    const total = tasks.length;
    return {
      completed,
      total,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [tasks]);

  const handleToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (!task.completed) {
      // Lista de frases positivas
      const feedbacks = ["Muito bem!", "Boa!", "Você conseguiu!", "Mais uma tarefa feita!"];
      const randomFb = feedbacks[Math.floor(Math.random() * feedbacks.length)];
      playAudio(randomFb, settings.voiceSpeed, settings.volume);
    }
    
    trackProgress('routine_complete', taskId);
  };

  const getTaskIcon = (task: Task) => {
    const label = task.label.toLowerCase();
    
    // Custom icons for routine tasks
    if (label.includes('escovar os dentes')) return <Smile className="w-8 h-8 text-brand-blue" />;
    if (label.includes('banho')) return <Bath className="w-8 h-8 text-brand-blue" />;
    if (label.includes('roupa')) return <Shirt className="w-8 h-8 text-brand-blue" />;
    if (label.includes('café da manhã')) return <Coffee className="w-8 h-8 text-brand-blue" />;
    if (label.includes('água')) return <Droplets className="w-8 h-8 text-brand-blue" />;
    if (label.includes('almoçar') || label.includes('jantar')) return <Utensils className="w-8 h-8 text-brand-blue" />;
    if (label.includes('lição') || label.includes('ler')) return <BookOpen className="w-8 h-8 text-brand-blue" />;
    if (label.includes('brincar')) return <Gamepad2 className="w-8 h-8 text-brand-blue" />;
    if (label.includes('guardar')) return <Package className="w-8 h-8 text-brand-blue" />;
    if (label.includes('pijama')) return <Bed className="w-8 h-8 text-brand-blue" />;
    if (label.includes('respirar')) return <Moon className="w-8 h-8 text-brand-blue" />;
    if (label.includes('dormir')) return <Moon className="w-8 h-8 text-brand-blue" />;
    
    return <span className="text-2xl">{task.icon}</span>;
  };

  const handleSpeakTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio(task.label, settings.voiceSpeed, settings.volume);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-kids">
      <header className="p-4 bg-white border-b-2 border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={onBack} 
            className="p-2 bg-slate-50 rounded-xl text-slate-400 border border-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Minha rotina</h2>
          </div>
        </div>

        {/* PROGRESSO COMPACTO */}
        <div className="mt-3 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <p className="text-sm font-black text-slate-700">
                {stats.completed}/{stats.total}
              </p>
            </div>
            <div className="flex-1 mx-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.percent}%` }}
                    className="h-full bg-brand-mint"
                />
            </div>
            <p className="text-[10px] font-black uppercase text-brand-mint-text">
              {stats.percent}%
            </p>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-3 pb-8 custom-scrollbar">
        <div className="space-y-2">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              onClick={() => handleToggle(task.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-2xl shadow-sm border transition-all cursor-pointer",
                task.completed 
                  ? "bg-white border-brand-mint/20 opacity-70" 
                  : "bg-white border-slate-100"
              )}
            >
              {/* ICONE */}
              <div 
                className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100"
                onClick={(e) => handleSpeakTask(task, e)}
              >
                {getTaskIcon(task)}
              </div>

              {/* NOME DA TAREFA */}
              <div className="flex-1 min-w-0">
                <span 
                  className={cn(
                    "text-lg font-bold tracking-tight block truncate",
                    task.completed ? "text-slate-400 line-through" : "text-slate-700"
                  )}
                >
                  {task.label}
                </span>
                {task.completed && (
                  <span className="text-[9px] font-black text-brand-mint-text uppercase tracking-widest block">
                    Feito! ✨
                  </span>
                )}
              </div>

              {/* CHECKBOX */}
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 shrink-0",
                  task.completed 
                    ? "bg-brand-mint border-brand-mint text-white" 
                    : "bg-white border-slate-100 text-transparent"
                )}
              >
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
