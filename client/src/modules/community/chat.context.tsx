import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { toast } from 'sonner';
import { toastStyles } from '@/components/ui/sonner';
import { type ChatMessageDTO, messageEventSchema } from './chat.schema';
import chatService from './chat.service';
import type { CommunityDTO } from './community.schema';
import communityService from './community.service';

type IChatContext = {
  community: CommunityDTO;
  handleSendMessage: (message: string) => void;
};

const ChatContext = createContext({} as IChatContext);

type ChatContextProviderProps = PropsWithChildren & {
  communityId: string;
};

export function ChatContextProvider({
  children,
  communityId,
}: ChatContextProviderProps) {
  const queryClient = useQueryClient();
  const chatSocketRef = useRef<WebSocket | null>(null);

  const { data: community } = useSuspenseQuery({
    queryKey: ['community', communityId],
    queryFn: () => communityService.getCommunityById(communityId),
  });

  const handleSendMessage = useCallback((message: string) => {
    if (!chatSocketRef.current || chatSocketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    chatSocketRef.current.send(JSON.stringify({ message }));
  }, []);

  const handleReciveMessage = useCallback(
    (payload: ChatMessageDTO) => {
      queryClient.setQueryData(
        ['community', community._id, 'messages'],
        (old: ChatMessageDTO[] = []) => [payload, ...old],
      );
    },
    [community, queryClient],
  );

  useEffect(() => {
    const chatSocket = chatService.connect(community._id);
    chatSocketRef.current = chatSocket;

    chatSocket.addEventListener('message', (message) => {
      const data = messageEventSchema.parse(JSON.parse(message.data));

      if (data.error) {
        return toast.error(data.payload.message, toastStyles.error);
      }

      if (data.event === 'message') handleReciveMessage(data.payload);
    });

    return () => {
      chatSocket.close();
      chatSocketRef.current = null;
    };
  }, [community, handleReciveMessage]);

  return (
    <ChatContext.Provider value={{ community, handleSendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
