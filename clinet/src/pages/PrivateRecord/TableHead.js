// @flow

import type { MuiTableHead } from '../../componments/MucTableHead'

export const tableHead: MuiTableHead[] = [
  { id: 'photo', numeric: false, disablePadding: true, label: '' },
  { id: 'name', numeric: false, disablePadding: false, label: 'Name' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' }
]
