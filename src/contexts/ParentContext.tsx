import React, { createContext, useContext, useState, useEffect } from 'react';
import { ParentSettings, ProgressData, Task } from '../types';

interface ParentContextType {
  settings: ParentSettings;
  progress: ProgressData;
  isLocked: boolean;
  updateSettings: (settings: Partial<ParentSettings>) => void;
  trackProgress: (type: 'word' | 'color' | 'letter' | 'activity' | 'routine_complete' | 'emotion', value: string) => void;
  updateRoutine: (tasks: Task[]) => void;
  resetTimer: () => void;
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

const DEFAULT_SETTINGS: ParentSettings = {
  timeLimitMinutes: 20,
  startTime: null,
  pin: '1234',
};

const DEFAULT_TASKS: Task[] = [
  { id: 'r1', label: 'Escovar os dentes', icon: '🦷', completed: false, category: 'pessoal', feedback: 'Muito bem!' },
  { id: 'r2', label: 'Tomar banho', icon: '🚿', completed: false, category: 'pessoal', feedback: 'Boa!' },
  { id: 'r3', label: 'Trocar de roupa', icon: '👕', completed: false, category: 'pessoal', feedback: 'Você conseguiu!' },
  { id: 'r4', label: 'Tomar café da manhã', icon: '🍞', completed: false, category: 'pessoal', feedback: 'Mais uma tarefa feita!' },
  { id: 'r5', label: 'Beber água', icon: '💧', completed: false, category: 'saude', feedback: 'Muito bem!' },
  { id: 'r6', label: 'Almoçar', icon: '🍽️', completed: false, category: 'pessoal', feedback: 'Boa!' },
  { id: 'r7', label: 'Fazer lição de casa', icon: '📚', completed: false, category: 'escola', feedback: 'Você conseguiu!' },
  { id: 'r8', label: 'Ler uma palavra nova', icon: '📖', completed: false, category: 'escola', feedback: 'Mais uma tarefa feita!' },
  { id: 'r9', label: 'Brincar', icon: '🧸', completed: false, category: 'pessoal', feedback: 'Muito bem!' },
  { id: 'r10', label: 'Guardar brinquedos', icon: '📦', completed: false, category: 'casa', feedback: 'Boa!' },
  { id: 'r11', label: 'Jantar', icon: '🍽️', completed: false, category: 'pessoal', feedback: 'Você conseguiu!' },
  { id: 'r12', label: 'Colocar pijama', icon: '🛏️', completed: false, category: 'pessoal', feedback: 'Mais uma tarefa feita!' },
  { id: 'r13', label: 'Escovar os dentes antes de dormir', icon: '🦷', completed: false, category: 'pessoal', feedback: 'Muito bem!' },
  { id: 'r14', label: 'Respirar devagar', icon: '🌙', completed: false, category: 'saude', feedback: 'Boa!' },
  { id: 'r15', label: 'Dormir', icon: '😴', completed: false, category: 'saude', feedback: 'Você conseguiu!' },
];

const DEFAULT_PROGRESS: ProgressData = {
  wordsLearned: [],
  colorsRecognized: [],
  lettersPracticed: [],
  lastSession: new Date().toISOString(),
  activitiesCount: {},
  routineTasks: DEFAULT_TASKS,
  currentEmotion: 'Feliz',
};

export const ParentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ParentSettings>(() => {
    const saved = localStorage.getItem('no-corre-kids-parent');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [progress, setProgress] = useState<ProgressData>(() => {
    const saved = localStorage.getItem('no-corre-kids-progress');
    if (!saved) return DEFAULT_PROGRESS;
    
    try {
      const parsed = JSON.parse(saved);
      
      // Ensure routineTasks is a valid array
      const routineTasks = Array.isArray(parsed.routineTasks) ? parsed.routineTasks : [];
      
      // Migration: If we don't have the new IDs (r1-r15) or icons are old, force reset
      const hasNewTasks = routineTasks.some((t: any) => t?.id?.startsWith('r'));
      const hasOldIcon = routineTasks.some((t: any) => 
        (t?.id === 'r10' && t?.icon === '🧺') || 
        (t?.id === 'r1' && t?.icon === '🪥')
      );
      
      if (!hasNewTasks || hasOldIcon || routineTasks.length !== DEFAULT_TASKS.length) {
        return { ...parsed, routineTasks: DEFAULT_TASKS };
      }
      
      return { ...parsed, routineTasks };
    } catch (e) {
      console.error("Failed to parse progress", e);
      return DEFAULT_PROGRESS;
    }
  });

  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    localStorage.setItem('no-corre-kids-parent', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('no-corre-kids-progress', JSON.stringify(progress));
  }, [progress]);

  // Timer logic
  useEffect(() => {
    if (!settings.startTime) {
      setSettings(prev => ({ ...prev, startTime: Date.now() }));
      return;
    }

    const interval = setInterval(() => {
      // Locking disabled for testing as requested
      // const elapsed = (Date.now() - settings.startTime!) / 60000;
      // if (elapsed >= settings.timeLimitMinutes) {
      //   setIsLocked(true);
      // }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [settings.startTime, settings.timeLimitMinutes]);

  const updateSettings = (newSettings: Partial<ParentSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetTimer = () => {
    setSettings(prev => ({ ...prev, startTime: Date.now() }));
    setIsLocked(false);
  };

  const trackProgress = (type: 'word' | 'color' | 'letter' | 'activity' | 'routine_complete' | 'emotion', value: string) => {
    setProgress(prev => {
      const next = { ...prev };
      if (type === 'word' && !next.wordsLearned.includes(value)) next.wordsLearned.push(value);
      if (type === 'color' && !next.colorsRecognized.includes(value)) next.colorsRecognized.push(value);
      if (type === 'letter' && !next.lettersPracticed.includes(value)) next.lettersPracticed.push(value);
      if (type === 'activity') {
        next.activitiesCount[value] = (next.activitiesCount[value] || 0) + 1;
      }
      if (type === 'routine_complete') {
        const tasks = Array.isArray(next.routineTasks) ? next.routineTasks : [];
        next.routineTasks = tasks.map(t => t.id === value ? { ...t, completed: !t.completed } : t);
      }
      if (type === 'emotion') {
        next.currentEmotion = value;
      }
      return next;
    });
  };

  const updateRoutine = (tasks: Task[]) => {
    setProgress(prev => ({ ...prev, routineTasks: tasks }));
  };

  return (
    <ParentContext.Provider value={{ settings, progress, isLocked, updateSettings, trackProgress, updateRoutine, resetTimer }}>
      {children}
    </ParentContext.Provider>
  );
};

export const useParent = () => {
  const context = useContext(ParentContext);
  if (!context) throw new Error('useParent must be used within ParentProvider');
  return context;
};
