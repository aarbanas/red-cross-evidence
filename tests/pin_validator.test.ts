import isOibValid from "../src/components/utils/pin_validator";

describe("isOibValid function", () => {
  it("incorrect OIB length", () => {
    expect(isOibValid(1)).toBe(false);
    expect(isOibValid(1234567891012)).toBe(false);
  });
  it("valid OIB", () => {
    expect(isOibValid(12345678903)).toBe(true);
    expect(isOibValid(98765432106)).toBe(true);
  });

  it("invalid OIB", () => {
    expect(isOibValid(12345678900)).toBe(false);
    expect(isOibValid(98765432108)).toBe(false);
  });
});
