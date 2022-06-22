export const createLongArray = (max1 = 39000, max2 = 42000, min = 5000) => {
  const initial1 = new Array(15).fill(0).map((_, i) => Math.random() * 1000 * 0.1 + max1)
  const updating1a = new Array(15).fill(0).map((_, i) => max1 - i * 1000)
  const updating1b = new Array(10).fill(0).map((_, i) => max1 / 1.5 + i * 1000)
  const updating1c = new Array(10).fill(0).map((_, i) => max1 / 1.1 - i * 1000)
  const updating1d = new Array(18).fill(0).map((_, i) => max1 / 1.5 - i * 1000)
  const replacing1 = new Array(25).fill(0).map((_, i) => Math.random() * 1000 * 0.1 + min)
  const refreshing1 = new Array(25).fill(0).map((_, i) => min + i * 1500)

  const initial2 = new Array(15).fill(0).map((_, i) => Math.random() * 1000 * 0.1 + max2)
  const updating2a = new Array(20).fill(0).map((_, i) => max2 - i * 1000)
  const updating2b = new Array(10).fill(0).map((_, i) => max2 / 1.8 + i * 1000)
  const updating2c = new Array(30).fill(0).map((_, i) => max2 / 1.3 - i * 1000)
  const replacing2 = new Array(25).fill(0).map((_, i) => Math.random() * 1000 * 0.1 + min)
  const refreshing2 = new Array(25).fill(0).map((_, i) => min + i * 1500)

  return [
    ...initial1,
    ...updating1a,
    ...updating1b,
    ...updating1c,
    ...updating1d,
    ...replacing1,
    ...refreshing1,
    ...initial2,
    ...updating2a,
    ...updating2b,
    ...updating2c,
    ...replacing2,
    ...refreshing2,
  ]
}
