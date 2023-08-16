import { describe, expect, it } from "vitest";

import { minLength } from "./validators";

describe(minLength, () => {
  it("returns message when value is shorter than minimum", () => {
    const inputElement = document.createElement("input");
    inputElement.name = "name";
    inputElement.value = "a";
    expect(minLength(3)(inputElement)).toEqual(`name should be longer than 3`);
  });

  it("returns undefined when value is equal to minimum", () => {
    const inputElement = document.createElement("input");
    inputElement.name = "name";
    inputElement.value = "aaa";
    expect(minLength(3)(inputElement)).toBeUndefined();
  });

  it("returns undefined when value is longer than minimum", () => {
    const inputElement = document.createElement("input");
    inputElement.name = "name";
    inputElement.value = "aaaa";
    expect(minLength(3)(inputElement)).toBeUndefined();
  });
});
