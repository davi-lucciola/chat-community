import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { createContext, type PropsWithChildren, useCallback, useContext } from 'react';
import { toast } from 'sonner';
import { toastStyles } from '@/components/ui/sonner';
import type { UserDTO } from '@/modules/user/user.schema';
import userService from '@/modules/user/user.service';

export type IAuthContext = {
  user?: UserDTO;
  isFechingUser: boolean;
  unauthorizedHandler: (message: string) => void;
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

  const unauthorizedHandler = useCallback(
    (message: string) => {
      queryClient.setQueryData(['user'], undefined);
      navigate({ to: '/sign-in' });
      toast.error(message, toastStyles.error);
    },
    [queryClient, navigate],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isFechingUser,
        unauthorizedHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
