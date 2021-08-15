import { Prng } from "./prng"

export type Sized = { width: number; height: number }

export type CanvasParams = {
  prng: Prng
  iterations: number
  area: Sized
  fontSizeFactor: number
  maxShadowBlur: number
}

export class CanvasRenderError extends Error { }

export type CanvasPrimitiveRenderer<T = void> = (
  prng: Prng,
  context: CanvasRenderingContext2D,
  area: Sized
) => T

export function renderCanvas(opts: CanvasParams): string {
  const { area, prng, fontSizeFactor, maxShadowBlur, iterations } = opts

  function adaptRandomNumberToContext(
    randomNumber: number,
    maxBound: number,
    floatAllowed = false
  ) {
    randomNumber = (randomNumber - 1) / prng.offsetParameter
    if (floatAllowed) {
      return randomNumber * maxBound
    }

    return Math.floor(randomNumber * maxBound)
  }

  const addRandomCanvasGradient: CanvasPrimitiveRenderer = (
    prng,
    context,
    area
  ) => {
    const canvasGradient = context.createRadialGradient(
      adaptRandomNumberToContext(prng.next(), area.width),
      adaptRandomNumberToContext(prng.next(), area.height),
      adaptRandomNumberToContext(prng.next(), area.width),
      adaptRandomNumberToContext(prng.next(), area.width),
      adaptRandomNumberToContext(prng.next(), area.height),
      adaptRandomNumberToContext(prng.next(), area.width)
    )
    canvasGradient.addColorStop(
      0,
      colors[adaptRandomNumberToContext(prng.next(), colors.length)]
    )
    canvasGradient.addColorStop(
      1,
      colors[adaptRandomNumberToContext(prng.next(), colors.length)]
    )
    context.fillStyle = canvasGradient
  }

  const generateRandomWord = (prng: Prng, wordLength: number) => {
    const minAscii = 65
    const maxAscii = 126
    const wordGenerated = []
    for (let i = 0; i < wordLength; i++) {
      const asciiCode = minAscii + (prng.next() % (maxAscii - minAscii))
      wordGenerated.push(String.fromCharCode(asciiCode))
    }

    return wordGenerated.join("")
  }

  if (!window.CanvasRenderingContext2D) {
    return "unknown"
  }


  const primitives: CanvasPrimitiveRenderer[] = [
    function arc(prng, context, area) {
      context.beginPath()
      context.arc(
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height),
        adaptRandomNumberToContext(
          prng.next(),
          Math.min(area.width, area.height)
        ),
        adaptRandomNumberToContext(prng.next(), 2 * Math.PI, true),
        adaptRandomNumberToContext(prng.next(), 2 * Math.PI, true)
      )
      context.stroke()
    },
    function text(prng, context, area) {
      const wordLength = Math.max(
        1,
        adaptRandomNumberToContext(prng.next(), 5)
      )
      const textToStroke = generateRandomWord(prng, wordLength)
      context.font = `${area.height / fontSizeFactor}px stan dreamcatcher`

      context.strokeText(
        textToStroke,
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height),
        adaptRandomNumberToContext(prng.next(), area.width)
      )
    },
    function bezierCurve(prng, context, area) {
      context.beginPath()
      context.moveTo(
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height)
      )
      context.bezierCurveTo(
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height),
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height),
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height)
      )
      context.stroke()
    },
    function quadraticCurve(prng, context, area) {
      context.beginPath()
      context.moveTo(
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height)
      )
      context.quadraticCurveTo(
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height),
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height)
      )
      context.stroke()
    },
    function ellipse(prng, context, area) {
      context.beginPath()
      context.ellipse(
        adaptRandomNumberToContext(prng.next(), area.width),
        adaptRandomNumberToContext(prng.next(), area.height),
        adaptRandomNumberToContext(prng.next(), Math.floor(area.width / 2)),
        adaptRandomNumberToContext(prng.next(), Math.floor(area.height / 2)),
        adaptRandomNumberToContext(prng.next(), 2 * Math.PI, true),
        adaptRandomNumberToContext(prng.next(), 2 * Math.PI, true),
        adaptRandomNumberToContext(prng.next(), 2 * Math.PI, true)
      )

      context.stroke()
    },
  ]

  const canvasElt = document.createElement("canvas")
  canvasElt.width = area.width
  canvasElt.height = area.height
  canvasElt.style.display = "none"
  const context = canvasElt.getContext("2d")
  if (!context) {
    throw new Error("Could not get rendering context for canvas")
  }
  for (let i = 0; i < iterations; i++) {
    addRandomCanvasGradient(prng, context, area)
    context.shadowBlur = adaptRandomNumberToContext(
      prng.next(),
      maxShadowBlur
    )
    context.shadowColor =
      colors[adaptRandomNumberToContext(prng.next(), colors.length)]
    const randomPrimitive =
      primitives[adaptRandomNumberToContext(prng.next(), primitives.length)]
    randomPrimitive(prng, context, area)
    context.fill()
  }

  return canvasElt.toDataURL()
}

const colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
]
