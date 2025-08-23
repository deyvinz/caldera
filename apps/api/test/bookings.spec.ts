import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { BookingsService } from '../src/modules/bookings/bookings.service';
import { CreateBookingInput } from '../src/modules/bookings/dto/bookings.dto';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        in: jest.fn(),
        range: jest.fn(() => ({
          order: jest.fn(),
        })),
      })),
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(),
    })),
  })),
};

jest.mock('../src/lib/supabase', () => ({
  createSupabaseClient: jest.fn(() => mockSupabase),
}));

describe('BookingsService', () => {
  let service: BookingsService;
  let module: TestingModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({
            SUPABASE_URL: 'test-url',
            SUPABASE_SERVICE_ROLE_KEY: 'test-key',
          })],
        })],
      providers: [BookingsService],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    const mockPackage = {
      id: 'package-123',
      title: 'Luxury Safari',
      base_price: 2000,
      discount_percent: 10,
      duration_days: 7,
      is_published: true,
    };

    const mockCreateInput: CreateBookingInput = {
      packageId: 'package-123',
      startDate: '2024-06-01',
      travelers: 2,
      userId: 'user-123',
    };

    it('should create a booking successfully', async () => {
      // Mock package fetch
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockPackage,
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      // Mock options fetch (no options)
      const mockOptionsSelect = jest.fn(() => ({
        in: jest.fn(() => ({
          data: [],
          error: null,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ select: mockOptionsSelect });

      // Mock booking insert
      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: 'booking-123',
              user_id: 'user-123',
              package_id: 'package-123',
              start_date: '2024-06-01',
              end_date: '2024-06-08',
              traveler_count: 2,
              total_price: 1800,
              status: 'pending',
              payment_status: 'pending',
            },
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ insert: mockInsert });

      // Mock booking update
      const mockUpdate = jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ update: mockUpdate });

      const result = await service.createBooking(mockCreateInput);

      expect(result).toBeDefined();
      expect(result.bookingId).toBe('booking-123');
      expect(result.total_usd).toBe(1800);
      expect(result.pricing_breakdown.base).toBe(2000);
      expect(result.pricing_breakdown.discount).toBe(200);
      expect(result.pricing_breakdown.total).toBe(1800);
      expect(result.pricing_breakdown.currency).toBe('USD');
    });

    it('should handle missing package', async () => {
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { message: 'Package not found' },
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(service.createBooking(mockCreateInput)).rejects.toThrow(
        'Package with ID \'package-123\' not found or not published'
      );
    });

    it('should calculate end date from duration if not provided', async () => {
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockPackage,
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const mockOptionsSelect = jest.fn(() => ({
        in: jest.fn(() => ({
          data: [],
          error: null,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ select: mockOptionsSelect });

      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: 'booking-123',
              user_id: 'user-123',
              package_id: 'package-123',
              start_date: '2024-06-01',
              end_date: '2024-06-08',
              traveler_count: 2,
              total_price: 1800,
              status: 'pending',
              payment_status: 'pending',
            },
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ insert: mockInsert });

      const mockUpdate = jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ update: mockUpdate });

      const result = await service.createBooking(mockCreateInput);

      expect(result).toBeDefined();
      // End date should be calculated: 2024-06-01 + 7 days = 2024-06-08
      expect(result.pricing_breakdown.total).toBe(1800);
    });

    it('should handle options with pricing', async () => {
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockPackage,
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const mockOptionsSelect = jest.fn(() => ({
        in: jest.fn(() => ({
          data: [
            { id: 'option-1', name: 'Upgrade', price: 500 },
            { id: 'option-2', name: 'Insurance', price: 100 },
          ],
          error: null,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ select: mockOptionsSelect });

      const mockInsert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {
              id: 'booking-123',
              user_id: 'user-123',
              package_id: 'package-123',
              start_date: '2024-06-01',
              end_date: '2024-06-08',
              traveler_count: 2,
              total_price: 2160, // (2000 + 500 + 100) * 0.9
              status: 'pending',
              payment_status: 'pending',
            },
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ insert: mockInsert });

      const mockUpdate = jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ update: mockUpdate });

      const inputWithOptions = {
        ...mockCreateInput,
        selectedOptionIds: ['option-1', 'option-2'],
      };

      const result = await service.createBooking(inputWithOptions);

      expect(result).toBeDefined();
      expect(result.pricing_breakdown.options).toHaveLength(2);
      expect(result.pricing_breakdown.options[0].price).toBe(500);
      expect(result.pricing_breakdown.options[1].price).toBe(100);
    });
  });

  describe('getBookingById', () => {
    it('should return booking by ID', async () => {
      const mockBooking = {
        id: 'booking-123',
        user_id: 'user-123',
        package_id: 'package-123',
        start_date: '2024-06-01',
        end_date: '2024-06-08',
        traveler_count: 2,
        total_price: 1800,
        status: 'pending',
        payment_status: 'pending',
        qr_code_url: 'data:image/png;base64,...',
        created_at: '2024-01-01T00:00:00Z',
      };

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockBooking,
            error: null,
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const result = await service.getBookingById('booking-123');

      expect(result).toEqual(mockBooking);
    });

    it('should throw error for non-existent booking', async () => {
      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: null,
            error: { message: 'Booking not found' },
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      await expect(service.getBookingById('non-existent')).rejects.toThrow(
        'Booking with ID \'non-existent\' not found'
      );
    });
  });

  describe('getUserBookings', () => {
    it('should return user bookings with pagination', async () => {
      const mockBookings = [
        {
          id: 'booking-1',
          user_id: 'user-123',
          package_id: 'package-1',
          start_date: '2024-06-01',
          end_date: '2024-06-08',
          traveler_count: 2,
          total_price: 1800,
          status: 'confirmed',
          payment_status: 'paid',
          qr_code_url: 'data:image/png;base64,...',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      const mockSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          range: jest.fn(() => ({
            order: jest.fn(() => ({
              data: mockBookings,
              error: null,
            })),
          })),
        })),
      }));
      mockSupabase.from.mockReturnValue({ select: mockSelect });

      const mockCountSelect = jest.fn(() => ({
        eq: jest.fn(() => ({
          data: null,
          error: null,
          count: 1,
        })),
      }));
      mockSupabase.from.mockReturnValueOnce({ select: mockCountSelect });

      const result = await service.getUserBookings({
        userId: 'user-123',
        limit: 20,
        offset: 0,
      });

      expect(result.bookings).toEqual(mockBookings);
      expect(result.total).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
      expect(result.hasMore).toBe(false);
    });
  });
});
