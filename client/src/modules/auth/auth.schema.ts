import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({ error: 'The email should be valid.' }),
  password: z.string().trim().min(1, { error: 'The password is required.' }),
});

export type SignInDTO = z.infer<typeof signInSchema>;

export type TokenDTO = {
  accessToken: string;
  type: string;
};

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

export type SignUpDTO = z.infer<typeof signUpSchema>;
