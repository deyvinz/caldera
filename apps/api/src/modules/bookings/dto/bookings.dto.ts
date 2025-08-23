import { z } from 'zod';

// Create Booking DTO
export const CreateBookingDto = z.object({
  packageId: z.string().uuid('Invalid package ID'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date must be in YYYY-MM-DD format').optional(),
  travelers: z.number().int().positive('Must have at least 1 traveler').max(50, 'Maximum 50 travelers allowed'),
  concierge: z.boolean().optional(),
  selectedOptionIds: z.array(z.string().uuid('Invalid option ID')).optional(),
  userId: z.string().uuid('Invalid user ID'),
});

// Booking Response DTO
export const BookingResponseDto = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  package_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  traveler_count: z.number().int().positive(),
  total_price: z.number().positive(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']),
  qr_code_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
});

// Booking List Response DTO
export const BookingListResponseDto = z.object({
  bookings: z.array(BookingResponseDto),
  total: z.number().int().min(0),
  limit: z.number().int().positive(),
  offset: z.number().int().min(0),
  hasMore: z.boolean(),
});

// Booking Query DTO
export const BookingQueryDto = z.object({
  userId: z.string().uuid('Invalid user ID'),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Pricing Breakdown DTO
export const PricingBreakdownDto = z.object({
  base: z.number().positive(),
  options: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    price: z.number().positive(),
    qty: z.number().int().positive().optional(),
  })),
  discount: z.number().min(0),
  taxes: z.number().min(0),
  total: z.number().positive(),
  currency: z.literal('USD'),
});

// Create Booking Response DTO
export const CreateBookingResponseDto = z.object({
  bookingId: z.string().uuid(),
  tx_ref: z.string(),
  total_usd: z.number().positive(),
  pricing_breakdown: PricingBreakdownDto,
  qr_code_url: z.string().url(),
});

// Export types
export type CreateBookingInput = z.infer<typeof CreateBookingDto>;
export type BookingResponse = z.infer<typeof BookingResponseDto>;
export type BookingListResponse = z.infer<typeof BookingListResponseDto>;
export type BookingQuery = z.infer<typeof BookingQueryDto>;
export type PricingBreakdown = z.infer<typeof PricingBreakdownDto>;
export type CreateBookingResponse = z.infer<typeof CreateBookingResponseDto>;
