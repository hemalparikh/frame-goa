import type { BuilderProfile } from "@/types/builder";
import { CARD } from "./constants";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, maxLength: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxLength) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);

  return lines.length ? lines : [""];
}

function getPhotoTransform(profile: BuilderProfile) {
  const adjustment = profile.adjustment ?? {
    x: 0,
    y: 0,
    scale: 1,
  };

  const sourceWidth = 928;
  const sourceHeight = 560;

  const imageRatio = getImageDimensions(profile);

  let baseWidth = sourceWidth;
  let baseHeight = sourceHeight;

  if (imageRatio > sourceWidth / sourceHeight) {
    baseHeight = sourceHeight;
    baseWidth = sourceHeight * imageRatio;
  } else {
    baseWidth = sourceWidth;
    baseHeight = sourceWidth / imageRatio;
  }

  const width = baseWidth * adjustment.scale;
  const height = baseHeight * adjustment.scale;

  const extraX = Math.max(0, width - sourceWidth);
  const extraY = Math.max(0, height - sourceHeight);

  const left =
    -extraX / 2 +
    (extraX / 2) * (adjustment.x / 100);

  const top =
    -extraY / 2 +
    (extraY / 2) * (adjustment.y / 100);

  return {
    width,
    height,
    left,
    top,
  };
}

function getImageDimensions(profile: BuilderProfile) {
  if (
    profile.imageWidth &&
    profile.imageHeight &&
    profile.imageWidth > 0 &&
    profile.imageHeight > 0
  ) {
    return profile.imageWidth / profile.imageHeight;
  }

  return 4 / 3;
}

function getCategoryAccent(category: BuilderProfile["category"]) {
  switch (category) {
    case "mobile":
      return "#FFE000";

    case "systems":
      return "#F4007A";

    case "pixel":
      return "#FFE000";

    case "model":
      return "#F4007A";

    case "data":
      return "#FFE000";

    case "security":
      return "#F4007A";

    case "infra":
      return "#FFE000";

    case "fullstack":
      return "#F4007A";

    case "chain":
      return "#FFE000";

    case "game":
      return "#F4007A";

    default:
      return "#FFE000";
  }
}

function getCategoryLabel(category: BuilderProfile["category"]) {
  switch (category) {
    case "mobile":
      return "MOBILE BUILDER";
    case "systems":
      return "SYSTEMS BUILDER";
    case "pixel":
      return "PIXEL BUILDER";
    case "model":
      return "MODEL BUILDER";
    case "data":
      return "DATA BUILDER";
    case "security":
      return "SECURITY BUILDER";
    case "infra":
      return "INFRA BUILDER";
    case "fullstack":
      return "FULL-STACK BUILDER";
    case "chain":
      return "CHAIN BUILDER";
    case "game":
      return "GAME BUILDER";
    default:
      return "BUILDER";
  }
}

