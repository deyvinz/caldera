"use client";
import { QRCode } from "react-qrcode-logo";

export function QRPass({ value }: { value: string }) {
  return (
    <div className="flex items-center justify-center p-6 bg-white rounded-2xl lux-gold-border">
      <QRCode value={value} size={200} ecLevel="M" logoWidth={40} logoHeight={40} />
    </div>
  );
}


