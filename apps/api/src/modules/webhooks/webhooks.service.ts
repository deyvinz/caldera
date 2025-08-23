import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../../lib/supabase';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly stripe: Stripe;
  private readonly supabase;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY')!, {
      apiVersion: '2023-10-16',
    });
    this.supabase = createSupabaseClient(configService);
  }

  async handleStripeWebhook(signature: string, rawBody: Buffer): Promise<{ received: boolean }> {
    try {
      // Verify webhook signature
      const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
      if (!webhookSecret) {
        throw new Error('Stripe webhook secret not configured');
      }

      let event: Stripe.Event;
      try {
        event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err) {
        this.logger.error(`Webhook signature verification failed: ${err.message}`);
        throw new BadRequestException('Invalid webhook signature');
      }

      // Handle the event
      await this.processStripeEvent(event);

      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error.message}`);
      throw error;
    }
  }

  private async processStripeEvent(event: Stripe.Event): Promise<void> {
    this.logger.log(`Processing Stripe event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.succeeded':
        await this.handleChargeSuccess(event.data.object as Stripe.Charge);
        break;
      case 'charge.failed':
        await this.handleChargeFailure(event.data.object as Stripe.Charge);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const metadata = paymentIntent.metadata;
      const txRef = metadata.tx_ref || metadata.transaction_reference;
      
      if (!txRef) {
        this.logger.warn('Payment success but no transaction reference found');
        return;
      }

      // Update booking payment status
      await this.updateBookingPaymentStatus(txRef, 'paid');

      this.logger.log(`Payment succeeded for transaction: ${txRef}`);
    } catch (error) {
      this.logger.error(`Failed to handle payment success: ${error.message}`);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const metadata = paymentIntent.metadata;
      const txRef = metadata.tx_ref || metadata.transaction_reference;
      
      if (!txRef) {
        this.logger.warn('Payment failure but no transaction reference found');
        return;
      }

      // Update booking payment status
      await this.updateBookingPaymentStatus(txRef, 'failed');

      this.logger.log(`Payment failed for transaction: ${txRef}`);
    } catch (error) {
      this.logger.error(`Failed to handle payment failure: ${error.message}`);
    }
  }

  private async handleChargeSuccess(charge: Stripe.Charge): Promise<void> {
    try {
      const metadata = charge.metadata;
      const txRef = metadata.tx_ref || metadata.transaction_reference;
      
      if (!txRef) {
        this.logger.warn('Charge success but no transaction reference found');
        return;
      }

      // Update booking payment status
      await this.updateBookingPaymentStatus(txRef, 'paid');

      this.logger.log(`Charge succeeded for transaction: ${txRef}`);
    } catch (error) {
      this.logger.error(`Failed to handle charge success: ${error.message}`);
    }
  }

  private async handleChargeFailure(charge: Stripe.Charge): Promise<void> {
    try {
      const metadata = charge.metadata;
      const txRef = metadata.tx_ref || metadata.transaction_reference;
      
      if (!txRef) {
        this.logger.warn('Charge failure but no transaction reference found');
        return;
      }

      // Update booking payment status
      await this.updateBookingPaymentStatus(txRef, 'failed');

      this.logger.log(`Charge failed for transaction: ${txRef}`);
    } catch (error) {
      this.logger.error(`Failed to handle charge failure: ${error.message}`);
    }
  }

  private async updateBookingPaymentStatus(txRef: string, status: 'paid' | 'failed'): Promise<void> {
    try {
      // In a real implementation, you would have a mapping table between tx_ref and booking_id
      // For MVP, we'll assume the tx_ref contains the booking ID or we can search for it
      
      // This is a simplified approach - in production you'd have a proper relationship
      const { data, error } = await this.supabase
        .from('bookings')
        .update({ 
          payment_status: status,
          status: status === 'paid' ? 'confirmed' : 'pending'
        })
        .eq('id', txRef) // Assuming tx_ref maps to booking ID for MVP
        .select();

      if (error) {
        this.logger.error(`Failed to update booking payment status: ${error.message}`);
        return;
      }

      if (data && data.length > 0) {
        this.logger.log(`Updated booking ${txRef} payment status to ${status}`);
        
        // If payment succeeded, trigger email confirmation
        if (status === 'paid') {
          await this.triggerEmailConfirmation(txRef);
        }
      } else {
        this.logger.warn(`No booking found for transaction reference: ${txRef}`);
      }
    } catch (error) {
      this.logger.error(`Failed to update booking payment status: ${error.message}`);
    }
  }

  private async triggerEmailConfirmation(bookingId: string): Promise<void> {
    try {
      // In production, this would trigger an email service or queue a job
      // For MVP, we'll just log it
      this.logger.log(`Email confirmation triggered for booking: ${bookingId}`);
      
      // You could inject the MailerService here and send the confirmation
      // await this.mailerService.sendBookingConfirmation(bookingId);
    } catch (error) {
      this.logger.error(`Failed to trigger email confirmation: ${error.message}`);
    }
  }
}
