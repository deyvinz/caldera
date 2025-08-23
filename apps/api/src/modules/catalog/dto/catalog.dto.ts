import { z } from 'zod';

// Destination DTOs
export const DestinationQueryDto = z.object({
  q: z.string().optional(),
  country: z.string().optional(),
  region: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const DestinationResponseDto = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  location: z.string(),
  image_gallery: z.array(z.string().url()).optional(),
  rating: z.number().min(0).max(5).nullable(),
  review_count: z.number().int().min(0).nullable(),
  created_at: z.string().datetime(),
});

export const DestinationListResponseDto = z.object({
  destinations: z.array(DestinationResponseDto),
  total: z.number().int().min(0),
  limit: z.number().int().positive(),
  offset: z.number().int().min(0),
  hasMore: z.boolean(),
});

// Package DTOs
export const PackageQueryDto = z.object({
  q: z.string().optional(),
  destinationId: z.string().uuid().optional(),
  category: z.string().optional(),
  luxury: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  durationMin: z.coerce.number().int().positive().optional(),
  durationMax: z.coerce.number().int().positive().optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const PackageResponseDto = z.object({
  id: z.string().uuid(),
  destination_id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  duration_days: z.number().int().positive(),
  group_size_limit: z.number().int().positive(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  itinerary: z.array(z.object({
    day: z.number().int().positive(),
    title: z.string(),
    description: z.string(),
    activities: z.array(z.string()).optional(),
  })).optional(),
  base_price: z.number().positive(),
  discount_percent: z.number().min(0).max(100).nullable(),
  featured: z.boolean(),
  is_published: z.boolean(),
  created_at: z.string().datetime(),
});

export const PackageListResponseDto = z.object({
  packages: z.array(PackageResponseDto),
  total: z.number().int().min(0),
  limit: z.number().int().positive(),
  offset: z.number().int().min(0),
  hasMore: z.boolean(),
});

// Package Composition DTOs
export const PackageCompositionResponseDto = z.object({
  package_id: z.string().uuid(),
  items: z.array(z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
    options: z.array(z.object({
      id: z.string().uuid(),
      name: z.string(),
      description: z.string(),
      price: z.number().positive(),
    })),
  })),
});

// Export types
export type DestinationQuery = z.infer<typeof DestinationQueryDto>;
export type DestinationResponse = z.infer<typeof DestinationResponseDto>;
export type DestinationListResponse = z.infer<typeof DestinationListResponseDto>;
export type PackageQuery = z.infer<typeof PackageQueryDto>;
export type PackageResponse = z.infer<typeof PackageResponseDto>;
export type PackageListResponse = z.infer<typeof PackageListResponseDto>;
export type PackageCompositionResponse = z.infer<typeof PackageCompositionResponseDto>;
