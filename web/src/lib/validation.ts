import { z } from "zod";

export const bookingSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD"),
  travelers: z.number().int().positive(),
  selectedOptionIds: z.array(z.string().uuid()).optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;


