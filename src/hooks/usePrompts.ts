import { useState } from 'react';
import { BUILT_IN_PROMPTS } from '../constants/prompts';
import { Prompt } from '../types';

export function usePrompts() {
  const [prompts, setPrompts] = useState<Prompt[]>(BUILT_IN_PROMPTS);

  const toggleFavorite = (id: string) => {
    setPrompts(prev =>
      prev.map(p => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  const favorites = prompts.filter(p => p.isFavorite);

  return { prompts, favorites, toggleFavorite };
}
