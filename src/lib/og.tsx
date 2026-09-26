import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared dynamic OG card (edge-safe, no fonts fetched). */
export function ogCard({ eyebrow, title, subtitle, image }: { eyebrow: string; title: string; subtitle?: string; image?: string | null }) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#121212", color: "#F7F4EF" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64, width: image ? 640 : 1200 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <span style={{ fontSize: 40, letterSpacing: 14, fontFamily: "serif" }}>ZOD&apos;S</span>
            <span style={{ fontSize: 22, letterSpacing: 10, color: "#C9A227" }}>BD</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 20, letterSpacing: 6, color: "#C9A227", textTransform: "uppercase" }}>{eyebrow}</span>
            <span style={{ fontSize: 60, lineHeight: 1.1, marginTop: 16, fontFamily: "serif" }}>{title}</span>
            {subtitle && <span style={{ fontSize: 28, marginTop: 20, color: "#d8d2c8" }}>{subtitle}</span>}
          </div>
          <div style={{ width: 80, height: 2, background: "#C9A227" }} />
        </div>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" width={560} height={630} style={{ objectFit: "cover", width: 560, height: 630 }} />
        )}
      </div>
    ),
    OG_SIZE
  );
}
