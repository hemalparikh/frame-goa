export type BuilderCategory =
  | "mobile"
  | "systems"
  | "pixel"
  | "model"
  | "data"
  | "security"
  | "infra"
  | "fullstack"
  | "chain"
  | "game"
  | "general";

export interface PhotoAdjustment {
  x: number;
  y: number;
  scale: number;
}

export interface BuilderProfile {
  name: string;
  stack: string;
  title: string;
  category: BuilderCategory;
  builderId: string;
  imageDataUrl: string;

  // Optional so existing code remains compatible.
  adjustment?: PhotoAdjustment;
  imageWidth?: number;
  imageHeight?: number;
}

export interface SharePayload {
  name: string;
  stack: string;
  title: string;
  category: BuilderCategory;
  builderId: string;
  imageDataUrl: string;

  adjustment?: PhotoAdjustment;
  imageWidth?: number;
  imageHeight?: number;
}
