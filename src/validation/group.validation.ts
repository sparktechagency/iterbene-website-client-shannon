import { FieldValues } from "react-hook-form";
import { z } from "zod";

const groupValidationSchema = z.object({
  groupName: z.string({
    required_error: "Group name is required",
    invalid_type_error: "Group name must be a string",
  }),
  privacy: z.enum(["public", "private"], {
    required_error: "Privacy is required",
    invalid_type_error: "Privacy must be either 'public' or 'private'",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
})  as z.ZodType<FieldValues>;

export default groupValidationSchema