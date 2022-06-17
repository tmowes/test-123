export const createLongArray = (max = 50000, min = 5000) => {
  const initial = new Array(22).fill(0).map((_, i) => Math.random() * 1000 * 0.1 + max)
  const updating = new Array(37).fill(0).map((_, i) => max - i * 1000)
  const replacing = new Array(5).fill(0).map((_, i) => Math.random() * 1000 * 0.1 + min)
  const refreshing = new Array(25).fill(0).map((_, i) => min + i * 1500)
  return [...initial, ...updating, ...replacing, ...refreshing]
}
