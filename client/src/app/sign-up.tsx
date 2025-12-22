import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
});

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, { error: 'The name is required.' }),
    email: z.email({ error: 'The email should be valid.' }),
    password: z.string().min(1, { error: 'The password is required.' }),
    confirmPassword: z
      .string()
      .min(1, { error: 'The password confirmation is required.' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['password'],
    error: 'The password must be equals to the confirmation.',
  });

export type SignUpPayload = z.infer<typeof signUpSchema>;

function SignUp() {
  const navigate = useNavigate();

  const { mutateAsync: createUser, isPending } = useMutation({
    mutationKey: ['auth', 'sign-up'],
    mutationFn: authService.createUser,
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

  const onSubmit = async (payload: SignUpPayload) => {
    await createUser({
      name: payload.name,
      email: payload.email,
      password: payload.password,
    });

    toast.success('Usuário cadastrado com sucesso.', toastStyles.success);
    navigate({ to: '/sign-in' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
      <Link to="/">
        <ChatCommunityLogo />
      </Link>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <h1 className="text-2xl">Sign Up</h1>
        </CardHeader>
        <CardContent>
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
                    <FieldLabel htmlFor="confirmPassword">
                      Password Confirmation
                    </FieldLabel>
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
        </CardContent>
        <CardFooter>
          <p>Already have a account?</p>
          <Link to="/sign-in">
            <Button variant="link" className="hover:cursor-pointer">
              Login with your account
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
