import { describe, expect, it } from "vitest";
import { getBuilderIdentity } from "@/lib/builderTitles";
describe("builder title engine",()=>{it("detects mobile",()=>expect(getBuilderIdentity("Android Kotlin Developer").title).toBe("THE MOBILE ARCHITECT"));it("detects full stack first",()=>expect(getBuilderIdentity("Full Stack AI Engineer").title).toBe("THE FULL-STACK BUILDER"));it("falls back",()=>expect(getBuilderIdentity("Product Builder").title).toBe("THE BUILDING MACHINE"));});
