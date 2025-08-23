import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../lib/supabase';
import {
  CreateReviewInput,
  ReviewResponse,
  ReviewListResponse,
  ReviewQuery,
} from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  private readonly supabase;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createSupabaseClient(configService);
  }

  async createReview(input: CreateReviewInput): Promise<ReviewResponse> {
    // 1. Check if user can review this booking
    const canReview = await this.canUserReview(input.bookingId, input.userId);
    if (!canReview) {
      throw new BadRequestException('Cannot review this booking. Booking must be completed and not already reviewed.');
    }

    // 2. Check if package exists
    const { data: packageData, error: packageError } = await this.supabase
      .from('packages')
      .select('id')
      .eq('id', input.packageId)
      .eq('is_published', true)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with ID '${input.packageId}' not found or not published`);
    }

    // 3. Create review
    const { data: reviewData, error: reviewError } = await this.supabase
      .from('reviews')
      .insert({
        booking_id: input.bookingId,
        package_id: input.packageId,
        rating: input.rating,
        comment: input.comment || null,
      })
      .select()
      .single();

    if (reviewError) {
      throw new Error(`Failed to create review: ${reviewError.message}`);
    }

    // 4. Update package rating (MVP: simple average)
    await this.updatePackageRating(input.packageId);

    return reviewData as ReviewResponse;
  }

  async getPackageReviews(query: ReviewQuery): Promise<ReviewListResponse> {
    // 1. Get reviews for the package
    let queryBuilder = this.supabase
      .from('reviews')
      .select('*')
      .eq('package_id', query.packageId);

    // Get total count
    const { count } = await this.supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('package_id', query.packageId);

    // Apply pagination
    queryBuilder = queryBuilder
      .range(query.offset, query.offset + query.limit - 1)
      .order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch package reviews: ${error.message}`);
    }

    // 2. Calculate average rating
    const { data: avgData, error: avgError } = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('package_id', query.packageId);

    let averageRating = 0;
    if (!avgError && avgData && avgData.length > 0) {
      const totalRating = avgData.reduce((sum, review) => sum + review.rating, 0);
      averageRating = Number((totalRating / avgData.length).toFixed(1));
    }

    return {
      reviews: data as ReviewResponse[],
      total: count || 0,
      averageRating,
      limit: query.limit,
      offset: query.offset,
      hasMore: (query.offset + query.limit) < (count || 0),
    };
  }

  private async canUserReview(bookingId: string, userId: string): Promise<boolean> {
    // MVP: Check if booking exists, is completed, and belongs to user
    // In production, this would call an RPC function: can_review(bookingId)
    const { data, error } = await this.supabase
      .from('bookings')
      .select('id, status, user_id')
      .eq('id', bookingId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return false;
    }

    // Check if booking is completed
    if (data.status !== 'completed') {
      return false;
    }

    // Check if user already reviewed this booking
    const { data: existingReview } = await this.supabase
      .from('reviews')
      .select('id')
      .eq('booking_id', bookingId)
      .single();

    return !existingReview; // Can only review if no existing review
  }

  private async updatePackageRating(packageId: string): Promise<void> {
    // MVP: Simple average calculation
    // In production, this would be handled by database triggers
    const { data: reviews, error } = await this.supabase
      .from('reviews')
      .select('rating')
      .eq('package_id', packageId);

    if (error || !reviews || reviews.length === 0) {
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Number((totalRating / reviews.length).toFixed(1));

    // Update package with new rating
    await this.supabase
      .from('packages')
      .update({
        rating: averageRating,
        review_count: reviews.length,
      })
      .eq('id', packageId);
  }
}
