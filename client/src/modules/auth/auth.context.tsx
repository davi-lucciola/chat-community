import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useRef,
} from 'react';
import { toast } from 'sonner';
import { toastStyles } from '@/components/ui/sonner';
import type { UserDTO } from '@/modules/user/user.schema';
import userService from '@/modules/user/user.service';

export type IAuthContext = {
  user?: UserDTO;
  isFechingUser: boolean;
  unauthorizedHandler: (message: string) => void;
  resetUnauthorizedState: () => void;
};

const AuthContext = createContext({} as IAuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isPending: isFechingUser } = useQuery({
    queryKey: ['user'],
    queryFn: userService.getCurrentUser,
    initialData: undefined,
    retry: false,
  });

  const isHandlingUnauthorized = useRef(false);

  const unauthorizedHandler = useCallback(
    (message: string) => {
      if (isHandlingUnauthorized.current) return;

      isHandlingUnauthorized.current = true;
      queryClient.setQueryData(['user'], undefined);

      navigate({ to: '/sign-in' });
      toast.error(message, toastStyles.error);
    },
    [queryClient, navigate],
  );

  const resetUnauthorizedState = useCallback(() => {
    isHandlingUnauthorized.current = false;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isFechingUser,
        unauthorizedHandler,
        resetUnauthorizedState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
