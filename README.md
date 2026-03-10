<div align="center">
<br>
<br>
<p>
  <img src="./.github/logo-light.svg#gh-light-mode-only" alt="Shifty" width="300">
  <img src="./.github/logo-dark.svg#gh-dark-mode-only" alt="Shifty" width="300">
</p>
<br>
<br>

[![DeepSource](https://deepsource.io/gh/deepsourcelabs/shifty.svg/?label=active+issues&show_trend=true&token=-guPFvlwSE5CSxHrlAc563Bz)](https://deepsource.io/gh/deepsourcelabs/shifty/?ref=repository-badge) [![DeepSource](https://deepsource.io/gh/deepsourcelabs/shifty.svg/?label=resolved+issues&show_trend=true&token=-guPFvlwSE5CSxHrlAc563Bz)](https://deepsource.io/gh/deepsourcelabs/shifty/?ref=repository-badge)

  <p>Shifty is a lightweight secrets generator designed for the web, crafted using TypeScript. It provides a straightforward way to generate secure secrets and passwords without any external dependencies.</p>

</div>

## Table of Contents

- [Installation](#installation)
- [Code Architecture](#code-architecture)
  - [Shifty Class](#shifty-class)
  - [Methods](#methods)
  - [Constructor](#constructor)
- [Usage](#usage)
- [Why use Shifty](#why-use-shifty)
- [Options](#options)
  - [Shifty](#shifty)
  - [Shifty.generate](#shiftygenerate)
- [How it Works](#how-it-works)
- [Examples](#examples)
  - [Basic Usage](#basic-usage)
  - [Customizing Length and Hardening](#customizing-length-and-hardening)
  - [Fallback Mechanism](#fallback-mechanism)
  - [Integrating with Node.js (Using built-in crypto module)](#integrating-with-nodejs-using-built-in-crypto-module)
  - [TypeScript Support](#typescript-support)

## Installation

```sh
yarn add @deepsource/shifty
```

## Code Architecture

#### Shifty Class

- `hardenPassword: boolean`
  
- `randomBuffer: Uint8Array`
  
- `defaultLength: number`
  
- `mode: "W3C" | "MS" | "Failover"`

#### Constructor

```Javascript
constructor(harden = true, defaultLength = DEFAULT_LENGTH)
```

- `harden`: This flag enables hardening the password using special characters.
  
- `defaultLength`: The default length of the secret string in case no value is passed to generate.

#### Methods
- `_validateCharacter(char: string): boolean`
Ensures the given character belongs to a valid character set.

- `char`: The character to validate.
generate(length?: number): string
Generates a secret string.

- `length`: (Optional) Length of the secret to be generated. If not provided, uses the default length.
  
- `populateBuffer(): void`
Populates the buffer using web crypto or failover.

- `_useCryptoRandomBuffer(): Uint8Array`
Generates a Uint8Array using the Web Crypto API.

- `_useFailoverRandomBuffer(): Uint8Array`
Generates a Uint8Array using the failover method. Note: This is not cryptographically safe.

## Usage

> Shifty is built for the browser and won't work with Node. You can use the built-in [crypto](https://nodejs.org/api/crypto.html#crypto) module instead.

```js
import Shifty from "@deepsource/shifty";

const shifty = new Shifty((harden = true), (defaultLength = 16));
shifty.generate((length = 12)); // G8qZt7PEha^s
```

## Why Use Shifty

- **Zero Dependencies**: Shifty is a lightweight generator designed for the web with no external dependencies. This means you can integrate it seamlessly into your projects without worrying about additional dependencies.

- **Built for Web Environments**: Shifty is optimized for the browser, providing a straightforward way to generate secure secrets and passwords in web applications. Its compatibility with the Web Crypto API ensures efficient cryptographic operations.

- **Fallback Mechanism for Compatibility**: Even if the browser lacks support for the Web Crypto API, Shifty gracefully handles the situation by employing a fallback mechanism. This ensures that you can still generate passwords, albeit without cryptographic security.

- **Customizable Length and Hardening**: With Shifty, you have control over the length of the generated secrets. Additionally, the `harden` option allows you to include special characters for added complexity and security.

- **TypeScript Support**: Shifty is built using TypeScript, which means you can enjoy the benefits of static typing and improved code maintainability while using this library in your projects.

## Options

##### `Shifty`

| Parameter       | Default | Description                                                         |
| --------------- | ------- | ------------------------------------------------------------------- |
| `harden`        | `true`  | This flag enables adding special characters in the generated secret |
| `defaultLength` | `16`    | Set the default length of the secrets generated                     |

##### `Shifty.generate`

| Parameter | Default                | Description                          |
| --------- | ---------------------- | ------------------------------------ |
| `length`  | `Shifty.defaultLength` | Length of the secret to be generated |

## How it works

The Web Crypto API is an interface allowing a script to use cryptographic primitives in order to build systems using cryptography. This library leverages the Web Crypto API to generate secrets and passwords for the web.

In case the browser does not support the Web Crypto API, the library uses a fallback, it generates the string using Math.random(). This is not cryptographically safe, but is still usable.

The algorithm for generating the password is quite simple

1. Generate a array of 8-bit unsigned integers using Uint8Array
2. Check if the browser crypto API is supported
   1. If the browser supports crypto, use the generate array as the seed to fill in with random values using window.crypto.getRandomValues
   2. Else use the fallback method, loop over the seed array, for every element, generate a random number between 0 to 255
3. Initalize the secret string
4. Start a while loop, until the length condition is matched
   1. Start a for loop over the generated numbers
   2. Convert the number to a character using `String.fromCharCode`
   3. If the character code is valid, append it to the secret string from step 3
   4. If the character limit is satisfied, break. Else, regenerate the seed array from step 2
5. Return the generated string

## Examples

#### Basic Usage

```javascript
import Shifty from "@deepsource/shifty";

const shifty = new Shifty(true, 16);
const generatedSecret = shifty.generate(12); // Example output: G8qZt7PEha^s
```

#### Customizing Length and Hardening

```javascript
const shifty = new Shifty(true, 20); // Set default length to 20
const hardenedSecret = shifty.generate(12); // Example output: G8qZt7PEha^s$#tR6&9
```

#### Fallback Mechanism

```javascript
const shifty = new Shifty(true, 16);
const generatedSecret = shifty.generate(12); // Example output (fallback): G8qZt7PEha^s
```

#### Integrating with Node.js (Using built-in crypto module)

```javascript
import { randomBytes } from 'crypto';

function generateRandomString(length) {
  return randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

const generatedSecret = generateRandomString(12); // Example output: 3a2fG7c1e8b9
```

#### Typescript Support

```javascript
import Shifty from "@deepsource/shifty";

const shifty = new Shifty(true, 16);
const generatedSecret: string = shifty.generate(12); // Example output: G8qZt7PEha^s
```
