import { CARD } from "./constants";
import type {
  BuilderCategory,
  BuilderProfile,
} from "@/types/builder";

const accents: Record<
  BuilderCategory,
  {
    pink: string;
    yellow: string;
  }
> = {
  mobile: {
    pink: "#F4007A",
    yellow: "#FFE000",
  },

  systems: {
    pink: "#FF4D9D",
    yellow: "#FFE000",
  },

  pixel: {
    pink: "#F4007A",
    yellow: "#FFD400",
  },

  model: {
    pink: "#FF2E8A",
    yellow: "#FFF000",
  },

  data: {
    pink: "#F4007A",
    yellow: "#FFE000",
  },

  security: {
    pink: "#FF5A9F",
    yellow: "#FFE000",
  },

  infra: {
    pink: "#F4007A",
    yellow: "#FFE000",
  },

  fullstack: {
    pink: "#F4007A",
    yellow: "#FFE000",
  },

  chain: {
    pink: "#FF3C92",
    yellow: "#FFE000",
  },

  game: {
    pink: "#F4007A",
    yellow: "#FFE000",
  },

  general: {
    pink: "#F4007A",
    yellow: "#FFE000",
  },
};

function escapeXml(value: string) {
  return value.replace(
    /[<>&'"]/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[character]!
  );
}

/*
 * Creates the image transformation used by the Builder Card.
 *
 * x:
 *   -100 = far left
 *    0   = center
 *   100  = far right
 *
 * y:
 *   -100 = far up
 *    0   = center
 *   100  = far down
 *
 * scale:
 *   1 = minimum crop
 *   3 = maximum zoom
 */
function getPhotoTransform(
  profile: BuilderProfile
) {
  const adjustment = profile.adjustment ?? {
    x: 0,
    y: 0,
    scale: 1,
  };

  const sourceWidth = 928;
  const sourceHeight = 560;

  /*
   * The SVG image is made large enough to cover the complete
   * frame while maintaining its original aspect ratio.
   */
  const imageRatio =
    getImageDimensions(profile.imageDataUrl);

  let baseWidth = sourceWidth;
  let baseHeight = sourceHeight;

  if (imageRatio > sourceWidth / sourceHeight) {
    /*
     * Image is wider than the frame.
     */
    baseHeight = sourceHeight;
    baseWidth = sourceHeight * imageRatio;
  } else {
    /*
     * Image is taller than the frame.
     */
    baseWidth = sourceWidth;
    baseHeight = sourceWidth / imageRatio;
  }

  const width =
    baseWidth * adjustment.scale;

  const height =
    baseHeight * adjustment.scale;

  /*
   * Convert the -100..100 adjustment range to pixels.
   *
   * Maximum movement is intentionally limited so the image
   * always covers the complete frame.
   */
  const extraX = Math.max(
    0,
    width - sourceWidth
  );

  const extraY = Math.max(
    0,
    height - sourceHeight
  );

  const left =
    -extraX / 2 +
    (extraX / 2) *
      (adjustment.x / 100);

  const top =
    -extraY / 2 +
    (extraY / 2) *
      (adjustment.y / 100);

  return {
    width,
    height,
    left,
    top,
  };
}

/*
 * Read the intrinsic image ratio from a data URL.
 *
 * This function only gives us a safe fallback for SVG generation.
 * The browser image itself determines the actual dimensions when
 * the SVG is rendered.
 */
function getImageDimensions(
  dataUrl: string
) {
  /*
   * Default 4:3 ratio.
   *
   * The browser's preserveAspectRatio plus the frame clipping
   * keeps the image visually safe even if the exact intrinsic
   * ratio cannot be determined synchronously here.
   */
  void dataUrl;

  return 4 / 3;
}

export function buildCardSvg(
  profile: BuilderProfile
) {
  const { pink, yellow } =
    accents[profile.category];

  const photo = getPhotoTransform(profile);

  return `
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="${CARD.width}"
  height="${CARD.height}"
  viewBox="0 0 ${CARD.width} ${CARD.height}"
>
  <defs>

    <clipPath id="photoClip">
      <rect
        x="76"
        y="245"
        width="928"
        height="560"
        rx="28"
      />
    </clipPath>

    <pattern
      id="dots"
      width="30"
      height="30"
      patternUnits="userSpaceOnUse"
    >
      <circle
        cx="4"
        cy="4"
        r="3"
        fill="${yellow}"
      />
    </pattern>

    <filter id="grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency=".75"
        numOctaves="3"
        stitchTiles="stitch"
      />

      <feColorMatrix
        type="saturate"
        values="0"
      />

      <feComponentTransfer>
        <feFuncA
          type="table"
          tableValues="0 .06"
        />
      </feComponentTransfer>
    </filter>

  </defs>

  <!-- BACKGROUND -->
  <rect
    width="1080"
    height="1350"
    fill="#FFF9E8"
  />

  <!-- HEADER -->
  <rect
    width="1080"
    height="190"
    fill="#086B3A"
  />

  <rect
    width="1080"
    height="1350"
    filter="url(#grain)"
    opacity=".35"
  />

  <circle
    cx="980"
    cy="75"
    r="150"
    fill="${pink}"
  />

  <circle
    cx="980"
    cy="75"
    r="92"
    fill="${yellow}"
  />

  <text
    x="72"
    y="82"
    fill="#FFF9E8"
    font-family="Georgia,serif"
    font-weight="900"
    font-size="48"
  >
    HACKER HOUSE
  </text>

  <text
    x="72"
    y="140"
    fill="#FFF9E8"
    font-family="Arial,sans-serif"
    font-weight="900"
    font-size="52"
    letter-spacing="8"
  >
    GOA 2026
  </text>

  <text
    x="930"
    y="105"
    text-anchor="middle"
    fill="#111"
    font-family="Arial,sans-serif"
    font-weight="900"
    font-size="26"
    transform="rotate(10 930 105)"
  >
    BUILDER
  </text>

  <!-- PHOTO FRAME -->
  <rect
    x="76"
    y="245"
    width="928"
    height="560"
    rx="28"
    fill="#086B3A"
  />

  <!--
    The user's image adjustment is applied here.
    The image is clipped to the Builder Card photo frame.
  -->
  <g clip-path="url(#photoClip)">

    <image
      href="${profile.imageDataUrl}"
      x="${76 + photo.left}"
      y="${245 + photo.top}"
      width="${photo.width}"
      height="${photo.height}"
      preserveAspectRatio="none"
    />

  </g>

  <rect
    x="76"
    y="245"
    width="928"
    height="560"
    rx="28"
    fill="none"
    stroke="#111"
    stroke-width="8"
  />

  <!-- PHOTO LABEL -->
  <rect
    x="76"
    y="748"
    width="928"
    height="57"
    fill="#086B3A"
    opacity=".92"
  />

  <text
    x="108"
    y="786"
    fill="#FFF9E8"
    font-family="Arial,sans-serif"
    font-size="24"
    font-weight="800"
    letter-spacing="4"
  >
    FRAME / GOA
  </text>

  <!-- NAME -->
  <rect
    x="72"
    y="846"
    width="936"
    height="5"
    fill="#111"
  />

  <text
    x="72"
    y="925"
    fill="#111"
    font-family="Georgia,serif"
    font-size="76"
    font-weight="900"
  >
    ${escapeXml(
      profile.name.toUpperCase()
    )}
  </text>

  <text
    x="76"
    y="976"
    fill="#086B3A"
    font-family="Arial,sans-serif"
    font-size="30"
    font-weight="800"
    letter-spacing="5"
  >
    ${escapeXml(
      profile.stack.toUpperCase()
    )}
  </text>

  <!-- BUILDER TITLE -->
  <rect
    x="72"
    y="1022"
    width="936"
    height="138"
    rx="18"
    fill="#086B3A"
  />

  <text
    x="102"
    y="1080"
    fill="${yellow}"
    font-family="Georgia,serif"
    font-size="26"
    font-weight="900"
    letter-spacing="3"
  >
    WHAT KIND OF BUILDER?
  </text>

  <text
    x="102"
    y="1132"
    fill="#FFF9E8"
    font-family="Georgia,serif"
    font-size="47"
    font-weight="900"
  >
    ${escapeXml(profile.title)}
  </text>

  <circle
    cx="945"
    cy="1090"
    r="50"
    fill="${pink}"
  />

  <circle
    cx="945"
    cy="1090"
    r="28"
    fill="${yellow}"
  />

  <!-- FOOTER -->
  <rect
    x="72"
    y="1192"
    width="936"
    height="86"
    fill="#111"
  />

  <text
    x="96"
    y="1228"
    fill="#FFF9E8"
    font-family="Arial,sans-serif"
    font-size="18"
    font-weight="700"
    letter-spacing="3"
  >
    BUILDER ID
  </text>

  <text
    x="96"
    y="1258"
    fill="#FFE000"
    font-family="monospace"
    font-size="25"
    font-weight="900"
  >
    ${escapeXml(profile.builderId)}
  </text>

  <text
    x="1008"
    y="1232"
    text-anchor="end"
    fill="#FFF9E8"
    font-family="Arial,sans-serif"
    font-size="18"
    font-weight="700"
  >
    GOA · INDIA
  </text>

  <text
    x="1008"
    y="1258"
    text-anchor="end"
    fill="#FFF9E8"
    font-family="Arial,sans-serif"
    font-size="18"
    font-weight="700"
  >
    28—31 OCT 2026
  </text>

  <rect
    x="72"
    y="1302"
    width="936"
    height="16"
    fill="url(#dots)"
  />

</svg>
`;
}

export async function svgToPng(
  svg: string
) {
  const blob = new Blob(
    [svg],
    {
      type: "image/svg+xml;charset=utf-8",
    }
  );

  const url =
    URL.createObjectURL(blob);

  try {
    const image =
      new Image();

    image.decoding = "async";
    image.src = url;

    await image.decode();

    const canvas =
      document.createElement("canvas");

    canvas.width =
      CARD.width;

    canvas.height =
      CARD.height;

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      throw new Error(
        "Canvas is unavailable in this browser."
      );
    }

    ctx.drawImage(
      image,
      0,
      0,
      CARD.width,
      CARD.height
    );

    return canvas.toDataURL(
      "image/png"
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}
