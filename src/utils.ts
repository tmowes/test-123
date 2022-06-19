/* eslint-disable no-nested-ternary */
export const lerp = (start: number, stop: number, amt: number) => amt * (stop - start) + start // linear interpolation t{0,1}

export const remap = (
  n: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number,
) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2

export const customLog = (value: number) => Math.round(value).toString()

export const clamp = (n: number, min: number, max: number) =>
  n > max ? max : n < min ? min : n
