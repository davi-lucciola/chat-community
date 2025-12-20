import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ChatCommunityLogo } from '@/components/logo';

export const Route = createFileRoute('/sign-up')({
  component: SignUp,
});

export const createUserSchema = z
  .object({
    name: z.string({ error: 'O campo nome é obrigatório.' }).trim(),
    email: z.email({ error: 'O campo email é obrigatório.' }),
    password: z.string({ error: 'A senha é obrigatória' }),
    confirmPassword: z.string({ error: 'A confirmação da senha é obrigatória' }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['password'],
    error: 'A senha deve ser igual a confirmação da senha.',
  });

export type CreateUserPayload = z.infer<typeof createUserSchema>;

function SignUp() {
  const form = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
  });

  const onSubmit = (payload: CreateUserPayload) => {
    console.log(payload);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
      <Link to='/'>
        <ChatCommunityLogo />
      </Link>
      <Card className="max-w-xl w-full">
        <CardHeader>
          <h1 className="text-2xl">Cadastre-se</h1>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name"> Nome </FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="John Doe"
                      autoComplete="off"
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
                      autoComplete="off"
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
                    <FieldLabel htmlFor="password"> Senha </FieldLabel>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="**********"
                      autoComplete="off"
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
                    <FieldLabel htmlFor="confirmPassword"> Confirmar Senha </FieldLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      aria-invalid={fieldState.invalid}
                      placeholder="**********"
                      autoComplete="off"
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Button> Cadastrar </Button>
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <p>Já tem uma conta?</p>
          <Link to="/sign-in">
            <Button variant="link" className="hover:cursor-pointer">
              Entre com sua Conta
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
