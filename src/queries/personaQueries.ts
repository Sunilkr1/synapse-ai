import { useQuery } from '@tanstack/react-query';
import { BUILT_IN_PERSONAS } from '../constants/personas';
import { PersonaService } from '../services/supabase/personas';
import { useAuthStore } from '../stores/authStore';

export const personaKeys = { all: ['personas'] as const };

export function usePersonasQuery() {
  const session = useAuthStore(s => s.session);

  return useQuery({
    queryKey: personaKeys.all,
    queryFn: async () => {
      // 1. Start with built-ins
      let allPersonas = [...BUILT_IN_PERSONAS];

      // 2. Fetch custom ones from cloud if logged in
      if (session?.user?.id) {
        const custom = await PersonaService.getUserPersonas(session.user.id);
        const formattedCustom = custom.map(p => ({
          id: p.id,
          name: p.name,
          role: p.role,
          description: p.role || '',
          systemPrompt: p.system_prompt,
          icon: 'User', 
          color: p.color || '#8B5CF6',
          isBuiltIn: false,
          isCustom: true
        }));
        allPersonas = [...allPersonas, ...formattedCustom];
      }

      return allPersonas;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
