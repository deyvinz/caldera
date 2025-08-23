import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  CreateBookingResponseDto,
  BookingResponseDto,
  BookingListResponseDto,
  BookingQueryDto,
} from './dto/bookings.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiBody({ 
    description: 'Booking details',
    schema: { $ref: '#/components/schemas/CreateBookingDto' }
  })
  @ApiResponse({
    status: 201,
    description: 'Booking created successfully',
    schema: { $ref: '#/components/schemas/CreateBookingResponseDto' },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Package not found' })
  @ApiResponse({ status: 409, description: 'Package not available for selected dates' })
  async createBooking(@Body() createBookingDto: any) {
    const validatedData = CreateBookingDto.parse(createBookingDto);
    return this.bookingsService.createBooking(validatedData);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', description: 'Booking ID' })
  @ApiResponse({
    status: 200,
    description: 'Booking details',
    schema: { $ref: '#/components/schemas/BookingResponseDto' },
  })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBooking(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.getBookingById(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user bookings with filtering and pagination' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by booking status' })
  @ApiQuery({ name: 'paymentStatus', required: false, description: 'Filter by payment status' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset' })
  @ApiResponse({
    status: 200,
    description: 'List of user bookings',
    schema: { $ref: '#/components/schemas/BookingListResponseDto' },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async getUserBookings(@Query() query: any) {
    const validatedQuery = BookingQueryDto.parse(query);
    return this.bookingsService.getUserBookings(validatedQuery);
  }
}
