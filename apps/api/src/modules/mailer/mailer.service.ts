import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { generateQR } from '../../lib/qr';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export interface BookingConfirmationData {
  to: string;
  fullName?: string;
  bookingId: string;
  txRef: string;
  totalUSD: number;
  packageTitle: string;
  startDate: string;
  endDate: string;
  travelers: number;
}

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required for email service');
    }
    
    this.resend = new Resend(apiKey);
    this.fromEmail = 'noreply@naijatours.com'; // Default from email
  }

  async sendEmail(options: EmailOptions): Promise<{ id: string | undefined }> {
    try {
      const result = await this.resend.emails.send({
        from: options.from || this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      const messageId = (result as any)?.data?.id ?? (result as any)?.id;
      this.logger.log(`Email sent successfully to ${options.to}: ${messageId ?? 'no-id'}`);
      return { id: messageId };
    } catch (error) {
      this.logger.error(`Failed to send email to ${options.to}: ${error.message}`);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  async sendBookingConfirmation(data: BookingConfirmationData): Promise<{ id: string }> {
    try {
      // Generate QR code for the booking
      const qrData = `booking:${data.bookingId}`;
      const qrResult = await generateQR(qrData);

      // Create email HTML with embedded QR code
      const html = this.createBookingConfirmationHTML(data, qrResult.dataUrl);

      return this.sendEmail({
        to: data.to,
        subject: `Booking Confirmation - ${data.packageTitle}`,
        html,
      });
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation: ${error.message}`);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, fullName: string): Promise<{ id: string }> {
    const html = this.createWelcomeEmailHTML(fullName);

    return this.sendEmail({
      to: email,
      subject: 'Welcome to NaijaTours - Your Luxury Travel Journey Begins',
      html,
    });
  }

  async sendPasswordReset(email: string, resetToken: string): Promise<{ id: string }> {
    const resetUrl = `${this.configService.get('APP_BASE_URL')}/reset-password?token=${resetToken}`;
    const html = this.createPasswordResetHTML(resetUrl);

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request - NaijaTours',
      html,
    });
  }

  private createBookingConfirmationHTML(data: BookingConfirmationData, qrCodeUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 8px; }
          .qr-code { max-width: 200px; margin: 20px auto; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
          .detail-label { font-weight: bold; color: #666; }
          .detail-value { color: #333; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your luxury travel experience awaits</p>
          </div>
          
          <div class="content">
            <h2>Hello ${data.fullName || 'Valued Guest'},</h2>
            <p>Your booking has been confirmed! We're excited to welcome you to an unforgettable journey.</p>
            
            <div class="details">
              <h3>📋 Booking Details</h3>
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${data.bookingId}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Transaction Ref:</span>
                <span class="detail-value">${data.txRef}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Package:</span>
                <span class="detail-value">${data.packageTitle}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Travel Dates:</span>
                <span class="detail-value">${data.startDate} - ${data.endDate}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Travelers:</span>
                <span class="detail-value">${data.travelers}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Total Amount:</span>
                <span class="detail-value">$${data.totalUSD.toFixed(2)} USD</span>
              </div>
            </div>
            
            <div class="qr-section">
              <h3>📱 Your Digital Pass</h3>
              <p>Present this QR code at check-in for a seamless experience</p>
              <div class="qr-code">
                <img src="${qrCodeUrl}" alt="Booking QR Code" style="max-width: 100%; height: auto;">
              </div>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Save this email and QR code</li>
              <li>Check your travel documents</li>
              <li>Contact us if you have any questions</li>
            </ul>
            
            <p>Thank you for choosing NaijaTours for your luxury travel experience!</p>
          </div>
          
          <div class="footer">
            <p>© 2024 NaijaTours. All rights reserved.</p>
            <p>For support, contact us at support@naijatours.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private createWelcomeEmailHTML(fullName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NaijaTours</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 Welcome to NaijaTours!</h1>
            <p>Your journey to luxury travel begins here</p>
          </div>
          
          <div class="content">
            <h2>Hello ${fullName},</h2>
            <p>Welcome to NaijaTours, where luxury meets adventure! We're thrilled to have you join our community of discerning travelers.</p>
            
            <p><strong>What's next?</strong></p>
            <ul>
              <li>Explore our curated destinations</li>
              <li>Discover luxury travel packages</li>
              <li>Book your next adventure</li>
              <li>Connect with our travel experts</li>
            </ul>
            
            <p>Ready to start planning? Visit our platform and let us craft the perfect luxury travel experience for you.</p>
            
            <p>Happy travels!<br>The NaijaTours Team</p>
          </div>
          
          <div class="footer">
            <p>© 2024 NaijaTours. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private createPasswordResetHTML(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 30px; text-align: center; border-radius: 10px; }
          .content { padding: 30px; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
          </div>
          
          <div class="content">
            <h2>Hello,</h2>
            <p>We received a request to reset your password for your NaijaTours account.</p>
            
            <p>Click the button below to reset your password:</p>
            
            <a href="${resetUrl}" class="button">Reset Password</a>
            
            <p>If you didn't request this password reset, please ignore this email.</p>
            
            <p>This link will expire in 1 hour for security reasons.</p>
          </div>
          
          <div class="footer">
            <p>© 2024 NaijaTours. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
