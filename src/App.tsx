import Sketch, { P5 } from 'react-p5'

import './App.css'
import { orange, blue, bgColor, black, white } from './colors'
import {
  borderHeight,
  canvasWidth,
  canvasHeight,
  topLineArgs,
  botLineArgs,
  headerArgs,
  logsPos,
} from './constants'
import { createDots } from './createDots'
import { createHistory } from './createHistory'
import { createLongArray } from './createLongArray'
import { remap, customLog, adjustedClamp, customLog3 } from './utils'

// canvas center log
const consoleLog = ''

// scenario creation
const readingsArray = createLongArray()
const kegType = { tara: 10, size: 30 }

let temperature = '-5|0|1|0|1|2|HM20'
let rawRead = 30000
let rawWeight = 30 // between 0, 30kg
let count = 0

//
let timeOutStabilized = 0
let consoleReadValue = '0'
let transformPreviousRead = 0
let maxStabilizedRead = 0
let zeroLock = false
let calculatedWeight = 0
let previousRead = 0

const calculateNewMinimumWeight = (read: number, tara: number, size: number): number => {
  const transformRead = Math.round((read / 1000) * 100) / 100
  if (transformRead < tara * 0.25) {
    zeroLock = false
  }

  if (transformRead > tara) {
    if (Math.abs(transformPreviousRead - transformRead) < 0.5) {
      timeOutStabilized += 1
      if (timeOutStabilized > 6) {
        zeroLock = true
        maxStabilizedRead = transformRead
        previousRead = transformRead
      }
    } else {
      timeOutStabilized = 0
    }
  }
  if (transformRead < previousRead && zeroLock) {
    previousRead = transformRead
  }

  if (previousRead > tara && zeroLock) {
    if (maxStabilizedRead - tara > size) {
      calculatedWeight = remap(previousRead, tara, maxStabilizedRead, 0, size)
    } else {
      calculatedWeight = adjustedClamp(previousRead, tara)
    }
  } else {
    calculatedWeight = adjustedClamp(tara, tara)
  }

  consoleReadValue = customLog3(calculatedWeight)
  transformPreviousRead = transformRead
  return calculatedWeight
}

const timeToUpdateTemperature = 50

setInterval(() => {
  temperature = `-5|${readingsArray[count]}|1|0|1|2|HM20`
  if (count >= readingsArray.length - 1) count = 0
  rawWeight = calculateNewMinimumWeight(
    Number(temperature?.split('|')[1] ?? '00'),
    kegType?.tara,
    kegType?.size,
  )

  rawRead = Math.round(readingsArray[count])
  count += 1
}, timeToUpdateTemperature)

// canvas logs history
const logs: number[] = []
const logsWeights: number[] = []

export function App() {
  const setup = (p5: P5, canvasParentRef: Element) => {
    p5.createCanvas(canvasWidth, canvasHeight).parent(canvasParentRef)
    p5.background(...bgColor)
      .textSize(28)
      .textAlign('left')
  }

  const draw = (p5: P5) => {
    p5.background(...bgColor)
      .strokeWeight(2)
      .stroke('gray')
      .line(...topLineArgs)
      .line(...botLineArgs)
      .noStroke()
      .fill(...black)
      .rect(...headerArgs)

    logs.push(rawRead)
    logsWeights.push(rawWeight)

    createHistory(p5, logs, 'orangered', [
      40000,
      10000,
      borderHeight,
      canvasHeight - borderHeight,
    ])
    createHistory(p5, logsWeights, 'cyan', [30, 0, borderHeight, canvasHeight - borderHeight])

    createDots(
      p5,
      logs,
      logsWeights,
      [40000, 10000, borderHeight, canvasHeight - borderHeight],
      [30, 0, borderHeight, canvasHeight - borderHeight],
    )

    p5.fill(...orange)
      .text(customLog(rawRead), logsPos.log1, 32)
      .fill(...blue)
      .text(consoleReadValue, logsPos.log2, 32)
      .fill(...white)
      .text(consoleLog, logsPos.log3, 32)

      .fill(...blue)
      .text(`${customLog(rawWeight)}L`, logsPos.log4, 32)
      .fill(...white)
      .text(`timeout:${customLog(timeOutStabilized)}`, logsPos.log5, 32)

    p5.frameRate(60)

    if (logs.length > canvasWidth - borderHeight * 2) {
      logs.splice(0, 1)
      logsWeights.splice(0, 1)
    }
  }

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}
