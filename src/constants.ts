import { LineArgs } from './types'

// canvas constants
export const canvasWidth = 1240
export const canvasHeight = 640
export const textSpace = 128
export const borderHeight = 80
export const topLineArgs = [0, borderHeight, canvasWidth, borderHeight] as LineArgs
export const botLineArgs = [
  0,
  canvasHeight - borderHeight,
  canvasWidth,
  canvasHeight - borderHeight,
] as LineArgs
export const headerArgs = [0, 0, canvasWidth, 48] as LineArgs
export const logsPos = {
  log1: (canvasWidth * 0) / 4 - textSpace * 0,
  log2: (canvasWidth * 1) / 4 - textSpace,
  log3: (canvasWidth * 2) / 4 - textSpace * 2,
  log4: (canvasWidth * 3) / 4 - textSpace,
  log5: (canvasWidth * 4) / 4 - textSpace,
}
