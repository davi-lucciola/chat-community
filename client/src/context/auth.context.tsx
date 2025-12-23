import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';
import { toastStyles } from '@/components/ui/sonner';
import { setUnauthorizedHandler } from '@/lib/api';
import userService from '@/services/user.service';
import type { UserDTO } from '@/types/user';

type AuthContextProps = {
  user?: UserDTO;
  isPending: boolean;
};

const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user, isPending } = useQuery({
    queryKey: ['user'],
    queryFn: userService.getCurrentUser,
    initialData: undefined,
    retry: false,
    staleTime: Infinity,
  });

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      queryClient.clear();
      navigate({ to: '/sign-in' });
      toast.error(message, toastStyles.error);
    });

    return () => setUnauthorizedHandler(undefined);
  }, [queryClient, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
