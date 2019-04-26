import type { PeopleData } from '../models/modelPeople'

export function extractImagePath(input: PeopleData[]): string[] {
  const output = []
  input.forEach((data: PeopleData) =>
    data.files.forEach((file: string) =>
      output.push({ img: file, title: data.name, cols: 1 })
    )
  )
  return output
}
