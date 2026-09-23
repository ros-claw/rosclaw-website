// Compose theme-safe README plaques. Source marks are copied pixel-for-pixel,
// never recolored, cropped, or overwritten.
import sharp from "sharp";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";

const output = process.argv[2];
if (!output) throw new Error("Usage: node scripts/build-institution-lockups.mjs OUTPUT_DIR");
await mkdir(output, { recursive: true });

const tongji = await readFile("public/同济大学logo.png");
const srias = await readFile("public/上海自主智能无人系统科学中心logo.png");
const marks = [
  { input: await sharp(tongji).resize(102, 102, { fit: "contain" }).png().toBuffer(), left: 48, top: 69 },
  { input: await sharp(srias).resize(92, 92, { fit: "contain" }).png().toBuffer(), left: 638, top: 74 },
];

for (const theme of ["light", "dark"]) {
  const dark = theme === "dark";
  const bg = dark ? "#0d131a" : "#f4f6f8";
  const text = dark ? "#eaf1f3" : "#1b2a36";
  const muted = dark ? "#9aabb4" : "#586978";
  const plaque = dark ? '<rect x="34" y="54" width="130" height="132" rx="4" fill="#fff"/><rect x="622" y="54" width="124" height="132" rx="4" fill="#fff"/>' : "";
  const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="240" viewBox="0 0 1200 240">
    <rect width="1200" height="240" fill="${bg}"/>
    <text x="36" y="35" fill="${muted}" font-family="sans-serif" font-size="14" font-weight="700" letter-spacing="3">RESEARCH &amp; DEVELOPMENT  /  研发单位</text>
    ${plaque}
    <text x="180" y="107" fill="${text}" font-family="sans-serif" font-size="26" font-weight="700">Tongji University</text>
    <text x="180" y="145" fill="${muted}" font-family="sans-serif" font-size="20">同济大学</text>
    <text x="770" y="103" fill="${text}" font-family="sans-serif" font-size="22" font-weight="700">Shanghai Research Institute for</text>
    <text x="770" y="133" fill="${text}" font-family="sans-serif" font-size="22" font-weight="700">Intelligent Autonomous Systems</text>
    <text x="770" y="165" fill="${muted}" font-family="sans-serif" font-size="18">SRIAS · 上海自主智能无人系统科学中心</text>
  </svg>`);
  await sharp(svg).composite(marks).png().toFile(path.join(output, `rd-lockup-${theme}.png`));
}
