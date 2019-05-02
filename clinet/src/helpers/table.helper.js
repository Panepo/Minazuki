// @flow

export function desc(a: Object, b: Object, orderBy: string): 1 | 0 | -1 {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export function stableSort(array: any[], cmp: any) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  // $flow-disable-line
  return stabilizedThis.map(el => el[0])
}

export function getSorting(order: 'asc' | 'desc', orderBy: string) {
  return order === 'desc'
    ? (a: Object, b: Object) => desc(a, b, orderBy)
    : (a: Object, b: Object) => -desc(a, b, orderBy)
}
