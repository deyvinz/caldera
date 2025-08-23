import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export function createSupabaseClient(configService: ConfigService) {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');
  const supabaseKey = configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseSchema = 'public';
  //configService.get<string>('SUPABASE_DB_SCHEMA') || 'public';

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: supabaseSchema,
    },
  });
}

// Database table types based on ERD
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_id: string;
          name: string;
          email: string;
          phone: string | null;
          profile_image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          auth_id: string;
          name: string;
          email: string;
          phone?: string | null;
          profile_image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          auth_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          profile_image?: string | null;
          created_at?: string;
        };
      };
      destinations: {
        Row: {
          id: string;
          name: string;
          description: string;
          location: string;
          image_gallery: any;
          rating: number | null;
          review_count: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          location: string;
          image_gallery?: any;
          rating?: number | null;
          review_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          location?: string;
          image_gallery?: any;
          rating?: number | null;
          review_count?: number | null;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          destination_id: string;
          title: string;
          description: string;
          category: string;
          duration_days: number;
          group_size_limit: number;
          inclusions: any;
          exclusions: any;
          itinerary: any;
          base_price: number;
          discount_percent: number | null;
          featured: boolean;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          destination_id: string;
          title: string;
          description: string;
          category: string;
          duration_days: number;
          group_size_limit: number;
          inclusions?: any;
          exclusions?: any;
          itinerary?: any;
          base_price: number;
          discount_percent?: number | null;
          featured?: boolean;
          is_published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          destination_id?: string;
          title?: string;
          description?: string;
          category?: string;
          duration_days?: number;
          group_size_limit?: number;
          inclusions?: any;
          exclusions?: any;
          itinerary?: any;
          base_price?: number;
          discount_percent?: number | null;
          featured?: boolean;
          is_published?: boolean;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          package_id: string;
          start_date: string;
          end_date: string;
          traveler_count: number;
          total_price: number;
          status: string;
          payment_status: string;
          qr_code_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          package_id: string;
          start_date: string;
          end_date: string;
          traveler_count: number;
          total_price: number;
          status?: string;
          payment_status?: string;
          qr_code_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          package_id?: string;
          start_date?: string;
          end_date?: string;
          traveler_count?: number;
          total_price?: number;
          status?: string;
          payment_status?: string;
          qr_code_url?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
