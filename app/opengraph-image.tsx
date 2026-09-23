import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt = "ROSClaw — Give AI a Body. Let Experience Drive Evolution.";
export const size = { width: 1280, height: 640 };
export const contentType = "image/png";

export default async function Image() {
  const [tongji, srias] = await Promise.all([
    readFile(path.join(process.cwd(), "public", "同济大学logo.png")),
    readFile(path.join(process.cwd(), "public", "上海自主智能无人系统科学中心logo.png")),
  ]);
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 72px", background: "radial-gradient(circle at 75% 25%, #12323b 0%, #070a0e 55%)", color: "#f4f7f7", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 42, fontWeight: 700, letterSpacing: -2 }}>ROSClaw</span>
        <span style={{ fontSize: 16, color: "#00f0ff", letterSpacing: 3 }}>PHYSICAL AI RUNTIME</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.03, letterSpacing: -4 }}>Give AI a Body.</div>
        <div style={{ fontSize: 60, fontWeight: 600, lineHeight: 1.05, letterSpacing: -3, color: "#c8d9e1" }}>Let Experience Drive Evolution.</div>
        <div style={{ marginTop: 20, fontSize: 23, color: "#a6e476" }}>Act → Verify → Remember → Evolve</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 18, color: "#a5b8c1" }}>
          <span>The Physical AI Runtime for Embodied Agents.</span>
          <span>Any Agent. Any Body. One Runtime.</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 14px", background: "#f4f6f8", color: "#293846" }}>
          <span style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 700 }}><span>RESEARCH &</span><span>DEVELOPMENT</span></span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/png;base64,${tongji.toString("base64")}`} alt="" width={46} height={46} />
          {/* Source file has a JPEG payload despite its PNG filename. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`data:image/jpeg;base64,${srias.toString("base64")}`} alt="" width={43} height={43} />
        </div>
      </div>
    </div>,
    size,
  );
}
