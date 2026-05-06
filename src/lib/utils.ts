import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function playAudio(text: string, rate: number = 1, volume: number = 0.5) {
  if (!('speechSynthesis' in window)) return;
  
  // Cancel existing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = rate;
  utterance.volume = volume;
  window.speechSynthesis.speak(utterance);
}
