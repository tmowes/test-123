/* eslint-disable no-nested-ternary */
export const lerp = (start: number, stop: number, amt: number) => amt * (stop - start) + start // linear interpolation t{0,1}

export const remap = (
  n: number, //valor lido
  start1: number, //valor 0 + tara
  stop1: number, // max 41000
  start2: number, // valor 0 min barril
  stop2: number, //max barril - peso do barril (30)
) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2

export const customLog = (value: number) => Math.round(value).toString()

export const clamp = (n: number, min: number, max: number) =>
  n > max ? max : n < min ? min : n