export function buildCardSvg(profile: BuilderProfile): string {
  const width = CARD.width;
  const height = CARD.height;

  const green = "#086B3A";
  const cream = "#FFF9E8";
  const yellow = "#FFE000";
  const pink = "#F4007A";
  const ink = "#111111";

  const accent = getCategoryAccent(profile.category);
  const categoryLabel = getCategoryLabel(profile.category);

  const name = escapeXml(profile.name.toUpperCase());
  const stack = escapeXml(profile.stack.toUpperCase());
  const title = escapeXml(profile.title.toUpperCase());
  const builderId = escapeXml(profile.builderId);

  const stackLines = wrapText(stack, 28);

  const photoX = 76;
  const photoY = 250;
  const photoWidth = 928;
  const photoHeight = 560;

  const transform = getPhotoTransform(profile);

  const imageData = profile.imageDataUrl;

  const stackSvg = stackLines
    .slice(0, 2)
    .map(
      (line, index) => `
        <text
          x="76"
          y="${925 + index * 43}"
          font-family="Arial, Helvetica, sans-serif"
          font-size="34"
          font-weight="900"
          letter-spacing="1.5"
          fill="${ink}"
        >${escapeXml(line)}</text>
      `,
    )
    .join("");

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${width}"
  height="${height}"
  viewBox="0 0 ${width} ${height}"
>
  <defs>

    <clipPath id="photoClip">
      <rect
        x="${photoX}"
        y="${photoY}"
        width="${photoWidth}"
        height="${photoHeight}"
        rx="24"
      />
    </clipPath>

    <filter id="grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.06"/>
      </feComponentTransfer>
    </filter>

    <linearGradient
      id="photoOverlay"
      x1="0"
      y1="0"
      x2="0"
      y2="1"
    >
      <stop offset="0%" stop-color="#000000" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.18"/>
    </linearGradient>

  </defs>

  <!-- BASE -->
  <rect
    width="${width}"
    height="${height}"
    fill="${cream}"
  />

  <!-- TOP GREEN FIELD -->
  <rect
    x="0"
    y="0"
    width="${width}"
    height="220"
    fill="${green}"
  />

  <!-- LARGE DECORATIVE CIRCLE -->
  <circle
    cx="1015"
    cy="75"
    r="135"
    fill="${yellow}"
  />

  <circle
    cx="1015"
    cy="75"
    r="92"
    fill="none"
    stroke="${pink}"
    stroke-width="16"
  />

  <!-- DECORATIVE DOTS -->
  <g fill="${pink}">
    <circle cx="75" cy="78" r="7"/>
    <circle cx="105" cy="78" r="7"/>
    <circle cx="135" cy="78" r="7"/>
    <circle cx="165" cy="78" r="7"/>
  </g>

  <!-- HEADER -->
  <text
    x="76"
    y="72"
    font-family="Arial, Helvetica, sans-serif"
    font-size="23"
    font-weight="900"
    letter-spacing="5"
    fill="${cream}"
  >
    HACKER HOUSE
  </text>

  <text
    x="76"
    y="130"
    font-family="Georgia, Times New Roman, serif"
    font-size="58"
    font-weight="900"
    fill="${cream}"
  >
    GOA
  </text>

  <text
    x="76"
    y="177"
    font-family="Arial, Helvetica, sans-serif"
    font-size="18"
    font-weight="900"
    letter-spacing="4"
    fill="${yellow}"
  >
    EDITION 2026
  </text>

  <text
    x="780"
    y="180"
    font-family="Arial, Helvetica, sans-serif"
    font-size="18"
    font-weight="900"
    letter-spacing="3"
    fill="${cream}"
  >
    28—31 OCT
  </text>

  <!-- PHOTO BORDER -->
  <rect
    x="${photoX - 12}"
    y="${photoY - 12}"
    width="${photoWidth + 24}"
    height="${photoHeight + 24}"
    rx="32"
    fill="${ink}"
  />

  <!-- PHOTO -->
  <g clip-path="url(#photoClip)">
    <rect
      x="${photoX}"
      y="${photoY}"
      width="${photoWidth}"
      height="${photoHeight}"
      fill="#111"
    />

    <image
      href="${imageData}"
      x="${photoX + transform.left}"
      y="${photoY + transform.top}"
      width="${transform.width}"
      height="${transform.height}"
      preserveAspectRatio="none"
    />

    <rect
      x="${photoX}"
      y="${photoY}"
      width="${photoWidth}"
      height="${photoHeight}"
      fill="url(#photoOverlay)"
    />

    <rect
      x="${photoX}"
      y="${photoY}"
      width="${photoWidth}"
      height="${photoHeight}"
      filter="url(#grain)"
    />
  </g>

  <!-- PHOTO ACCENTS -->
  <rect
    x="${photoX}"
    y="${photoY}"
    width="20"
    height="150"
    fill="${accent}"
  />

  <rect
    x="${photoX + photoWidth - 20}"
    y="${photoY + photoHeight - 150}"
    width="20"
    height="150"
    fill="${pink}"
  />

  <!-- CATEGORY BADGE -->
  <rect
    x="76"
    y="850"
    width="360"
    height="48"
    rx="24"
    fill="${accent}"
  />

  <text
    x="100"
    y="882"
    font-family="Arial, Helvetica, sans-serif"
    font-size="18"
    font-weight="900"
    letter-spacing="2"
    fill="${ink}"
  >
    ${categoryLabel}
  </text>

  <!-- NAME -->
  <text
    x="76"
    y="985"
    font-family="Georgia, Times New Roman, serif"
    font-size="66"
    font-weight="900"
    fill="${green}"
  >
    ${name}
  </text>

  <!-- STACK -->
  ${stackSvg}

  <!-- BUILDER TITLE BLOCK -->
  <rect
    x="76"
    y="1025"
    width="928"
    height="160"
    fill="${green}"
  />

  <rect
    x="76"
    y="1025"
    width="18"
    height="160"
    fill="${accent}"
  />

  <text
    x="115"
    y="1070"
    font-family="Arial, Helvetica, sans-serif"
    font-size="16"
    font-weight="900"
    letter-spacing="4"
    fill="${yellow}"
  >
    BUILDER TITLE
  </text>

  <text
    x="115"
    y="1135"
    font-family="Georgia, Times New Roman, serif"
    font-size="42"
    font-weight="900"
    fill="${cream}"
  >
    ${title}
  </text>

  <!-- FOOTER -->
  <line
    x1="76"
    y1="1230"
    x2="1004"
    y2="1230"
    stroke="${ink}"
    stroke-width="3"
  />

  <text
    x="76"
    y="1275"
    font-family="Arial, Helvetica, sans-serif"
    font-size="17"
    font-weight="900"
    letter-spacing="3"
    fill="${ink}"
  >
    BUILDER ID
  </text>

  <text
    x="76"
    y="1310"
    font-family="monospace"
    font-size="25"
    font-weight="900"
    fill="${green}"
  >
    ${builderId}
  </text>

  <text
    x="1004"
    y="1275"
    text-anchor="end"
    font-family="Arial, Helvetica, sans-serif"
    font-size="17"
    font-weight="900"
    letter-spacing="3"
    fill="${ink}"
  >
    GOA · INDIA
  </text>

  <text
    x="1004"
    y="1310"
    text-anchor="end"
    font-family="Arial, Helvetica, sans-serif"
    font-size="17"
    font-weight="900"
    letter-spacing="2"
    fill="${ink}"
  >
    #FRAMEINGOA
  </text>

  <!-- DECORATIVE CORNER -->
  <path
    d="M 1010 1210 L 1045 1210 L 1045 1245"
    fill="none"
    stroke="${pink}"
    stroke-width="10"
  />

</svg>
`.trim();
}

export async function svgToPng(svg: string): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("PNG generation is only available in the browser.");
  }

  const blob = new Blob([svg], {
    type: "image/svg+xml;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  try {
    const image = new Image();

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Unable to render the Builder ID card."));
      image.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = CARD.width;
    canvas.height = CARD.height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Your browser could not create the PNG.");
    }

    context.clearRect(0, 0, CARD.width, CARD.height);
    context.drawImage(
      image,
      0,
      0,
      CARD.width,
      CARD.height,
    );

    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}
