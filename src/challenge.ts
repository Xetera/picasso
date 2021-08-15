import { renderCanvas } from "./canvas"
import { hashCanvasData } from "./hash"
import { randomGenerator } from "./prng"
import mapValues from "lodash/mapValues"

type Uuid = string
type Hash = string

export type OddEyeSettings = {
  seed: number
  multiplier: number
  iterations: number
  canvasWidth: number
  canvasHeight: number
  maxShadowBlur: number
  fontSizeFactor: number
  offsetParameter: number
}

export type OddEyeInput = {
  challenges: Record<Uuid, OddEyeSettings>
}

export type OddEyeResponse = {
  results: Record<Uuid, Hash>
}

function process(input: OddEyeInput): OddEyeResponse {
  return {
    results: mapValues(input.challenges, input => {
      const { seed } = input;
      const canvasData = renderCanvas({
        area: {
          width: input.canvasWidth,
          height: input.canvasHeight,
        },
        fontSizeFactor: input.fontSizeFactor,
        iterations: input.iterations,
        maxShadowBlur: input.maxShadowBlur,
        prng: randomGenerator({
          multiplier: input.multiplier,
          offsetParameter: input.offsetParameter,
          seed,
        }),
      })
      return hashCanvasData(canvasData, seed)
    })
  }
}

/**
 * Automatically retrieves and solves a challenge from an {@link https://github.com/Xetera/odd-eye Odd Eye}-compatible server.
 * @param url The challenge URL of the server
 */
export async function solveChallenge(url: string): Promise<string> {
  const config: OddEyeInput = await fetch(url).then((res) => res.json())
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(process(config)),
    credentials: "include"
  }).then((res) => res.json())
}
