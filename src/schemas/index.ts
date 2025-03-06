import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum(['ADMIN', 'USER']),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6))
  })
  .refine(data => !(data.password && !data.newPassword), {
    message: 'schemas.new-password.required',
    path: ['newPassword']
  })
  .refine(data => !(data.newPassword && !data.password), {
    message: 'schemas.password.required',
    path: ['password']
  });

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'schemas.string.min'
  })
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'schemas.email.required'
  })
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'schemas.email.required'
  }),
  password: z.string().min(1, {
    message: 'schemas.password.required'
  }),
  code: z.optional(z.string())
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'schemas.email.required'
  }),
  password: z.string().min(6, {
    message: 'schemas.string.min'
  }),
  name: z.string().min(1, {
    message: 'schemas.name.required'
  })
});
