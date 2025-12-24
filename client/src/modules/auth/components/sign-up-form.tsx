import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toastStyles } from '@/components/ui/sonner';
import authService from '@/modules/auth/auth.service';
import { type SignUpDTO, signUpSchema } from '../auth.schema';

export function SignUpForm() {
  const navigate = useNavigate();

  const { mutateAsync: createUser, isPending } = useMutation({
    mutationKey: ['auth', 'sign-up'],
    mutationFn: authService.signUp,
    onError: (error) => {
      toast.error(error.message, toastStyles.error);
    },
  });

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (payload: SignUpDTO) => {
    await createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    toast.success('Usuário cadastrado com sucesso.', toastStyles.success);
    navigate({ to: '/sign-in' });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name"> Name </FieldLabel>
              <Input
                {...field}
                id="name"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="John Doe"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="confirmPassword">Password Confirmation</FieldLabel>
              <Input
                {...field}
                id="confirmPassword"
                type="password"
                aria-invalid={fieldState.invalid}
                placeholder="**********"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button disabled={isPending}>
          Create your account
          {isPending && <Loader className="w-4 h-4 animate-spin" />}
        </Button>
      </FieldGroup>
    </form>
  );
}
