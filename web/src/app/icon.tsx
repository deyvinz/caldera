import { ImageResponse } from "next/og";

export const contentType = "image/png";
export const sizes = [192, 512];

export default function Icon({
  id,
  size = 192,
}: {
  id?: string;
  size?: number;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#054A29",
          color: "#D4AF37",
          fontSize: Math.floor(size * 0.4),
          fontWeight: 800,
        }}
      >
        C
      </div>
    ),
    {
      width: size,
      height: size,
    }
  );
}

export function generateImageMetadata() {
  return sizes.map((s) => ({
    id: `icon-${s}`,
    size: { width: s, height: s },
    contentType,
  }));
}


