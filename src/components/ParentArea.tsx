import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, BarChart3, Sliders, Volume2, 
  Sun, Gauge, Zap, ArrowLeft, Clock, 
  Calendar, CheckCircle2, Trash2, RefreshCw, 
  Star, Lightbulb, Heart, Info, Plus
} from 'lucide-react';
import { useParent } from '../contexts/ParentContext';
import { useSensory } from '../contexts/SensoryContext';
import { cn } from '../lib/utils';
import { Task } from '../types';

export default function ParentArea({ onBack, onActivityChange }: { onBack: () => void, onActivityChange?: (activity: any) => void }) {
  const { settings, progress, updateSettings, updateRoutine } = useParent();
  const { settings: sensory, updateSettings: updateSensory } = useSensory();
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskIcon, setNewTaskIcon] = useState('✨');

  const handleResetRoutine = () => {
    const tasks = Array.isArray(progress.routineTasks) ? progress.routineTasks : [];
    const resetTasks = tasks.map(t => ({ ...t, completed: false }));
    updateRoutine(resetTasks);
  };

  const removeTask = (id: string) => {
    const tasks = Array.isArray(progress.routineTasks) ? progress.routineTasks : [];
    updateRoutine(tasks.filter(t => t.id !== id));
  };

  const handleAddTask = () => {
    if (!newTaskLabel.trim()) return;
    
    const newTask: Task = {
      id: `custom-${Date.now()}`,
      label: newTaskLabel,
      icon: newTaskIcon,
      completed: false,
      category: 'personalizada',
      feedback: `Boa! Vamos fazer: ${newTaskLabel}`
    };

    const tasks = Array.isArray(progress.routineTasks) ? progress.routineTasks : [];
    updateRoutine([...tasks, newTask]);
    setNewTaskLabel('');
  };

  const pendingTasks = useMemo(() => {
    const tasks = Array.isArray(progress.routineTasks) ? progress.routineTasks : [];
    return tasks.filter(t => !t.completed);
  }, [progress.routineTasks]);

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-6 bg-slate-50">
      <header className="flex items-center justify-between p-3 md:p-4 bg-white shadow-sm font-kids gap-2">
        <button onClick={onBack} className="p-3 md:p-4 bg-slate-100 rounded-xl md:rounded-2xl text-slate-400 hover:text-brand-blue transition-colors shrink-0">
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-black text-slate-700 uppercase tracking-tight truncate">Responsáveis</h2>
        <div className="w-10 md:w-12" />
      </header>

      <div className="flex-1 p-3 md:p-8 overflow-y-auto pb-12 space-y-6 md:space-y-8 custom-scrollbar">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
            <div className="p-4 md:p-6 bg-brand-lilac/10 rounded-[24px] md:rounded-[32px] border-2 border-brand-lilac/20">
                <p className="text-[8px] md:text-[10px] font-black text-brand-lilac-text uppercase tracking-widest mb-1">Letras</p>
                <p className="text-2xl md:text-3xl font-black text-brand-lilac-text">{progress.lettersPracticed.length}</p>
            </div>
            <div className="p-4 md:p-6 bg-brand-blue/10 rounded-[24px] md:rounded-[32px] border-2 border-brand-blue/20">
                <p className="text-[8px] md:text-[10px] font-black text-brand-blue-text uppercase tracking-widest mb-1">Fases</p>
                <p className="text-2xl md:text-3xl font-black text-brand-blue-text">{(progress.activitiesCount as any)['word'] || 0}</p>
            </div>
            <div className="p-4 md:p-6 bg-brand-mint/10 rounded-[24px] md:rounded-[32px] border-2 border-brand-mint/20">
                <p className="text-[8px] md:text-[10px] font-black text-brand-mint-text uppercase tracking-widest mb-1">Hoje</p>
                <p className="text-2xl md:text-3xl font-black text-brand-mint-text">{(Array.isArray(progress.routineTasks) ? progress.routineTasks : []).filter(t => t.completed).length}</p>
            </div>
            <div className="p-4 md:p-6 bg-brand-yellow/10 rounded-[24px] md:rounded-[32px] border-2 border-brand-yellow/20">
                <p className="text-[8px] md:text-[10px] font-black text-brand-yellow-text uppercase tracking-widest mb-1">Total</p>
                <p className="text-2xl md:text-3xl font-black text-brand-yellow-text">{(Array.isArray(progress.routineTasks) ? progress.routineTasks : []).length}</p>
            </div>
        </div>

        {/* Pending Tasks Alert */}
        {pendingTasks.length > 0 && (
          <div className="p-6 bg-amber-50 rounded-[32px] border-2 border-amber-100 flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-xs font-black text-amber-600 uppercase tracking-widest">Tarefas ainda não concluídas hoje:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {pendingTasks.slice(0, 5).map(t => (
                  <span key={t.id} className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-slate-500 border border-amber-200">
                    {t.icon} {t.label}
                  </span>
                ))}
                {pendingTasks.length > 5 && <span className="text-[10px] font-bold text-slate-400 self-center">e mais {pendingTasks.length - 5}...</span>}
              </div>
            </div>
          </div>
        )}

        {/* Add Task Section */}
        <section className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Plus className="w-6 h-6 text-brand-blue" />
                <h3 className="text-xl font-black text-slate-700 uppercase tracking-tight">Nova Tarefa na Rotina</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da tarefa</label>
                    <input 
                        type="text" 
                        value={newTaskLabel}
                        onChange={(e) => setNewTaskLabel(e.target.value)}
                        placeholder="Ex: Tomar remédio"
                        className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-brand-blue focus:bg-white outline-none font-bold placeholder:text-slate-300"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Ícone</label>
                    <div className="flex gap-2 flex-wrap">
                        {['💊', '🧪', '🧘', '🚿', '🍎', '⚽', '🎨', '✨'].map(icon => (
                            <button 
                                key={icon}
                                onClick={() => setNewTaskIcon(icon)}
                                className={cn("text-2xl p-2 rounded-xl border-2 transition-all", newTaskIcon === icon ? "bg-brand-blue/10 border-brand-blue" : "bg-white border-slate-100")}
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={handleAddTask}
                    className="p-4 bg-brand-blue text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:shadow-xl transition-all"
                >
                    Adicionar
                </button>
            </div>
        </section>

        {/* Routine Management Card */}
        <section className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-slate-400 uppercase tracking-widest font-black text-xs">
              <Calendar className="w-5 h-5" />
              <span>Lista de Tarefas da Rotina</span>
            </div>
            <button 
              onClick={handleResetRoutine}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reiniciar Hoje
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Array.isArray(progress.routineTasks) ? progress.routineTasks : []).map((task) => (
            <div 
                key={task.id}
                className={cn(
                "group flex items-center justify-between p-4 rounded-3xl border-2 transition-all",
                task.completed ? "bg-slate-50 border-emerald-100 opacity-60" : "bg-white border-slate-100 hover:border-brand-blue/30"
                )}
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{task.icon}</span>
                    <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-700 leading-tight">{task.label}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => removeTask(task.id)}
                        className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
            ))}
          </div>
        </section>


        {/* Sensory Settings */}
        <section className="bg-white p-8 rounded-[40px] border-2 border-slate-100 shadow-sm space-y-10">
            <div className="flex items-center space-x-3 text-slate-400 uppercase tracking-widest font-black text-xs">
              <Sliders className="w-5 h-5" />
              <span>Ajustes Sensoriais</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 font-black uppercase text-xs">
                    <Volume2 className="w-5 h-5" />
                    <span>Velocidade da Voz</span>
                  </div>
                  <span className="text-brand-stone font-black">{sensory.voiceSpeed.toFixed(1)}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="1.5" step="0.1"
                  value={sensory.voiceSpeed}
                  onChange={(e) => updateSensory({ voiceSpeed: parseFloat(e.target.value) })}
                  className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-stone"
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600 font-black uppercase text-xs">
                    <Zap className="w-5 h-5" />
                    <span>Volume do Som</span>
                  </div>
                  <span className="text-brand-stone font-black">{Math.round(sensory.volume * 100)}%</span>
                </div>
                <input 
                  type="range" min="0" max="1" step="0.1"
                  value={sensory.volume}
                  onChange={(e) => updateSensory({ volume: parseFloat(e.target.value) })}
                  className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-stone"
                />
              </div>
            </div>
        </section>

      </div>
    </div>
  );
}
