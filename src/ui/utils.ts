export function getLast5Years(): number[] {
  let result: number[] = []
  const lastYear = new Date().getFullYear() - 1
  for (let i = 0, diff = 4; i < 5; i++, diff--) {
    result[i] = lastYear - diff
  }
  return result
}
