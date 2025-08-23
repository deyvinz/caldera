import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../lib/supabase';
import { calcTotal, OptionLine } from '../../lib/price';
import { generateQR, generateBookingQR } from '../../lib/qr';
import { nanoid } from 'nanoid';
import { addDays, parseISO } from 'date-fns';
import {
  CreateBookingInput,
  BookingResponse,
  BookingListResponse,
  BookingQuery,
  CreateBookingResponse,
} from './dto/bookings.dto';

@Injectable()
export class BookingsService {
  private readonly supabase;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createSupabaseClient(configService);
  }

  async createBooking(input: CreateBookingInput): Promise<CreateBookingResponse> {
    // 1. Load package and assert published
    const { data: packageData, error: packageError } = await this.supabase
      .from('packages')
      .select('*')
      .eq('id', input.packageId)
      .eq('is_published', true)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with ID '${input.packageId}' not found or not published`);
    }

    // 2. Derive end date from duration if missing
    let endDate = input.endDate;
    if (!endDate) {
      const startDate = parseISO(input.startDate);
      endDate = addDays(startDate, packageData.duration_days).toISOString().split('T')[0];
    }

    // 3. Load selected options and calculate pricing
    let selectedOptions: OptionLine[] = [];
    if (input.selectedOptionIds && input.selectedOptionIds.length > 0) {
      const { data: optionsData, error: optionsError } = await this.supabase
        .from('package_item_options')
        .select('id, name, price')
        .in('id', input.selectedOptionIds);

      if (optionsError) {
        throw new Error(`Failed to load package options: ${optionsError.message}`);
      }

      selectedOptions = optionsData.map(option => ({
        id: option.id,
        name: option.name,
        price: option.price,
        qty: 1, // MVP: default quantity
      }));
    }

    // 4. Calculate total price
    const pricing = calcTotal({
      basePrice: packageData.base_price,
      discountPercent: packageData.discount_percent || 0,
      selectedOptions,
      travelers: input.travelers,
    });

    // 5. Generate transaction reference
    const txRef = `NT_${nanoid(16).toUpperCase()}`;

    // 6. Insert booking
    const { data: bookingData, error: bookingError } = await this.supabase
      .from('bookings')
      .insert({
        user_id: input.userId,
        package_id: input.packageId,
        start_date: input.startDate,
        end_date: endDate,
        traveler_count: input.travelers,
        total_price: pricing.total,
        status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      throw new Error(`Failed to create booking: ${bookingError.message}`);
    }

    // 7. Generate QR code
    const qrData = generateBookingQR(bookingData.id);
    const qrResult = await generateQR(qrData);

    // 8. Update booking with QR code
    await this.supabase
      .from('bookings')
      .update({ qr_code_url: qrResult.dataUrl })
      .eq('id', bookingData.id);

    // 9. Call RPC to freeze partner assignments (MVP: mock)
    // In production, this would call: freeze_assignments(bookingId, packageId, start, end)
    await this.freezePartnerAssignments(bookingData.id, input.packageId, input.startDate, endDate);

    return {
      bookingId: bookingData.id,
      tx_ref: txRef,
      total_usd: pricing.total,
      pricing_breakdown: {
        base: pricing.breakdown.base,
        options: pricing.breakdown.options,
        discount: pricing.breakdown.discount,
        taxes: pricing.breakdown.taxes,
        total: pricing.total,
        currency: 'USD',
      },
      qr_code_url: qrResult.dataUrl,
    };
  }

  async getBookingById(id: string): Promise<BookingResponse> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Booking with ID '${id}' not found`);
    }

    return data as BookingResponse;
  }

  async getUserBookings(query: BookingQuery): Promise<BookingListResponse> {
    let queryBuilder = this.supabase
      .from('bookings')
      .select('*')
      .eq('user_id', query.userId);

    // Apply filters
    if (query.status) {
      queryBuilder = queryBuilder.eq('status', query.status);
    }
    if (query.paymentStatus) {
      queryBuilder = queryBuilder.eq('payment_status', query.paymentStatus);
    }

    // Get total count
    const { count } = await this.supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', query.userId);

    // Apply pagination
    queryBuilder = queryBuilder
      .range(query.offset, query.offset + query.limit - 1)
      .order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch user bookings: ${error.message}`);
    }

    return {
      bookings: data as BookingResponse[],
      total: count || 0,
      limit: query.limit,
      offset: query.offset,
      hasMore: (query.offset + query.limit) < (count || 0),
    };
  }

  private async freezePartnerAssignments(
    bookingId: string,
    packageId: string,
    startDate: string,
    endDate: string
  ): Promise<void> {
    // MVP: Mock implementation
    // In production, this would call a Supabase RPC function:
    // await this.supabase.rpc('freeze_assignments', {
    //   booking_id: bookingId,
    //   package_id: packageId,
    //   start_date: startDate,
    //   end_date: endDate,
    // });

    console.log(`Mock: Freezing partner assignments for booking ${bookingId} from ${startDate} to ${endDate}`);
  }
}
