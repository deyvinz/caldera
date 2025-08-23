import QRCode from 'qrcode';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRCodeResult {
  dataUrl: string;
  size: number;
}

export async function generateQR(
  data: string,
  options: QRCodeOptions = {}
): Promise<QRCodeResult> {
  const {
    width = 256,
    margin = 1,
    color = { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel = 'M'
  } = options;

  try {
    const dataUrl = await QRCode.toDataURL(data, {
      width,
      margin,
      color,
      errorCorrectionLevel,
    });

    return {
      dataUrl,
      size: width,
    };
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export function generateBookingQR(bookingId: string): string {
  return `booking:${bookingId}`;
}

export function generatePaymentQR(txRef: string): string {
  return `payment:${txRef}`;
}

export function generateUserQR(userId: string): string {
  return `user:${userId}`;
}

export async function generateQRBuffer(
  data: string,
  options: QRCodeOptions = {}
): Promise<Buffer> {
  const {
    width = 256,
    margin = 1,
    color = { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel = 'M'
  } = options;

  try {
    return await QRCode.toBuffer(data, {
      width,
      margin,
      color,
      errorCorrectionLevel,
    });
  } catch (error) {
    throw new Error(`Failed to generate QR buffer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
