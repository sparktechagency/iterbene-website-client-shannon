import { FieldValues } from "react-hook-form";
import { z } from "zod";

export const editProfileValidationSchema = z.object({
  fullName: z.string({
    required_error: "Full name is required",
    invalid_type_error: "Full name must be a string",
  }),
  nickName: z
    .string({
      required_error: "Nick name is required",
      invalid_type_error: "Nick name must be a string",
    })
    .optional(),
  username: z.string({
    required_error: "Username is required",
    invalid_type_error: "Username must be a string",
  }),
  address: z.string({
    required_error: "Address is required",
    invalid_type_error: "Address must be a string",
  }),
  phoneNumber: z.string({
    required_error: "Phone number is required",
    invalid_type_error: "Phone number must be a string",
  }),
  country: z.string({
    required_error: "Country is required",
    invalid_type_error: "Country must be a string",
  }),
  city: z.string({
    required_error: "City is required",
    invalid_type_error: "City must be a string",
  }),
  state: z.string({
    required_error: "State is required",
    invalid_type_error: "State must be a string",
  }),
  referredAs: z.string({
    required_error: "Referred as is required",
    invalid_type_error: "Referred as must be a string",
  }),
  ageRange: z.string({
    required_error: "Age range is required",
    invalid_type_error: "Age range must be a string",
  }),
  profession: z.string({
    required_error: "Profession is required",
    invalid_type_error: "Profession must be a string",
  }),
  maritalStatus: z.string({
    required_error: "Relationship status is required",
    invalid_type_error: "Relationship status must be a string",
  }),
}) as z.ZodType<FieldValues>;
