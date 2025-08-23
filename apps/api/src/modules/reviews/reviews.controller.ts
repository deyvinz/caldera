import {
  Controller,
  Post,
  Get,
  Query,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import {
  CreateReviewDto,
  CreateReviewInput,
  ReviewResponseDto,
  ReviewListResponseDto,
  ReviewQueryDto,
} from './dto/reviews.dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({ 
    description: 'Review details',
    schema: { $ref: '#/components/schemas/CreateReviewDto' }
  })
  @ApiResponse({
    status: 201,
    description: 'Review created successfully',
    schema: { $ref: '#/components/schemas/ReviewResponseDto' },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data or cannot review this booking' })
  @ApiResponse({ status: 404, description: 'Booking or package not found' })
  async createReview(@Body() createReviewDto: any) {
    const validatedData = CreateReviewDto.parse(createReviewDto);
    return this.reviewsService.createReview(validatedData);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get reviews for a package with pagination' })
  @ApiQuery({ name: 'packageId', required: true, description: 'Package ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (max 100)' })
  @ApiQuery({ name: 'offset', required: false, description: 'Pagination offset' })
  @ApiResponse({
    status: 200,
    description: 'List of package reviews',
    schema: { $ref: '#/components/schemas/ReviewListResponseDto' },
  })
  @ApiResponse({ status: 400, description: 'Invalid query parameters' })
  async getPackageReviews(@Query() query: any) {
    const validatedQuery = ReviewQueryDto.parse(query);
    return this.reviewsService.getPackageReviews(validatedQuery);
  }
}
