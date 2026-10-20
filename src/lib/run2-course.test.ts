import { describe, expect, it } from "vitest";
import { FINISH_EXTRA_M, LAP_M, LAPS } from "./run2-course";

describe("Run #02 course", () => {
  it("adds up to a 5K", () => {
    expect(LAP_M * LAPS + FINISH_EXTRA_M).toBe(5000);
  });
  it("uses six park laps", () => {
    expect(LAPS).toBe(6);
  });
});
