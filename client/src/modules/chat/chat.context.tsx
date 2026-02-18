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
import type { CommunityDTO, CommunityMemberDTO } from '../community/community.schema';
import communityService from '../community/community.service';
import {
  type ChatMessageDTO,
  eventSchema,
  type MessageEventDTO,
  type StatusChangeEventDTO,
} from './chat.schema';
import chatService from './chat.service';

type IChatContext = {
  community: CommunityDTO;
  messages: ChatMessageDTO[];
  members: CommunityMemberDTO[];
  sendMessage: (message: string) => void;
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

  const { data: messages } = useSuspenseQuery({
    queryKey: ['community', community._id, 'messages'],
    queryFn: () => chatService.getMessages(community._id),
  });

  const { data: members } = useSuspenseQuery({
    queryKey: ['community', community._id, 'members'],
    queryFn: async () => communityService.getMembers(community._id),
  });

  const sendMessage = useCallback((message: string) => {
    if (!chatSocketRef.current || chatSocketRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    chatSocketRef.current.send(JSON.stringify({ message }));
  }, []);

  const reciveMessage = useCallback(
    ({ payload }: MessageEventDTO) => {
      queryClient.setQueryData(
        ['community', community._id, 'messages'],
        (old: ChatMessageDTO[] = []) => [payload, ...old],
      );
    },
    [community, queryClient],
  );

  const reciveStatusChange = useCallback(
    ({ payload }: StatusChangeEventDTO) => {
      queryClient.setQueryData(
        ['community', community._id, 'members'],
        (old: CommunityMemberDTO[]) =>
          old.map((member) =>
            member.user._id !== payload.userId
              ? member
              : { ...member, user: { ...member.user, status: payload.status } },
          ),
      );
    },
    [community, queryClient],
  );

  useEffect(() => {
    const chatSocket = chatService.connect(community._id);
    chatSocketRef.current = chatSocket;

    chatSocket.addEventListener('open', () => {
      queryClient.invalidateQueries({
        queryKey: ['community', community._id, 'members'],
      });
    });

    chatSocket.addEventListener('message', (message) => {
      const data = eventSchema.parse(JSON.parse(message.data));

      if (data.event === 'error') {
        return toast.error(data.payload.message, toastStyles.error);
      }

      if (data.event === 'message') {
        return reciveMessage(data);
      }

      if (data.event === 'status_change') {
        return reciveStatusChange(data);
      }
    });

    return () => {
      chatSocket.close();
      chatSocketRef.current = null;
    };
  }, [community, queryClient, reciveMessage, reciveStatusChange]);

  return (
    <ChatContext.Provider value={{ community, messages, members, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
