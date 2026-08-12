import { CARD } from "./constants";
import type { BuilderCategory, BuilderProfile } from "@/types/builder";

const accents: Record<BuilderCategory, { pink: string; yellow: string }> = {
  mobile: { pink: "#F4007A", yellow: "#FFE000" }, systems: { pink: "#FF4D9D", yellow: "#FFE000" },
  pixel: { pink: "#F4007A", yellow: "#FFD400" }, model: { pink: "#FF2E8A", yellow: "#FFF000" },
  data: { pink: "#F4007A", yellow: "#FFE000" }, security: { pink: "#FF5A9F", yellow: "#FFE000" },
  infra: { pink: "#F4007A", yellow: "#FFE000" }, fullstack: { pink: "#F4007A", yellow: "#FFE000" },
  chain: { pink: "#FF3C92", yellow: "#FFE000" }, game: { pink: "#F4007A", yellow: "#FFE000" },
  general: { pink: "#F4007A", yellow: "#FFE000" },
};

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (c) => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&apos;", "\"":"&quot;" }[c]!));
}

export function buildCardSvg(profile: BuilderProfile) {
  const { pink, yellow } = accents[profile.category];
  const image = profile.imageDataUrl;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD.width}" height="${CARD.height}" viewBox="0 0 ${CARD.width} ${CARD.height}">
  <defs>
    <clipPath id="photo"><rect x="76" y="245" width="928" height="560" rx="28"/></clipPath>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="3" fill="${yellow}"/></pattern>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .06"/></feComponentTransfer></filter>
  </defs>
  <rect width="1080" height="1350" fill="#FFF9E8"/>
  <rect x="0" y="0" width="1080" height="190" fill="#086B3A"/>
  <rect x="0" y="0" width="1080" height="1350" filter="url(#grain)" opacity=".35"/>
  <circle cx="980" cy="75" r="150" fill="${pink}"/>
  <circle cx="980" cy="75" r="92" fill="#FFE000"/>
  <text x="72" y="82" fill="#FFF9E8" font-family="Georgia,serif" font-weight="900" font-size="48">HACKER HOUSE</text>
  <text x="72" y="140" fill="#FFF9E8" font-family="Arial,sans-serif" font-weight="900" font-size="52" letter-spacing="8">GOA 2026</text>
  <text x="930" y="105" text-anchor="middle" fill="#111" font-family="Arial,sans-serif" font-weight="900" font-size="26" transform="rotate(10 930 105)">BUILDER</text>
  <rect x="76" y="245" width="928" height="560" rx="28" fill="#086B3A"/>
  <image href="${image}" x="76" y="245" width="928" height="560" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo)"/>
  <rect x="76" y="245" width="928" height="560" rx="28" fill="none" stroke="#111" stroke-width="8"/>
  <rect x="76" y="748" width="928" height="57" fill="#086B3A" opacity=".92"/>
  <text x="108" y="786" fill="#FFF9E8" font-family="Arial,sans-serif" font-size="24" font-weight="800" letter-spacing="4">FRAME / GOA</text>
  <rect x="72" y="846" width="936" height="5" fill="#111"/>
  <text x="72" y="925" fill="#111" font-family="Georgia,serif" font-size="76" font-weight="900">${escapeXml(profile.name.toUpperCase())}</text>
  <text x="76" y="976" fill="#086B3A" font-family="Arial,sans-serif" font-size="30" font-weight="800" letter-spacing="5">${escapeXml(profile.stack.toUpperCase())}</text>
  <rect x="72" y="1022" width="936" height="138" rx="18" fill="#086B3A"/>
  <text x="102" y="1080" fill="${yellow}" font-family="Georgia,serif" font-size="26" font-weight="900" letter-spacing="3">WHAT KIND OF BUILDER?</text>
  <text x="102" y="1132" fill="#FFF9E8" font-family="Georgia,serif" font-size="47" font-weight="900">${escapeXml(profile.title)}</text>
  <circle cx="945" cy="1090" r="50" fill="${pink}"/>
  <circle cx="945" cy="1090" r="28" fill="${yellow}"/>
  <rect x="72" y="1192" width="936" height="86" fill="#111"/>
  <text x="96" y="1228" fill="#FFF9E8" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="3">BUILDER ID</text>
  <text x="96" y="1258" fill="#FFE000" font-family="monospace" font-size="25" font-weight="900">${escapeXml(profile.builderId)}</text>
  <text x="1008" y="1232" text-anchor="end" fill="#FFF9E8" font-family="Arial,sans-serif" font-size="18" font-weight="700">GOA · INDIA</text>
  <text x="1008" y="1258" text-anchor="end" fill="#FFF9E8" font-family="Arial,sans-serif" font-size="18" font-weight="700">28—31 OCT 2026</text>
  <rect x="72" y="1302" width="936" height="16" fill="url(#dots)"/>
</svg>`;
}

export async function svgToPng(svg: string) {
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = CARD.width; canvas.height = CARD.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is unavailable in this browser.");
    ctx.drawImage(image, 0, 0, CARD.width, CARD.height);
    return canvas.toDataURL("image/png", 1);
  } finally { URL.revokeObjectURL(url); }
}
