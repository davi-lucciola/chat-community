import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toastStyles } from '@/components/ui/sonner';
import { useAuth } from '@/modules/auth/auth.context';
import authService from '@/modules/auth/auth.service';
import { type SignInDTO, signInSchema } from '../auth.schema';

export function SignInForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { resetUnauthorizedState } = useAuth();

  const { mutateAsync: login, isPending } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: authService.signIn,
  });

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (payload: SignInDTO) => {
    await login(payload);

    resetUnauthorizedState();
    await queryClient.resetQueries();

    navigate({ to: '/communities' });
    toast.success('Authenticated successfully.', toastStyles.success);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email"> Email </FieldLabel>
              <Input
                {...field}
                id="email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="john.doe@email.com"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password"> Password </FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="**********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button disabled={isPending}>
          Login
          {isPending && <Loader className="w-4 h-4 animate-spin" />}
        </Button>
      </FieldGroup>
    </form>
  );
}
