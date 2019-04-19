// @flow

import Validator from 'validator'
import isEmpty from 'is-empty'
import type { FaceForm, FaceFormError } from '../models/modelRegister'

export function validateFaceRegister(data: FaceForm): FaceFormError {
  let errors = {
    name: { onoff: false, message: '' },
    department: { onoff: false, message: '' },
    email: { onoff: false, message: '' }
  }

  data.name = !isEmpty(data.name) ? data.name : ''
  data.department = !isEmpty(data.department) ? data.department : ''
  data.email = !isEmpty(data.email) ? data.email : ''

  // Name checks
  if (Validator.isEmpty(data.name)) {
    errors.name.onoff = true
    errors.name.message = 'Name field is required'
  }

  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email.onoff = true
    errors.email.message = 'Email field is required'
  } else if (!Validator.isEmail(data.email)) {
    errors.email.onoff = true
    errors.email.message = 'Email is invalid'
  }

  // Department checks
  if (Validator.isEmpty(data.department)) {
    errors.department.onoff = true
    errors.department.message = 'Department field is required'
  }

  return errors
}

export function validateCameraSetting(column: string, value: number) {
  switch (column) {
    case 'x': {
      if (value > 1280) {
        return { column: 'x', message: 'Exceed maximum coordinate' }
      } else if (value < 0) {
        return { column: 'x', message: 'Exceed minimum coordinate' }
      }
      break
    }
    case 'y': {
      if (value > 720) {
        return { column: 'y', message: 'Exceed maximum coordinate' }
      } else if (value < 0) {
        return { column: 'y', message: 'Exceed minimum coordinate' }
      }
      break
    }
    case 'width': {
      if (value > 1280) {
        return { column: 'width', message: 'Exceed maximum width' }
      } else if (value < 1) {
        return { column: 'width', message: 'Exceed minimum width' }
      }
      break
    }
    case 'height': {
      if (value > 720) {
        return { column: 'height', message: 'Exceed maximum height' }
      } else if (value < 1) {
        return { column: 'height', message: 'Exceed minimum height' }
      }
      break
    }
    default: {
    }
  }
}
