import { FieldValues } from "react-hook-form";
import { z } from "zod";

const eventValidationSchema = z.object({
  eventName: z.string({
    required_error: "Event name is required",
    invalid_type_error: "Event name must be a string",
  }),
  startDate: z.string({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  endDate: z.string({
    required_error: "End date is required",
    invalid_type_error: "End date must be a valid date",
  }),
  privacy: z.enum(["public", "private"], {
    required_error: "Privacy is required",
    invalid_type_error: "Privacy must be either 'public' or 'private'",
  }),
  eventCost: z.string({
    required_error: "Event cost is required",
    invalid_type_error: "Event cost must be a number",
  }).min(0, {
    message: "Event cost must be a non-negative number",
  }),
  description: z.string({
    required_error: "Description is required",
    invalid_type_error: "Description must be a string",
  }),
})  as z.ZodType<FieldValues>;

export default eventValidationSchema
