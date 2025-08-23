import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { MailerService, BookingConfirmationData } from './mailer.service';

@ApiTags('mailer')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send-booking-confirmation')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send booking confirmation email with QR code' })
  @ApiBody({ 
    description: 'Booking confirmation data',
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', format: 'email' },
        fullName: { type: 'string' },
        bookingId: { type: 'string', format: 'uuid' },
        txRef: { type: 'string' },
        totalUSD: { type: 'number' },
        packageTitle: { type: 'string' },
        startDate: { type: 'string', format: 'date' },
        endDate: { type: 'string', format: 'date' },
        travelers: { type: 'number', minimum: 1 },
      },
      required: ['to', 'bookingId', 'txRef', 'totalUSD', 'packageTitle', 'startDate', 'endDate', 'travelers']
    }
  })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 500, description: 'Email sending failed' })
  async sendBookingConfirmation(@Body() data: BookingConfirmationData) {
    return this.mailerService.sendBookingConfirmation(data);
  }

  @Post('send-welcome')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send welcome email to new users' })
  @ApiBody({ 
    description: 'Welcome email data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        fullName: { type: 'string' },
      },
      required: ['email', 'fullName']
    }
  })
  @ApiResponse({ status: 200, description: 'Welcome email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async sendWelcomeEmail(@Body() data: { email: string; fullName: string }) {
    return this.mailerService.sendWelcomeEmail(data.email, data.fullName);
  }

  @Post('send-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send password reset email' })
  @ApiBody({ 
    description: 'Password reset data',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        resetToken: { type: 'string' },
      },
      required: ['email', 'resetToken']
    }
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async sendPasswordReset(@Body() data: { email: string; resetToken: string }) {
    return this.mailerService.sendPasswordReset(data.email, data.resetToken);
  }
}
