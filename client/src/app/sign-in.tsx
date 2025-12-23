import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Loader } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { ChatCommunityLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { toastStyles } from '@/components/ui/sonner';
import authService from '@/services/auth.service';
import { useEffect } from 'react';
import { setUnauthorizedHandler } from '@/lib/api';
import { useAuth } from '@/context/auth.context';

export const Route = createFileRoute('/sign-in')({
  component: SignIn,
});

const signInSchema = z.object({
  email: z.email({ error: 'The email should be valid.' }),
  password: z.string().trim().min(1, { error: 'The password is required.' }),
});

export type SignInPayload = z.infer<typeof signInSchema>;

function SignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: login, isPending } = useMutation({
    mutationKey: ['auth', 'sign-in'],
    mutationFn: authService.login,
    onError: (error) => {
      toast.error(error.message, toastStyles.error);
    },
  });

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (payload: SignInPayload) => {
    await login(payload);

    navigate({ to: '/home' });
    toast.success('Authenticated successfully.', toastStyles.success);

    await queryClient.refetchQueries({ queryKey: ['user'] });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
      <Link to="/">
        <ChatCommunityLogo />
      </Link>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <h1 className="text-2xl">Sign In</h1>
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter>
          <p>Does not have a account?</p>
          <Link to="/sign-up">
            <Button variant="link" className="hover:cursor-pointer">
              Create your account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
