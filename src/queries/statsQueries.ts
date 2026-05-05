import { useQuery } from '@tanstack/react-query';
import { useStats } from '../hooks/useStats';

export const statsKeys = { all: ['stats'] as const };

// A thin React Query wrapper around the useStats hook
export function useStatsQuery() {
  const { stats, isLoading } = useStats();
  return { data: stats, isLoading };
}
