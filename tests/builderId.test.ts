import { describe, expect, it } from "vitest";
import { createBuilderId } from "@/lib/builderId";
describe("builder id",()=>{it("is deterministic",()=>expect(createBuilderId("Hemal Parikh","Android Developer")).toBe(createBuilderId("Hemal Parikh","Android Developer")));it("matches format",()=>expect(createBuilderId("Hemal","Backend Developer")).toMatch(/^HH26-[A-Z0-9]{5}$/));});
