# Picasso

![](https://cdn.britannica.com/79/91479-050-24F98E12/Guernica-canvas-Pablo-Picasso-Madrid-Museo-Nacional-1937.jpg)

A generic client-side implementation of [Google's Picasso research paper](https://ai.google/research/pubs/pub45581) taken from [Antoine Vastel's proof of concept](https://github.com/antoinevastel/picasso-like-canvas-fingerprinting).

## Usage

```js
import {
  randomGenerator,
  renderCanvas,
  hashCanvasData,
} from "picasso-fingerprint"

// these values should be issued by a server and remain
// consistent across different challenges with the only
// the seed changing.
const seed = 20

const prng = randomGenerator({
  seed,
  multiplier: 150000,
  offsetParameter: 2001000001,
})

const canvas = renderCanvas({
  prng,
  area: {
    width: 200,
    height: 200,
  },
  fontSizeFactor: 1.5,
  iterations: 5,
  maxShadowBlur: 50,
})

const hash = hashCanvasData(canvas, seed)
console.log(hash) // 5c1e958b0263acd45d9eff44b0e012fb
```

If you have a pseudorandom number generator of your choice, you can replace the built in one by swapping the prng in `renderCanvas` with an object that satisfies the following interface

```ts
type Prng = {
  offsetParameter: number
  next(): number
}
```

If you're using an [Odd Eye](https://github.com/xetera/odd-eye) compatible server, you can request and solve a challenge automatically.

```js
import { solveChallenge } from "picasso-fingerprint"
// retrieve the full fingerprint payload from the server after solving the challenge
const base64Response = await solveChallenge("https://your-odd-eye-server.com/challenge")

await fetch("https://api.your-server.com", {
  method: "POST",
  headers: {
    "X-Identity": base64Response
  },
  body: JSON.stringify(...)
})
```

## Limitations

There is currently no way of checking whether a response being sent to a picasso server originates from a seed that was issued by a challenge. This can be done server side using cookies to keep track of clients. Usually this would not be possible for fingerprinting, but because picasso is not about tracking users across browsers, but rather solving canvas challenges, it's a viable option.

You may want to add a layer of obfuscation on top of this library if you're using it in your own site just to make things a little bit harder to reverse. Picasso is designed to work in a system where an attacker has full knowledge of the challenge's inner workings, but a little bit of extra obfuscation wouldn't hurt.
