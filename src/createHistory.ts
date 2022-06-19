import { P5 } from 'react-p5'

import { borderHeight } from './constants'
import { remap } from './utils'

export const createHistory = (
  p5: P5,
  arr: number[],
  color: string,
  remapArgs: [number, number, number, number],
) => {
  p5.beginShape()
  for (let i = 0; i < arr.length; i++) {
    p5.stroke(color)
      .noFill()
      .vertex(borderHeight + i, remap(arr[i], ...remapArgs))
  }
  p5.endShape()
}
