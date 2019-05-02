// @flow

export function dateTransform(input: string) {
  const newDate = new Date(input)
  return newDate.toLocaleString()
}
