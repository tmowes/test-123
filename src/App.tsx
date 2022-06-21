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
import { remap, customLog, clamp, ajustedClamp } from './utils'

// canvas center log
let consoleLog = ''

// scenario creation
const readingsArray = createLongArray()
const kegType = { tara: 10, size: 30 }

// reading properties
const prevMinimumReads: number[] = []
let timeOut = 0

let temperature = '-5|0|1|0|1|2|HM20'
let rawRead = 30000
let rawWeight = 30 // between 0, 30kg
let count = 0

// 
let timeOutStabilized = 0
let consoleReadValue = '0'
let transformLastRead = 0
let maximumStabilizedValue = 0
let zeroLock = 0
let returnedValue = 0

  const calculateNewMinimumWeight = (read: number, tara: number, size: number): number => {
    const transformRead = Math.round((read / 1000) * 100) / 100
    if (transformRead < tara * 0.75) { zeroLock = 0 }
    if(transformRead > tara) {
      if(Math.abs(transformLastRead - transformRead) < 0.5) {
        timeOutStabilized += 1
        if (timeOutStabilized > 6) {
          zeroLock = 1
          maximumStabilizedValue = transformRead
        }
        consoleLog = 'Estabilizado'
      } else {
        timeOutStabilized = 0
        consoleLog = '!=='
      }
    } else {
      consoleLog = 'Aguardando'
    }



    if (zeroLock == 1 && transformRead > tara){
      if ((maximumStabilizedValue - tara) > size ){
        returnedValue = remap(transformRead, tara, maximumStabilizedValue, 0, size )
      } else {
        returnedValue = ajustedClamp(transformRead, tara)
      }
    } else {
      returnedValue = ajustedClamp(tara, tara)
    }

 
    consoleReadValue = String(returnedValue)
    
    transformLastRead = transformRead
  return returnedValue
}


const timeToUpdateTemperature = 100

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
const logsWeightAdjustment: number[] = []

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
    logsWeightAdjustment.push(rawWeight)

    createHistory(p5, logs, 'orangered', [
      40000,
      10000,
      borderHeight,
      canvasHeight - borderHeight,
    ])
    createHistory(p5, logsWeights, 'cyan', [30, 0, borderHeight, canvasHeight - borderHeight])

    // createHistory(p5, logsWeightAdjustment, 'black', [30, 0, borderHeight, canvasHeight - borderHeight])
    
    createDots(
      p5,
      logs,
      logsWeights,
      // logsWeightAdjustment,
      [40000, 10000, borderHeight, canvasHeight - borderHeight],
      [30, 0, borderHeight, canvasHeight - borderHeight],
      // [30, 0, borderHeight, canvasHeight - borderHeight],
    )
      
    p5.fill(...orange)
      .text(customLog(rawRead), logsPos.log1, 32)
      .fill(...blue)
      // .text(customLog(rawRead), logsPos.log2, 32)
      .text(consoleReadValue, logsPos.log2, 32)
      .fill(...white)
      .text(consoleLog, logsPos.log3, 32)

      .fill(...blue)
      .text(`${customLog(rawWeight - kegType.tara)}L`, logsPos.log4, 32)
      .fill(...white)
      .text(`timeout:${customLog(timeOut)}`, logsPos.log5, 32)

    p5.frameRate(60)
    if (logs.length > canvasWidth - borderHeight * 2) {
      logs.splice(0, 1)
      logsWeights.splice(0, 1)
      logsWeightAdjustment.splice(0, 1)
    }
  }

  return (
    <div className="App">
      <Sketch setup={setup} draw={draw} />
    </div>
  )
}
