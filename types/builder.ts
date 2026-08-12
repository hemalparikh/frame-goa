export type BuilderCategory =
  | "mobile" | "systems" | "pixel" | "model" | "data"
  | "security" | "infra" | "fullstack" | "chain" | "game" | "general";

export interface BuilderProfile {
  name: string;
  stack: string;
  title: string;
  category: BuilderCategory;
  builderId: string;
  imageDataUrl: string;
}

export interface SharePayload {
  name: string;
  stack: string;
  title: string;
  category: BuilderCategory;
  builderId: string;
  imageDataUrl: string;
}
