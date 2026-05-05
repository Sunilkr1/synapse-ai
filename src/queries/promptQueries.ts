import { useQuery } from '@tanstack/react-query';
import { BUILT_IN_PROMPTS } from '../constants/prompts';

export const promptKeys = { all: ['prompts'] as const };

export function usePromptsQuery() {
  return useQuery({
    queryKey: promptKeys.all,
    queryFn: async () => BUILT_IN_PROMPTS,
    staleTime: Infinity,
  });
}
