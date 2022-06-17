
let prevMinimumReads: number[] = []
let previousTara = 0
let output = 0
let timeOut = 0
let maxValueWeightFirstRead = 0
let keepResetState = false
let valueReturnInterp = 0

export const calculateNewMinimumWeight = (
  read: number,
  tara: number,
  size: number,
): number => {
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

const isValidRead = (value: number, threshold: number) =>
  value >= threshold ? value : threshold
