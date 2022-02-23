import { assert, describe, it, beforeEach, afterEach, vi } from "vitest";
import Shifty from "../src/shifty";
import nodeCrypto from "crypto";

describe("Validate Characters Method", () => {
  it.concurrent("Doesn't allow special characters when not hardened", () => {
    const shft = new Shifty(false);
    const specialChars = "!@#$%^&*()_+{}:\"<>?|[];',./`~";

    specialChars.split("").forEach((char) => {
      // @ts-ignore
      assert(shft._validateCharacter(char) === false);
    });
  });

  it.concurrent("Allow special characters when hardened", () => {
    const shft = new Shifty(true);
    const specialChars = "!@#$%^&*()_+{}:\"<>?|[];',./`~";

    specialChars.split("").forEach((char) => {
      // @ts-ignore
      assert(shft._validateCharacter(char) === true);
    });
  });

  it.concurrent("Allows valid characters", () => {
    const shft = new Shifty(true);
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~".split("");
    const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const numbers = "0123456789".split("");

    [...specials, ...lowercase, ...uppercase, ...numbers].forEach((char) => {
      // @ts-ignore
      assert(shft._validateCharacter(char) === true);
    });
  });

  it.concurrent("Does not allow non standard characters", () => {
    const shft = new Shifty(true);
    const badChars = "ΩŁ®Ŧ¥↑ØÞ˚¯ł¶ŧ←↓→øþ";

    badChars.split("").forEach((char) => {
      // @ts-ignore
      assert(shft._validateCharacter(char) === false);
    });
  });
});

describe("Generate Method on Fallback", () => {
  it.concurrent("Generates default length", () => {
    const defaultLength = 20;
    const shft = new Shifty(true, defaultLength);
    assert(shft.generate().length === defaultLength);
  });

  it.concurrent("Generates asked length", () => {
    const shft = new Shifty(true, 20);
    assert(shft.generate(100).length === 100);

    const shftWithoutDefault = new Shifty(true);
    assert(shftWithoutDefault.generate(100).length === 100);
  });

  it.concurrent("Generates asked length with special chars", () => {
    const shft = new Shifty();
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~".split("");

    for (let loopIndex = 0; loopIndex < 100; loopIndex++) {
      assert(
        shft
          .generate(100)
          .split("")
          .some((char) => specials.includes(char))
      );
    }
  });

  it.concurrent("Generates asked length without special chars", () => {
    const shft = new Shifty(false);
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~".split("");

    for (let loopIndex = 0; loopIndex < 100; loopIndex++) {
      assert(
        shft
          .generate(100)
          .split("")
          .every((char) => !specials.includes(char))
      );
    }
  });
});

describe("Generate Method with Web Crypto", () => {
  beforeEach(() => {
    delete window.crypto;
    // @ts-ignore
    window.crypto = {
      getRandomValues: vi.fn(),
    };
    const spy = vi.spyOn(window.crypto, "getRandomValues");

    spy.mockImplementation((buffer) => {
      // @ts-ignore
      return nodeCrypto.randomFillSync(buffer);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("Generates default length", () => {
    const defaultLength = 20;
    const shft = new Shifty(true, defaultLength);
    assert(shft.generate().length === defaultLength);
  });

  it("Generates asked length", () => {
    const shft = new Shifty(true, 20);
    assert(shft.generate(100).length === 100);

    const shftWithoutDefault = new Shifty(true);
    assert(shftWithoutDefault.generate(100).length === 100);
  });

  it("Generates asked length with special chars", () => {
    const shft = new Shifty();
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~".split("");

    for (let loopIndex = 0; loopIndex < 100; loopIndex++) {
      assert(
        shft
          .generate(100)
          .split("")
          .some((char) => specials.includes(char))
      );
    }
  });

  it("Generates asked length without special chars", () => {
    const shft = new Shifty(false);
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~".split("");

    for (let loopIndex = 0; loopIndex < 100; loopIndex++) {
      assert(
        shft
          .generate(100)
          .split("")
          .every((char) => !specials.includes(char))
      );
    }
  });
});
