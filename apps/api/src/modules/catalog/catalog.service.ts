import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../lib/supabase';
import {
  DestinationQuery,
  PackageQuery,
  DestinationResponse,
  PackageResponse,
  PackageListResponse,
  DestinationListResponse,
  PackageCompositionResponse,
} from './dto/catalog.dto';

@Injectable()
export class CatalogService {
  private readonly supabase;

  constructor(private readonly configService: ConfigService) {
    this.supabase = createSupabaseClient(configService);
  }

  async getDestinations(query: DestinationQuery): Promise<DestinationListResponse> {
    let queryBuilder = this.supabase
      .from('destinations')
      .select('*')
      .eq('is_published', true);

    // Apply filters
    if (query.q) {
      queryBuilder = queryBuilder.textSearch('name', query.q);
    }
    if (query.country) {
      queryBuilder = queryBuilder.ilike('location', `%${query.country}%`);
    }
    if (query.region) {
      queryBuilder = queryBuilder.ilike('location', `%${query.region}%`);
    }
    if (query.featured !== undefined) {
      queryBuilder = queryBuilder.eq('featured', query.featured);
    }

    // Get total count
    const { count } = await this.supabase
      .from('destinations')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    // Apply pagination
    queryBuilder = queryBuilder
      .range(query.offset, query.offset + query.limit - 1)
      .order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch destinations: ${error.message}`);
    }

    return {
      destinations: data as DestinationResponse[],
      total: count || 0,
      limit: query.limit,
      offset: query.offset,
      hasMore: (query.offset + query.limit) < (count || 0),
    };
  }

  async getDestinationBySlug(slug: string): Promise<DestinationResponse> {
    // For MVP, we'll use ID as slug since we don't have slug field
    const { data, error } = await this.supabase
      .from('destinations')
      .select('*')
      .eq('id', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Destination with slug '${slug}' not found`);
    }

    return data as DestinationResponse;
  }

  async getPackages(query: PackageQuery): Promise<PackageListResponse> {
    let queryBuilder = this.supabase
      .from('packages')
      .select('*')
      .eq('is_published', true);

    // Apply filters
    if (query.q) {
      queryBuilder = queryBuilder.textSearch('title', query.q);
    }
    if (query.destinationId) {
      queryBuilder = queryBuilder.eq('destination_id', query.destinationId);
    }
    if (query.category) {
      queryBuilder = queryBuilder.eq('category', query.category);
    }
    if (query.luxury !== undefined) {
      queryBuilder = queryBuilder.eq('luxury_certified', query.luxury);
    }
    if (query.minPrice) {
      queryBuilder = queryBuilder.gte('base_price', query.minPrice);
    }
    if (query.maxPrice) {
      queryBuilder = queryBuilder.lte('base_price', query.maxPrice);
    }
    if (query.durationMin) {
      queryBuilder = queryBuilder.gte('duration_days', query.durationMin);
    }
    if (query.durationMax) {
      queryBuilder = queryBuilder.lte('duration_days', query.durationMax);
    }
    if (query.featured !== undefined) {
      queryBuilder = queryBuilder.eq('featured', query.featured);
    }

    // Get total count
    const { count } = await this.supabase
      .from('packages')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    // Apply pagination
    queryBuilder = queryBuilder
      .range(query.offset, query.offset + query.limit - 1)
      .order('created_at', { ascending: false });

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Failed to fetch packages: ${error.message}`);
    }

    return {
      packages: data as PackageResponse[],
      total: count || 0,
      limit: query.limit,
      offset: query.offset,
      hasMore: (query.offset + query.limit) < (count || 0),
    };
  }

  async getPackageBySlug(slug: string): Promise<PackageResponse> {
    // For MVP, we'll use ID as slug since we don't have slug field
    const { data, error } = await this.supabase
      .from('packages')
      .select('*')
      .eq('id', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) {
      throw new NotFoundException(`Package with slug '${slug}' not found`);
    }

    return data as PackageResponse;
  }

  async getPackageComposition(packageId: string): Promise<PackageCompositionResponse> {
    // This would typically query a view or join multiple tables
    // For MVP, we'll return a simplified structure
    const { data: packageData, error: packageError } = await this.supabase
      .from('packages')
      .select('id, title')
      .eq('id', packageId)
      .eq('is_published', true)
      .single();

    if (packageError || !packageData) {
      throw new NotFoundException(`Package with ID '${packageId}' not found`);
    }

    // In a real implementation, this would query package_item_options and related tables
    // For MVP, returning mock data structure
    return {
      package_id: packageId,
      items: [
        {
          id: 'mock-item-1',
          name: 'Accommodation',
          description: 'Luxury hotel accommodation',
          category: 'accommodation',
          options: [
            {
              id: 'mock-option-1',
              name: 'Standard Room',
              description: 'Comfortable standard room',
              price: 150,
            },
            {
              id: 'mock-option-2',
              name: 'Suite',
              description: 'Luxury suite upgrade',
              price: 300,
            },
          ],
        },
      ],
    };
  }
}
