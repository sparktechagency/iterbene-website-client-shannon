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
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    }) // At least one uppercase letter
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    }) // At least one lowercase letter
    .regex(/[0-9]/, { message: "Password must contain at least one number" }) // At least one number
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }), // At least one special character (e.g., !@#$%^&*)
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
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[\W_]/, {
        message: 'Password must contain at least one special character',
      }),

    confirmPassword: z
      .string({
        required_error: 'Confirm Password is required',
      })
      .min(8, { message: 'Confirm Password must be at least 8 characters long' })
      .regex(/[A-Z]/, {
        message: 'Confirm Password must contain at least one uppercase letter',
      })
      .regex(/[a-z]/, {
        message: 'Confirm Password must contain at least one lowercase letter',
      })
      .regex(/[0-9]/, {
        message: 'Confirm Password must contain at least one number',
      })
      .regex(/[\W_]/, {
        message: 'Confirm Password must contain at least one special character',
      }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // Error will be attached to confirmPassword field
  }) as z.ZodType<FieldValues>;
