export type PrngOptions = {
  seed: number
  offsetParameter: number
  multiplier: number
}

export type Prng = {
  offsetParameter: number
  next(): number
}

export function randomGenerator(opts: PrngOptions): Prng {
  let currentNumber = opts.seed % opts.offsetParameter
  if (currentNumber <= 0) {
    currentNumber += opts.offsetParameter
  }

  return {
    offsetParameter: opts.offsetParameter,
    next(): number {
      currentNumber = opts.multiplier * currentNumber % opts.offsetParameter
      return currentNumber
    }
  }
}
