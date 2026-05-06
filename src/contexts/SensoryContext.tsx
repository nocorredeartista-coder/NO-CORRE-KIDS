import React, { createContext, useContext, useState, useEffect } from 'react';
import { SensorySettings } from '../types';

interface SensoryContextType {
  settings: SensorySettings;
  updateSettings: (newSettings: Partial<SensorySettings>) => void;
}

const SensoryContext = createContext<SensoryContextType | undefined>(undefined);

export const SensoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SensorySettings>(() => {
    const saved = localStorage.getItem('no-corre-kids-sensory');
    return saved ? JSON.parse(saved) : {
      volume: 0.5,
      brightness: 0.8,
      voiceSpeed: 0.8,
      lowStimulation: false,
      animationsEnabled: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('no-corre-kids-sensory', JSON.stringify(settings));
    
    // Apply brightness overlay if needed
    const overlayId = 'sensory-overlay';
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100vw';
      overlay.style.height = '100vh';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      document.body.appendChild(overlay);
    }
    
    // Low brightness = darker overlay
    const opacity = (1 - settings.brightness) * 0.5;
    overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
  }, [settings]);

  const updateSettings = (newSettings: Partial<SensorySettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <SensoryContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SensoryContext.Provider>
  );
};

export const useSensory = () => {
  const context = useContext(SensoryContext);
  if (!context) throw new Error('useSensory must be used within SensoryProvider');
  return context;
};
