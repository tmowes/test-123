import { P5 } from 'react-p5'

import { black, blue, orange } from './colors'
import { borderHeight } from './constants'
import { remap } from './utils'

export const createDots = (
  p5: P5,
  arr1: number[],
  arr2: number[],
  remapArgs1: [number, number, number, number],
  remapArgs2: [number, number, number, number],
  remapArgs3: [number, number, number, number],
) => {
  p5.noStroke()
    .fill(...orange)
    .ellipse(borderHeight + arr1.length - 1, remap(arr1[arr1.length - 1], ...remapArgs1), 14)
    .fill(...blue)
    .ellipse(borderHeight + arr1.length - 1, remap(arr2[arr1.length - 1], ...remapArgs2), 14)
    .fill(...black)
    .ellipse(borderHeight + arr1.length - 1, remap(arr2[arr1.length - 2], ...remapArgs3), 14)
}