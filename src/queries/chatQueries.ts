import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Database } from '../services/storage/database';
import { ChatSession } from '../types';

export const chatKeys = { all: ['chats'] as const };

export function useChatHistory() {
  return useQuery({
    queryKey: chatKeys.all,
    queryFn: () => Database.getAllChats(),
  });
}

export function useDeleteChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Database.deleteChat(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.all }),
  });
}

export function useSaveChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (session: ChatSession) => Database.saveChat(session),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatKeys.all }),
  });
}
