import { z } from 'zod';

const createRegisterUserValidationSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, { message: 'Name is required' }),
      email: z.string().email({ message: 'Invalid email address' }),
      password: z.string({ message: 'Password is required' }),
    })
    .strict({ message: 'Invalid field(s) provided' }),
});

const createLoginUserValidationSchema = z.object({
  email: z.string({
    required_error: 'Id is required',
  }),
  password: z.string({ required_error: 'Password is required' }),
});

export const AuthValidations = {
  createRegisterUserValidationSchema,
  createLoginUserValidationSchema,
};
