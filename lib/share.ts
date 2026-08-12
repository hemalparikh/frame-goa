import type { BuilderProfile } from "@/types/builder";
import { APP_URL } from "./constants";

export function makeCaption(profile: Pick<BuilderProfile, "stack" | "title">, shareUrl?: string) {
  return `Meet my Hacker House Goa 2026 builder identity.\n\nI'm a ${profile.stack}.\nMy builder title:\n${profile.title}\n\nBuild yours → ${shareUrl ?? APP_URL}\n\n#FrameInGoa`;
}

export function makeXIntent(text: string) {
  return `https://x.com/intent/post?text=${encodeURIComponent(text)}`;
}
