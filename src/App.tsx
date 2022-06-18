import Sketch, { P5 } from 'react-p5'

import './App.css'
import { createLongArray } from './createLongArray'

type LineArgs = [number, number, number, number]

const kegType = {
  tara: 10,
  size: 30,
}

let prevMinimumReads: number[] = []
let previousTara = 0
let output = 0
let timeOut = 0
let maxValueWeightFirstRead = 0
let keepResetState = false
let valueReturnInterp = 0

let temperature = '-5|0|1|0|1|2|HM20'

let x = 0
const canvasWidth = 1240
const canvasHeight = 640

let timeout = 0
let rawRead = 0
let countReadings = 0

let y = canvasHeight * 0.2

const textSpace = 128

const borderHeight = 120

const readingsArray = createLongArray()

const isValidRead = (value: number, threshold: number) =>
  value >= threshold ? value : threshold

const calculateNewMinimumWeight = (read: number, tara: number, size: number): number => {
  const kegNetSize = tara * 1000
  const resetPoint = tara * 1000 * 0.75

  console.log(
    { read, tara, size },
    maxValueWeightFirstRead,
    '/',
    timeOut,
    'value:',
    valueReturnInterp,
  )

  let shouldReset = isValidRead(read, resetPoint) !== read || keepResetState
  valueReturnInterp = (size * read) / (maxValueWeightFirstRead + 1)
  // const shouldReturnEmpty = isValidRead(read, kegNetSize) !== read

  if (tara !== previousTara) {
    console.log('tara !== previousTara')
    timeOut = 14
    previousTara = tara
    shouldReset = true
  }

  if (shouldReset) {
    keepResetState = true
    console.log('shouldReset')
    if (read > kegNetSize) timeOut += 1
    output = Math.round(((read - kegNetSize) / 1000) * 2) / 2
    prevMinimumReads = []
    maxValueWeightFirstRead = Math.round(read * 2) / 2 - kegNetSize
    console.log(maxValueWeightFirstRead)

    if (timeOut > 17) keepResetState = false

    return tara
  }

  // if (shouldReturnEmpty) {
  //   console.log('shouldReturnEmpty')
  //   output = Math.round(((read - kegNetSize) / 1000) * 2) / 2
  //   return tara
  // }

  if (timeOut === 0) {
    console.log('timeOut === 0')
    if (size * 1000 < maxValueWeightFirstRead) {
      output = Math.round(((read - kegNetSize) / 1000) * 2) / 2
      prevMinimumReads.push(output)
    } else {
      console.log('timeOut === 0,valueReturnInterp')

      valueReturnInterp = Math.round(((size * read) / (maxValueWeightFirstRead + 1)) * 2) / 2

      prevMinimumReads = []

      prevMinimumReads.push(valueReturnInterp)
    }

    return Math.min(...prevMinimumReads) + tara
  }

  if (timeOut !== 0 && timeOut <= 15) {
    timeOut += 1
    prevMinimumReads = []
    keepResetState = true

    return tara
  }

  timeOut = 0
  return tara
}

const timeToUpdateTemperature = 800
let count = 0
setInterval(() => {
  temperature = `-5|${readingsArray[count]}|1|0|1|2|HM20`
  count += 1
  if (count > readingsArray.length - 1) count = 0
}, timeToUpdateTemperature)

const rawWeight = calculateNewMinimumWeight(
  Number(temperature?.split('|')[1] ?? '00'),
  kegType?.tara,
  kegType?.size,
)

const logsPos = {
  log1: (canvasWidth * 0) / 4 - textSpace * 0,
  log2: (canvasWidth * 1) / 4 - textSpace * 1,
  log3: (canvasWidth * 2) / 4 - textSpace * 2,
  log4: (canvasWidth * 3) / 4 - textSpace * 3,
  log5: (canvasWidth * 4) / 4 - textSpace * 4,
}

setInterval(() => {
  y = y < canvasHeight ? y + 5 : canvasHeight * 0.2
}, 100)

setInterval(() => {
  timeout = timeout < 15 ? timeout + 1 : 0
}, 100)

setInterval(() => {
  if (countReadings >= readingsArray.length - 1) countReadings = 0
  countReadings += 1
  rawRead = Math.round(readingsArray[countReadings])
}, 800)

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t // linear interpolation t{0,1}

const test = (m: number, max: number, value: number) => m - m * (value / max)

const readValue = 42000

const topLineArgs = [0, borderHeight, canvasWidth, borderHeight] as LineArgs
const botLineArgs = [
  0,
  canvasHeight - borderHeight,
  canvasWidth,
  canvasHeight - borderHeight,
] as LineArgs
const headerArgs = [0, 0, canvasWidth, 48] as LineArgs

const customLog = (value: number) => Math.round(value).toString()

const showValues = {
  orangeLineHeight: canvasHeight - rawRead / 100,
  blueLineHeight: canvasHeight - readValue / 100,
}

export function App() {
  const setup = (p5: P5, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef)
    p5.background(41, 49, 58).textSize(28).textAlign('left')
  }

  const draw = (p5: P5) => {
    x = x < canvasWidth ? x + 1 : 0
    p5.background(41, 49, 58, 2)
      .strokeWeight(2)
      .stroke('gray')
      .line(...topLineArgs)
      .line(...botLineArgs)
      .noStroke()
      .fill(0, 0, 0)
      .rect(...headerArgs)

      .fill(200, 62, 59)
      .ellipse(x, canvasHeight - rawRead / 100, 8)
      .fill(0, 102, 100)
      .ellipse(x, showValues.blueLineHeight, 8)

      .fill(127, 127, 127)
      .text(customLog(rawRead), logsPos.log1, 32)
      .fill(0, 102, 100)
      .text(customLog(rawRead), logsPos.log2, 32)
      .fill(200, 62, 59)
      .text(customLog(lerp(30, 0, test(30, 30000, rawRead))), logsPos.log3, 32)

      .fill(255, 255, 255)
      .text(customLog(timeout), logsPos.log4, 32)
      .fill(255, 255, 255)
      .text(customLog(timeout), logsPos.log5, 32)
      .frameRate(60)
  }

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}
