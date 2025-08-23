import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Header,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import {
  DestinationQueryDto,
  PackageQueryDto,
  DestinationListResponse,
  DestinationResponse,
  PackageListResponse,
  PackageResponse,
  PackageCompositionResponse,
} from './dto/catalog.dto';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('destinations')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 's-maxage=60')
  @ApiOperation({ summary: 'Get destinations with filtering and pagination' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'country',
    required: false,
    description: 'Filter by country',
  })
  @ApiQuery({
    name: 'region',
    required: false,
    description: 'Filter by region',
  })
  @ApiQuery({
    name: 'featured',
    required: false,
    description: 'Filter featured destinations',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (max 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset',
  })
  @ApiResponse({
    status: 200,
    description: 'List of destinations',
    schema: { $ref: '#/components/schemas/DestinationListResponse' },
  })
  async getDestinations(@Query() query: any): Promise<DestinationListResponse> {
    const validatedQuery = DestinationQueryDto.parse(query);
    return this.catalogService.getDestinations(validatedQuery);
  }

  @Get('destinations/:slug')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 's-maxage=300')
  @ApiOperation({ summary: 'Get destination by slug' })
  @ApiParam({ name: 'slug', description: 'Destination slug' })
  @ApiResponse({
    status: 200,
    description: 'Destination details',
    schema: { $ref: '#/components/schemas/DestinationResponse' },
  })
  @ApiResponse({ status: 404, description: 'Destination not found' })
  async getDestination(
    @Param('slug') slug: string,
  ): Promise<DestinationResponse> {
    return this.catalogService.getDestinationBySlug(slug);
  }

  @Get('packages')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 's-maxage=60')
  @ApiOperation({ summary: 'Get packages with filtering and pagination' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({
    name: 'destinationId',
    required: false,
    description: 'Filter by destination',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'luxury',
    required: false,
    description: 'Filter luxury packages',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    description: 'Minimum price filter',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    description: 'Maximum price filter',
  })
  @ApiQuery({
    name: 'durationMin',
    required: false,
    description: 'Minimum duration filter',
  })
  @ApiQuery({
    name: 'durationMax',
    required: false,
    description: 'Maximum duration filter',
  })
  @ApiQuery({
    name: 'featured',
    required: false,
    description: 'Filter featured packages',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page (max 100)',
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Pagination offset',
  })
  @ApiResponse({
    status: 200,
    description: 'List of packages',
    schema: { $ref: '#/components/schemas/PackageListResponse' },
  })
  async getPackages(@Query() query: any): Promise<PackageListResponse> {
    const validatedQuery = PackageQueryDto.parse(query);
    return this.catalogService.getPackages(validatedQuery);
  }

  @Get('packages/:slug')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 's-maxage=300')
  @ApiOperation({ summary: 'Get package by slug' })
  @ApiParam({ name: 'slug', description: 'Package slug' })
  @ApiResponse({
    status: 200,
    description: 'Package details',
    schema: { $ref: '#/components/schemas/PackageResponse' },
  })
  @ApiResponse({ status: 404, description: 'Package not found' })
  async getPackage(@Param('slug') slug: string): Promise<PackageResponse> {
    return this.catalogService.getPackageBySlug(slug);
  }

  @Get('packages/:id/composition')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 's-maxage=600')
  @ApiOperation({ summary: 'Get package composition with options' })
  @ApiParam({ name: 'id', description: 'Package ID' })
  @ApiResponse({
    status: 200,
    description: 'Package composition',
    schema: { $ref: '#/components/schemas/PackageCompositionResponse' },
  })
  @ApiResponse({ status: 404, description: 'Package not found' })
  async getPackageComposition(
    @Param('id') id: string,
  ): Promise<PackageCompositionResponse> {
    return this.catalogService.getPackageComposition(id);
  }
}
