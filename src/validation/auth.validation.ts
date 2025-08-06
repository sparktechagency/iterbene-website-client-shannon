import { FieldValues } from "react-hook-form";
import { z } from "zod";

export const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Password is required",
    })
}) as z.ZodType<FieldValues>;

export const registerValidationSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required",
    invalid_type_error: "Full name must be a string",
  }),
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" })
}) as z.ZodType<FieldValues>;

export const forgotPasswordValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email format"),
}) as z.ZodType<FieldValues>;

export const resetPasswordValidationSchema = z
  .object({
    newPassword: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, { message: 'Password must be at least 8 characters long' }),

    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .min(8, { message: 'Confirm Password must be at least 8 characters long' })
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error will be attached to confirmPassword field
  }) as z.ZodType<FieldValues>;
