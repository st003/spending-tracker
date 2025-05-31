const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function getMonthLabels(): string[] {
  let labels: string[] = []

  for (let i = 0, start = new Date().getMonth(); i < 12; i++, start++) {
    if (start > 11) start = 0
    labels.push(MONTHS[start])
  }

  return labels
}

export function getYearLabels(pastNumYears: number): string[] {
  let labels: string[] = []

  const lastYear = new Date().getFullYear() - 1
  for (let i = (pastNumYears - 1); i >= 0; i--) {
    labels.push(String(lastYear - i))
  }

  return labels
}
