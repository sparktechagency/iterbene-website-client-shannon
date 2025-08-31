import { FieldValues } from "react-hook-form";
import { z } from "zod";

const eventValidationSchema = z.object({
  eventName: z.string({
    required_error: "Event name is required",
    invalid_type_error: "Event name must be a string",
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
