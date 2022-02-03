<div align="center">

# Shifty

  <p>Shifty is a tiny secrets generator, built using TypeScript for the web</p>

</div>

## Installation

```sh
yarn add @deepsourcelabs/shifty
```

## Usage

```js
import Shifty from '@deepsourcelabs/shifty'

const shifty = new Shifty(harden=true, defaultLength=16)
shifty.generate(length=12) // G8qZt7PEha^s
```

### Options

##### `Shifty`

| Parameter       | Default | Description                                                         |
|-----------------|---------|---------------------------------------------------------------------|
| `harden`        | `true`  | This flag enables adding special characters in the generated secret |
| `defaultLength` | `16`      | Set the default length of the secrets generated                     |


##### `Shifty.generate`

| Parameter       | Default                | Description                                     |
|-----------------|------------------------|-------------------------------------------------|
| `length`        | `Shifty.defaultLength` | Length of the secret to be generated            |

## How it works

cryptographic primitives in order to build systems using cryptography. This library leverages the Web Crypto API to generate secrets and passwords for the web.

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
