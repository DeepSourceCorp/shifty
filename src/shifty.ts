/**
 * The Web Crypto API is an interface allowing a script to use
 * cryptographic primitives in order to build systems using cryptography.
 * This library leverages the Web Crypto API to generate secrets and passwords for the web
 *
 * In case the browser does not support the Web Crypto API, the library uses a fallback, it generates
 * the string using Math.random(). This is not cryptographically safe, but is still usable.
 *
 * The algorithm for generating the password is quite simple
 *
 * 1. Generate a array of 8-bit unsigned integers using Uint8Array
 * 2. Check if the browser crypto API is supported
 *    2.1 If the browser supports crypto, use the generate array as the seed to fill in with random values using window.crypto.getRandomValues
 *    2.2 Else use the fallback method, loop over the seed array, for every element, generate a random number between 0 to 255
 * 3. Initalize the secret string
 * 4. Start a while loop, until the length condition is matched
 *    4.1 Start a for loop over the generated numbers
 *    4.2 Convert the number to a character using `String.fromCharCode`
 *    4.3 If the character code is valid, append it to the secret string from step 3
 *    4.4 If the character limit is satisfied, break. Else, regenerate the seed array from step 2
 * 5. Return the generated string
 *
 * MDN: https://developer.mozilla.org/en-US/docs/Web/API/Crypto
 */

const DEFAULT_LENGTH = 16;

export default class Shifty {
  private hardenPassword: boolean;
  private randomBuffer: Uint8Array;
  private defaultLength: number;
  private mode: "W3C" | "MS" | "Failover";

  /**
   * Constructor function
   * @param {boolean} [harden = true] - this hardens the password using special chars
   * @param {number} [defaultLength=DEFAULT_LENGTH] - the default length of the secret string in case no value is passed to generate
   * @return {void}
   */
  constructor(harden: boolean = true, defaultLength: number = DEFAULT_LENGTH) {
    this.hardenPassword = harden;
    this.randomBuffer = new Uint8Array(0);
    this.defaultLength = defaultLength;
    if (window.crypto) {
      this.mode = "W3C";
    } else {
      this.mode = "Failover";
      console.warn(
        "SHIFTY: Using failover method for generating secret, this uses Math.random() and is not cryptographically safe"
      );
    }
  }

  /**
   * Ensure the given character belongs to a valid character
   
   * @param {string} char
   * @return {boolean}
   */
  private _validateCharacter(char: string): boolean {
    const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~".split("");
    const lowercase = "abcdefghijklmnopqrstuvwxyz".split("");
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const numbers = "0123456789".split("");

    return [
      ...(this.hardenPassword ? specials : []),
      ...lowercase,
      ...uppercase,
      ...numbers,
    ].includes(char);
  }

  /**
   * Exposed generate function
   * @param {number} length
   * @return {string}
   */
  generate(length?: number): string {
    length = length ? length : this.defaultLength;

    this.populateBuffer();
    let secret = "";

    // The while loop ensures we always satisfy the length condition
    // If the inner loop ends before we have the password of the required length
    // the while loop will restart the inner loop
    while (secret.length < length) {
      for (
        let rollIndex = 0;
        rollIndex < this.randomBuffer.length;
        rollIndex++
      ) {
        // Generate character from the number
        const char = String.fromCharCode(this.randomBuffer[rollIndex]);
        if (this._validateCharacter(char)) {
          // Append the charcater to secret if it is valid
          secret += char;
        }

        if (secret.length === length) {
          break;
        }
      }
      // generate a new buffer to ensure we don't end up with repeating values
      this.populateBuffer();
    }

    return secret;
  }

  /**
   * Populate the buffer using web crypto or failover
   * @return {void}
   */
  private populateBuffer(): void {
    // Generate a Unit8Array, this has all possible ASCII characters
    this.randomBuffer =
      this.mode === "W3C"
        ? this._useCryptoRandomBuffer()
        : this._useFailoverRandomBuffer();
  }

  /**
   * Generate a Uint8 Array using web crypto API
   *
   * @return {Uint8Array}
   */
  private _useCryptoRandomBuffer(): Uint8Array {
    const seed = new Uint8Array(256);

    // The Crypto.getRandomBuffer() method lets you get cryptographically strong random values.
    // The array given as the parameter is filled with random numbers (random in its cryptographic meaning).
    return window.crypto.getRandomValues(seed);
  }

  /**
   * Generate a Uint8 Array using failsafe.
   * This is not cryptographically safe
   *
   * @return {Uint8Array}
   */
  private _useFailoverRandomBuffer(): Uint8Array {
    // not cryptographically safe
    const buffer = new Uint8Array(256);

    let randomNumberForCharacterGeneration = 0;
    for (let loopIndex = 0; loopIndex < buffer.length; loopIndex++) {
      while (1) {
        randomNumberForCharacterGeneration = Math.round(Math.random() * 256);
        if (
          randomNumberForCharacterGeneration >= 0 &&
          randomNumberForCharacterGeneration <= 255
        )
          break;
      }
      buffer[loopIndex] = randomNumberForCharacterGeneration;
    }

    return buffer;
  }
}
