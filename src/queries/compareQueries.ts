import { useQuery } from '@tanstack/react-query';
import { CompareResult } from '../types';

export const compareKeys = { all: ['compare'] as const };

// Placeholder for future Supabase compare history query
export function useCompareHistory() {
  return useQuery<CompareResult[]>({
    queryKey: compareKeys.all,
    queryFn: async () => [], // Will be replaced with Supabase query after auth
    staleTime: 1000 * 60,
  });
}
