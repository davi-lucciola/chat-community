import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { setUnauthorizedHandler } from '@/lib/api';
import { useAuth } from '../auth/auth.context';
import { type UserDTO, type UserStatus, UserStatusEnum } from './user.schema';
import userStatusService from './user.service';

const ACTIVITY_EVENTS = ['mousemove', 'click', 'keydown'] as const;
const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

const UserContext = createContext({});

export function UserContextProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  const { user, unauthorizedHandler } = useAuth();

  const socketRef = useRef<WebSocket | null>(null);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setCurrentStatus = useCallback(
    (status: UserStatus) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'status_update', status }));
        queryClient.setQueryData(['user'], (user: UserDTO) => ({ ...user, status }));
      }
    },
    [queryClient],
  );

  const resetIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    idleTimeoutRef.current = setTimeout(() => {
      setCurrentStatus(UserStatusEnum.IDLE);
    }, IDLE_TIMEOUT);
  }, [setCurrentStatus]);

  const userActivity = useCallback(
    (user: UserDTO) => {
      if (user.status !== UserStatusEnum.ONLINE) {
        setCurrentStatus(UserStatusEnum.ONLINE);
      }

      resetIdleTimeout();
    },
    [resetIdleTimeout, setCurrentStatus],
  );

  useEffect(() => {
    if (!user) return;
    const handleActivity = () => userActivity(user);

    const socket = userStatusService.connect();
    socketRef.current = socket;

    socket.addEventListener('open', () => {
      setCurrentStatus(user.status);
      resetIdleTimeout();
    });

    socket.addEventListener('close', () => {
      setCurrentStatus(UserStatusEnum.OFFLINE);
    });

    for (const event of ACTIVITY_EVENTS) {
      document.addEventListener(event, handleActivity);
    }

    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      for (const event of ACTIVITY_EVENTS) {
        document.removeEventListener(event, handleActivity);
      }

      socket.close();
      socketRef.current = null;
    };
  }, [user, resetIdleTimeout, setCurrentStatus, userActivity]);

  useEffect(() => {
    const handler = (message: string) => {
      unauthorizedHandler(message);
      setCurrentStatus(UserStatusEnum.OFFLINE);
    };

    setUnauthorizedHandler(handler);
    queryClient.refetchQueries({ queryKey: ['user'] });
    return () => setUnauthorizedHandler(undefined);
  }, [queryClient, unauthorizedHandler, setCurrentStatus]);

  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
}
