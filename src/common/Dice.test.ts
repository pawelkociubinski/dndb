import { rollDice } from "./Dice.js";

/**
 * Testing for randomness is tricky.
 * One way to test it is to see if the returned values are within the expected range.
 */
describe("Dice Roll Utilities", () => {
  it("should return a value between the minimum and maximum possible for the given dice expression", () => {
    //given
    const expression = "1d6";

    // when
    const result = rollDice(expression);

    //then
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(6);
  });

  it("should return a value between the minimum and maximum possible for the given dice expression with an additional roll", () => {
    // given
    const expression = "2d6";

    // when
    const result = rollDice(expression);

    // then
    expect(result).toBeGreaterThanOrEqual(2);
    expect(result).toBeLessThanOrEqual(12);
  });

  it("should return a value between the minimum and maximum possible for the given dice expression plus a modifier", () => {
    // given
    const expression = "1d6+3";

    //when
    const result = rollDice(expression);

    //then
    expect(result).toBeGreaterThanOrEqual(4);
    expect(result).toBeLessThanOrEqual(10);
  });
});
