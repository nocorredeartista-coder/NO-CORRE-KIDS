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
    if (label.includes('escovar os dentes')) return <Smile className="w-14 h-14 text-brand-blue" />;
    if (label.includes('banho')) return <Bath className="w-14 h-14 text-brand-blue" />;
    if (label.includes('roupa')) return <Shirt className="w-14 h-14 text-brand-blue" />;
    if (label.includes('café da manhã')) return <Coffee className="w-14 h-14 text-brand-blue" />;
    if (label.includes('água')) return <Droplets className="w-14 h-14 text-brand-blue" />;
    if (label.includes('almoçar') || label.includes('jantar')) return <Utensils className="w-14 h-14 text-brand-blue" />;
    if (label.includes('lição') || label.includes('ler')) return <BookOpen className="w-14 h-14 text-brand-blue" />;
    if (label.includes('brincar')) return <Gamepad2 className="w-14 h-14 text-brand-blue" />;
    if (label.includes('guardar')) return <Package className="w-14 h-14 text-brand-blue" />;
    if (label.includes('pijama')) return <Bed className="w-14 h-14 text-brand-blue" />;
    if (label.includes('respirar')) return <Moon className="w-14 h-14 text-brand-blue" />;
    if (label.includes('dormir')) return <Moon className="w-14 h-14 text-brand-blue" />;
    
    return <span className="text-7xl">{task.icon}</span>;
  };

  const handleSpeakTask = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    playAudio(task.label, settings.voiceSpeed, settings.volume);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden font-kids">
      {/* HEADER SIMPLES E INFANTIL */}
      <header className="p-4 md:p-8 bg-brand-blue/5 border-b-4 border-brand-blue/10 rounded-b-[40px] md:rounded-b-[60px] z-10">
        <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onBack} 
            className="p-3 md:p-4 bg-white rounded-2xl md:rounded-3xl text-brand-blue shadow-sm border-2 border-brand-blue/10"
          >
            <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
          </motion.button>
          <div>
            <h2 className="text-2xl md:text-4xl font-black text-slate-800 uppercase tracking-tight">Minha rotina</h2>
            <p className="text-sm md:text-xl font-bold text-slate-400">Clique nas tarefas que você já fez hoje.</p>
          </div>
        </div>

        {/* PROGRESSO SIMPLES */}
        <div className="bg-white p-4 md:p-6 rounded-[32px] md:rounded-[40px] border-2 md:border-4 border-brand-mint/20 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-yellow/20 rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-3xl">
                🏆
              </div>
              <p className="text-lg md:text-2xl font-black text-slate-700 uppercase tracking-tight">
                {stats.completed} de {stats.total} tarefas
              </p>
            </div>

            <p className={cn(
              "text-xs md:text-lg font-black uppercase px-4 md:px-6 py-1 md:py-2 rounded-xl md:rounded-2xl border-2 transition-colors",
              stats.percent === 100 
                ? "bg-brand-mint text-brand-mint-text border-brand-mint" 
                : "bg-slate-50 text-slate-400 border-slate-100"
            )}>
              {stats.percent === 100 
                ? "Parabéns!" 
                : "Amanhã a gente tenta de novo."}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-32 custom-scrollbar bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle(task.id)}
              className={cn(
                "flex items-center gap-4 md:gap-6 p-4 md:p-8 rounded-[32px] md:rounded-[48px] shadow-sm border-2 md:border-4 transition-all cursor-pointer group",
                task.completed 
                  ? "bg-brand-mint/10 border-brand-mint/30" 
                  : "bg-slate-50 border-transparent hover:border-brand-blue/20"
              )}
            >
              {/* ICONE GRANDE */}
              <div 
                className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-2xl md:rounded-3xl flex items-center justify-center shrink-0 border-2 border-brand-blue/5 shadow-sm transition-transform group-active:scale-110"
                onClick={(e) => handleSpeakTask(task, e)}
              >
                <div className="scale-75 md:scale-100">
                  {getTaskIcon(task)}
                </div>
              </div>

              {/* NOME DA TAREFA */}
              <div className="flex-1 flex flex-col min-w-0">
                <span 
                  className={cn(
                    "text-xl md:text-3xl font-black uppercase tracking-tighter leading-none transition-all break-words",
                    task.completed ? "text-slate-400 line-through opacity-60" : "text-slate-700"
                  )}
                  onClick={(e) => handleSpeakTask(task, e)}
                >
                  {task.label}
                </span>
                
                {task.completed && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] md:text-sm font-black text-brand-mint-text uppercase tracking-widest mt-1 md:mt-2"
                  >
                    {task.feedback || 'Muito bem!'} ✨
                  </motion.span>
                )}
              </div>

              {/* CHECKBOX / BOTAOStatus */}
              <div
                className={cn(
                  "w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[32px] flex items-center justify-center transition-all border-2 md:border-4 flex-shrink-0",
                  task.completed 
                    ? "bg-brand-mint border-brand-mint shadow-lg shadow-brand-mint/20 text-white" 
                    : "bg-white border-slate-200 text-slate-100"
                )}
              >
                {task.completed ? <CheckCircle2 className="w-6 h-6 md:w-12 md:h-12" /> : <Circle className="w-6 h-6 md:w-12 md:h-12" />}
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
