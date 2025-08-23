import { z } from 'zod';

// Create Review DTO
export const CreateReviewDto = z.object({
  bookingId: z.string().uuid('Invalid booking ID'),
  userId: z.string().uuid('Invalid user ID'),
  packageId: z.string().uuid('Invalid package ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(1000, 'Comment must be less than 1000 characters').optional(),
});

// Review Response DTO
export const ReviewResponseDto = z.object({
  id: z.string().uuid(),
  booking_id: z.string().uuid(),
  package_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().nullable(),
  created_at: z.string().datetime(),
});

// Review List Response DTO
export const ReviewListResponseDto = z.object({
  reviews: z.array(ReviewResponseDto),
  total: z.number().int().min(0),
  averageRating: z.number().min(0).max(5),
  limit: z.number().int().positive(),
  offset: z.number().int().min(0),
  hasMore: z.boolean(),
});

// Review Query DTO
export const ReviewQueryDto = z.object({
  packageId: z.string().uuid('Invalid package ID'),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

// Export types
export type CreateReviewInput = z.infer<typeof CreateReviewDto>;
export type ReviewResponse = z.infer<typeof ReviewResponseDto>;
export type ReviewListResponse = z.infer<typeof ReviewListResponseDto>;
export type ReviewQuery = z.infer<typeof ReviewQueryDto>;
