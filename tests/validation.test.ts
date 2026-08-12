import { describe, expect, it } from "vitest";
import { validateBuilderInput } from "@/lib/validation";
describe("validation",()=>{it("requires name",()=>expect(validateBuilderInput("","Android").success).toBe(false));it("accepts valid data",()=>expect(validateBuilderInput("Hemal","Android Developer").success).toBe(true));});
