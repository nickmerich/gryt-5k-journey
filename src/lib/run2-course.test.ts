import { describe, test } from "node:test";
import { strictEqual } from "node:assert";
import { FINISH_EXTRA_M, LAP_M, LAPS } from "./run2-course";

describe("Run #02 course", () => {
  test("adds up to a 5K", () => strictEqual(LAP_M * LAPS + FINISH_EXTRA_M, 5000));
  test("uses six park laps", () => strictEqual(LAPS, 6));
});
