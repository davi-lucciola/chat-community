import { useSuspenseQuery } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, useContext } from 'react';
import type { CommunityDTO } from './community.schema';
import communityService from './community.service';

type IChatContext = {
  community: CommunityDTO;
};

const ChatContext = createContext({} as IChatContext);

type ChatContextProviderProps = PropsWithChildren & {
  communityId: string;
};

export function ChatContextProvider({
  children,
  communityId,
}: ChatContextProviderProps) {
  const { data: community } = useSuspenseQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
  });

  return <ChatContext.Provider value={{ community }}>{children}</ChatContext.Provider>;
}

export function useChat() {
  return useContext(ChatContext);
}
