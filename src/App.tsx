import Sketch, { P5 } from 'react-p5'

import './App.css'
import { createLongArray } from './temp/createLongArray'

const readingsArray = createLongArray()

let x = 0
const canvasWidth = 960
const canvasHeight = 640

let timeout = 0
let read = 0
let countReadings = 0

let y = canvasHeight * 0.2

const textSpace = 128

setInterval(() => {
  y = y < canvasHeight ? y + 5 : canvasHeight * 0.2
}, 100)

setInterval(() => {
  timeout = timeout < 15 ? timeout + 1 : 0
}, 100)

setInterval(() => {
  if (countReadings >= readingsArray.length - 1) countReadings = 0
  countReadings += 1
  read = Math.round(readingsArray[countReadings])
}, 800)

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t // linear interpolation t{0,1}

// const rate = (read: number): number => lerp(0, canvasHeight, read / 100)

const test = (m: number, max: number, value: number) => m - m * (value / max)
// = 30 *  30000/31000
// = $D$6 * C7/$C$6

export function App() {
  const setup = (p5: P5, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef)
    p5.background(41, 49, 58)
  }

  const draw = (p5: P5) => {
    x = x < canvasWidth ? x + 1 : 0
    timeout += 1
    p5.background(41, 49, 58, 33)
    p5.fill(200, 62, 59)
      .ellipse(x, canvasHeight - y - 100, 8)
      .noStroke()
    p5.fill(0, 102, 100)
      .ellipse(x, y + 50, 8)
      .noStroke()
    p5.fill(255, 255, 255)
      .ellipse(x, 120 - read / 1000, 8)
      .noStroke()
    p5.fill(0, 0, 0).rect(0, 0, canvasWidth, 48)
    p5.textSize(28)
    p5.fill(255, 255, 255).text(
      read.toString().padStart(3, '0'),
      canvasWidth - textSpace / 2,
      32,
    )

    p5.fill(0, 102, 100).text(
      (x - 164).toString().padStart(3, '0'),
      canvasWidth - textSpace * 2,
      32,
    )
    p5.fill(200, 62, 59).text(
      lerp(30, 0, test(30, 30000, read)).toString(),
      canvasWidth - textSpace * 4,
      32,
    )

    p5.fill(255, 255, 255).text(timeout.toString().padStart(3, '0'), 16, 32)
    // p5.frameRate(30)
  }

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}
