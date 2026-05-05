import { useState } from 'react';
import { BUILT_IN_PERSONAS } from '../constants/personas';
import { Persona } from '../types';
import { useChatStore } from '../stores/chatStore';

export function usePersonas() {
  const [personas] = useState<Persona[]>(BUILT_IN_PERSONAS);
  const setActivePersona = useChatStore(s => s.setActivePersona);
  const activePersonaId = useChatStore(s => s.activePersonaId);

  const activePersona = personas.find(p => p.id === activePersonaId) ?? personas[0];

  const selectPersona = (personaId: string) => {
    setActivePersona(personaId);
  };

  return { personas, activePersona, selectPersona };
}
