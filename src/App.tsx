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
import { remap, customLog, clamp } from './utils'

// canvas center log
let consoleLog = ''

// scenario creation
const readingsArray = createLongArray()
const kegType = { tara: 10, size: 30 }

// reading properties
const prevMinimumReads: number[] = []
let timeOut = 0
let previousTara = 0

let temperature = '-5|0|1|0|1|2|HM20'
let rawRead = 30000
let rawWeight = 30 // between 0, 30kg
let count = 0

//add
let maxReadValue = 0
let teste = 0

let readValue = '0'
let testeReadValue = 0
let lastRead = 0
let travaZeramento = 0


// const calculateNewMinimumWeight = (read: number, tara: number, size: number): number => {
//   const internalRead = Math.round((read / 1000) * 2) / 2
//   if (read > tara * 1000) {
//     if (Math.abs(lastRead - read) < 500) {
//       readValue =  String(Math.round(lastRead)) + String(Math.round(read))+ 'leitura proxima'
//     } else {
//       readValue = String(Math.round(lastRead)) + String(Math.round(read))+ 'leitura diferente'
//     }
//   } else {
//     readValue = String(Math.round(lastRead)) + String(Math.round(read))+  'aguardando leitura'
//   }

//   if (timeOut >= 30) {
//     timeOut = 0
//   }

//   if (previousTara !== tara) {
//     consoleLog = '(previousTara !== tara)'
//     timeOut = 20
//     previousTara = tara
//   }

//   if (internalRead < tara * 0.75) {
//     consoleLog = '(internalRead < tara * 0.75)'
//     timeOut = 1
//   }

//   if (timeOut !== 0) {
//     consoleLog = '(timeOut !== 0)'
//     timeOut += 1
//   if (timeOut > 26) {
//     maxReadValue = Math.round(read)
//   }
//   teste = Math.round(remap(read, 10000, maxReadValue, 0, 30 ))
//   lastRead = read
//     return clamp(tara, tara, size + tara)
//   }

  const calculateNewMinimumWeight = (read: number, tara: number, size: number): number => {
    const internalRead = Math.round((read / 1000) * 2) / 2
    const internalRead2 = Math.round((read) * 2) / 2
    let timeRead = 0
    if (read > tara * 1000) {
      if (Math.abs(lastRead - read) < 500) {
        readValue =  'estabilizado'
        timeOut += 1
        if(timeOut > 5){

          maxReadValue = Math.round(read)
          travaZeramento = 1
        }
      } else {
        readValue = '!='
        timeOut = 0
      }
    } else {
      readValue = clamp(tara, tara, size + tara) + 'aguardando'
    }
  
    // if (timeOut >= 30) {
    //   timeOut = 0
    // }
  
    // if (previousTara !== tara) {
    //   consoleLog = '(previousTara !== tara)'
    //   timeOut = 20
    //   previousTara = tara
    // }
  
    if (internalRead < tara * 0.75) {
      consoleLog = '(internalRead < tara * 0.75)'
      timeOut = 1
      travaZeramento = 0
    }
  
    // if (timeOut !== 0) {
    //   consoleLog = '(timeOut !== 0)'
    //   timeOut += 1
    // if (timeOut > 26) {
    //   maxReadValue = Math.round(read)
    // }
    // teste = Math.round(remap(read, 10000, maxReadValue, 0, 30 ))
    // lastRead = read
    //   return clamp(tara, tara, size + tara)
    // }

  // timeOut = 0
  consoleLog = 'timeOut = 0'
  if(travaZeramento == 1) {
    if (maxReadValue - (tara *1000) > size * 1000){
      if(internalRead2 > tara*1000){
        teste = remap(internalRead2, 10000, maxReadValue, 0, 30 )
        // timeRead = remap(internalRead2, 10000, maxReadValue, 0, 30 )
      } 
    } else {
      timeRead = clamp(internalRead, tara, size + tara)
      // return clamp(internalRead, tara, size + tara)
    }
  } else {
    teste = remap(tara * 1000, 10000, maxReadValue, 0, 30 )
    timeRead = remap(tara * 1000, 10000, maxReadValue, 0, 30 )
  }
  lastRead = read
  return timeRead
}


const timeToUpdateTemperature = 400

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
    logsWeightAdjustment.push(teste)

    createHistory(p5, logs, 'orangered', [
      40000,
      10000,
      borderHeight,
      canvasHeight - borderHeight,
    ])
    createHistory(p5, logsWeights, 'cyan', [40, 10, borderHeight, canvasHeight - borderHeight])

    createHistory(p5, logsWeightAdjustment, 'black', [30, 0, borderHeight, canvasHeight - borderHeight])
    
    createDots(
      p5,
      logs,
      logsWeights,
      logsWeightAdjustment,
      [40000, 10000, borderHeight, canvasHeight - borderHeight],
      [40, 10, borderHeight, canvasHeight - borderHeight],
      [30, 0, borderHeight, canvasHeight - borderHeight],
    )
      
    p5.fill(...orange)
      .text(customLog(rawRead), logsPos.log1, 32)
      .fill(...blue)
      // .text(customLog(rawRead), logsPos.log2, 32)
      .text(testeReadValue, logsPos.log2, 32)
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
