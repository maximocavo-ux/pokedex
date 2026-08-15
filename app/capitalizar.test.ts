import { describe, it, expect } from "vitest";
import { capitalizar } from "./capitalizar";

describe("capitalizar", () => {
  it("capitaliza un nombre simple", () => {
    expect(capitalizar("pikachu")).toBe("Pikachu");
  });

  it("capitaliza cada parte de un nombre con guion", () => {
    expect(capitalizar("mr-mime")).toBe("Mr-Mime");
  });

  it("capitaliza nombres con más de un guion", () => {
    expect(capitalizar("ho-oh")).toBe("Ho-Oh");
  });

  it("maneja un string vacío sin romperse", () => {
    expect(capitalizar("")).toBe("");
  });

  it("maneja un nombre con dos guiones seguidos", () => {
    expect(capitalizar("ho--oh")).toBe("Ho--Oh");
  });
});
